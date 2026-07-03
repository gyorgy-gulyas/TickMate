/**
 * Bluetooth status (read-only). The app never pairs — pairing lives in the OS
 * Bluetooth settings; here we only report what is already paired/connected so
 * the device screens show a truthful state. Backed by the native TmBluetooth
 * module (Android); safe no-ops on web / when the module is absent.
 */
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, NativeModules, PermissionsAndroid, Platform } from 'react-native';

export type DeviceStatus = { paired: boolean; name: string | null };
export type BluetoothStatus = { button: DeviceStatus; earpiece: DeviceStatus; watch: DeviceStatus };

const NONE: DeviceStatus = { paired: false, name: null };
export const EMPTY_STATUS: BluetoothStatus = { button: NONE, earpiece: NONE, watch: NONE };

const TmBluetooth = NativeModules.TmBluetooth as
  | { getStatus(): Promise<BluetoothStatus> }
  | undefined;

/**
 * Ask for BLUETOOTH_CONNECT — needed to read the bonded button/watch on
 * Android 12+ (the earpiece, read via AudioManager, needs nothing). Returns
 * whether reading bonded devices is allowed. No-op off Android.
 */
export async function ensureBluetoothPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  const perm = PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT;
  if (!perm) return true; // < API 31: not a runtime permission
  if (await PermissionsAndroid.check(perm)) return true;
  return (await PermissionsAndroid.request(perm)) === PermissionsAndroid.RESULTS.GRANTED;
}

/** Current paired/connected status. Safe when the native module is absent. */
export async function getBluetoothStatus(): Promise<BluetoothStatus> {
  if (!TmBluetooth) return EMPTY_STATUS;
  try {
    return await TmBluetooth.getStatus();
  } catch {
    return EMPTY_STATUS;
  }
}

/** Open the system Bluetooth settings, where the user actually pairs devices. */
export function openBluetoothSettings(): void {
  if (Platform.OS === 'android') {
    Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS').catch(() => Linking.openSettings());
  } else {
    Linking.openSettings();
  }
}

/**
 * Live Bluetooth status. Refreshes on mount and whenever the app returns to the
 * foreground (e.g. after the user paired a device in the system settings).
 * Pass `requestPermission` on screens that need the bonded button/watch.
 */
export function useBluetoothStatus(requestPermission = false): {
  status: BluetoothStatus;
  refresh: () => void;
} {
  const [status, setStatus] = useState<BluetoothStatus>(EMPTY_STATUS);

  const refresh = useCallback(async () => {
    if (requestPermission) await ensureBluetoothPermission();
    setStatus(await getBluetoothStatus());
  }, [requestPermission]);

  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener('change', s => {
      if (s === 'active') refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  return { status, refresh };
}
