/**
 * Sound-profile editor — the control panel for every audio-cue knob (spec §8).
 * Local-state control panel backed by settings.sound; each control has an info
 * (i) toggle explaining it (and its default). The "sample countdown" preview
 * plays the full profile.
 */
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, Icon, SegmentedControl, Slider, Stepper, Toggle } from '../components';
import {
  SOUND_PRESETS,
  matchPreset,
  type SoundPresetId,
  type SoundProfile,
} from '../data/model';
import { SAMPLE_RATE, playPcm, playRhythm, renderClickEx, renderStart, stopAudio } from '../audio';
import { useSettings, useStore } from '../store/useStore';
import { useT } from '../i18n';
import { Screen } from './Screen';

const styles = StyleSheet.create({
  group: { gap: 8 },
  groupBody: { gap: 14 },
  control: { gap: 7 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headLabel: { flex: 1 },
  info: { lineHeight: 17 },
  slider: { width: '100%' },
  previewRow: { gap: 8 },
});

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <AppText preset="label" color="textSecondary">
        {title}
      </AppText>
      <View style={styles.groupBody}>{children}</View>
    </View>
  );
}

function InfoButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="i" hitSlop={8} onPress={onToggle}>
      <Icon name="info" size={16} color={open ? 'accentText' : 'textSecondary'} />
    </Pressable>
  );
}

/** Label + info toggle on top, control below (slider / stepper / segmented). */
function Control({ label, info, children }: { label: string; info: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.control}>
      <View style={styles.head}>
        <AppText preset="cardSub" color="textPrimary" style={styles.headLabel}>
          {label}
        </AppText>
        <InfoButton open={open} onToggle={() => setOpen(o => !o)} />
      </View>
      {open ? (
        <AppText preset="muted" color="textSecondary" style={styles.info}>
          {info}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}

/** Inline label + info + toggle on one row. */
function ToggleControl({ label, info, value, onChange }: { label: string; info: string; value: boolean; onChange: (v: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.control}>
      <View style={styles.head}>
        <AppText preset="cardSub" color="textPrimary" style={styles.headLabel}>
          {label}
        </AppText>
        <InfoButton open={open} onToggle={() => setOpen(o => !o)} />
        <Toggle value={value} onValueChange={onChange} />
      </View>
      {open ? (
        <AppText preset="muted" color="textSecondary" style={styles.info}>
          {info}
        </AppText>
      ) : null}
    </View>
  );
}

export function SoundProfileScreen() {
  const p = useSettings().sound;
  const setSetting = useStore(s => s.setSetting);
  const t = useT();
  const set = (patch: Partial<SoundProfile>) => setSetting('sound', { ...p, ...patch });
  const active = matchPreset(p);
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  const u = t('unit.sec');

  const presetOpts: { key: SoundPresetId; label: string }[] = [
    { key: 'soft', label: t('sound.preset.soft') },
    { key: 'normal', label: t('sound.preset.normal') },
    { key: 'sharp', label: t('sound.preset.sharp') },
  ];
  const accelOpts = [
    { key: 'gentle' as const, label: t('sound.accel.gentle') },
    { key: 'normal' as const, label: t('sound.accel.normal') },
    { key: 'aggressive' as const, label: t('sound.accel.aggressive') },
  ];
  const dirOpts = [
    { key: 'up' as const, label: t('sound.dir.up') },
    { key: 'down' as const, label: t('sound.dir.down') },
    { key: 'flat' as const, label: t('sound.dir.flat') },
  ];
  const leadOpts = [
    { key: '3', label: `3 ${u}` },
    { key: '4', label: `4 ${u}` },
    { key: '5', label: `5 ${u}` },
  ];

  return (
    <Screen title={t('settings.soundProfile')} gap={18} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <Group title={`${t('sound.preset')}${active ? '' : ` · ${t('sound.preset.custom')}`}`}>
        <SegmentedControl options={presetOpts} value={(active ?? '') as SoundPresetId} onChange={id => setSetting('sound', SOUND_PRESETS[id])} />
        <AppText preset="muted" color="textSecondary" style={styles.info}>
          {t('sound.preset.hint')}
        </AppText>
      </Group>

      <Group title={t('sound.g.timbre')}>
        <Control label={`${t('sound.harshness')} · ${pct(p.harshness)}`} info={t('sound.harshness.info')}>
          <Slider value={p.harshness} onChange={v => set({ harshness: v })} style={styles.slider} />
        </Control>
        <Control label={t('sound.basePitch')} info={t('sound.basePitch.info')}>
          <Stepper value={p.basePitch} onChange={v => set({ basePitch: v })} step={100} min={800} max={4000} unit="Hz" />
        </Control>
        <Control label={t('sound.clickMs')} info={t('sound.clickMs.info')}>
          <Stepper value={p.clickMs} onChange={v => set({ clickMs: v })} step={1} min={4} max={20} unit="ms" />
        </Control>
      </Group>

      <Group title={t('sound.g.seconds')}>
        <ToggleControl label={t('sound.tickOn')} info={t('sound.tickOn.info')} value={p.secondsTick} onChange={v => set({ secondsTick: v })} />
        <Control label={t('sound.tickPitch')} info={t('sound.tickPitch.info')}>
          <Stepper value={p.tickPitch} onChange={v => set({ tickPitch: v })} step={100} min={800} max={4000} unit="Hz" />
        </Control>
      </Group>

      <Group title={t('sound.g.countdown')}>
        <Control label={t('sound.lead')} info={t('sound.lead.info')}>
          <SegmentedControl options={leadOpts} value={String(p.leadSec)} onChange={v => set({ leadSec: Number(v) })} />
        </Control>
        <Control label={t('sound.accel')} info={t('sound.accel.info')}>
          <SegmentedControl options={accelOpts} value={p.accel} onChange={v => set({ accel: v })} />
        </Control>
        <Control label={t('sound.beats')} info={t('sound.beats.info')}>
          <Stepper value={p.beats} onChange={v => set({ beats: v })} step={1} min={4} max={14} />
        </Control>
        <Control label={t('sound.pitchDir')} info={t('sound.pitchDir.info')}>
          <SegmentedControl options={dirOpts} value={p.pitchDir} onChange={v => set({ pitchDir: v })} />
        </Control>
        <Control label={t('sound.pitchRange')} info={t('sound.pitchRange.info')}>
          <Stepper value={p.pitchRange} onChange={v => set({ pitchRange: v })} step={100} min={0} max={3000} unit="Hz" />
        </Control>
        <Control label={`${t('sound.finalEmphasis')} · ${pct(p.finalEmphasis)}`} info={t('sound.finalEmphasis.info')}>
          <Slider value={p.finalEmphasis} onChange={v => set({ finalEmphasis: v })} style={styles.slider} />
        </Control>
        <ToggleControl label={t('sound.crescendo')} info={t('sound.crescendo.info')} value={p.crescendo} onChange={v => set({ crescendo: v })} />
        <ToggleControl label={t('sound.timbreMorph')} info={t('sound.timbreMorph.info')} value={p.timbreMorph} onChange={v => set({ timbreMorph: v })} />
        <ToggleControl label={t('sound.accentBeats')} info={t('sound.accentBeats.info')} value={p.accentBeats} onChange={v => set({ accentBeats: v })} />
        <ToggleControl label={t('sound.ready')} info={t('sound.ready.info')} value={p.readyMarker} onChange={v => set({ readyMarker: v })} />
        <ToggleControl label={t('sound.onGate')} info={t('sound.onGate.info')} value={p.onGateClick} onChange={v => set({ onGateClick: v })} />
      </Group>

      <Group title={t('sound.g.overlap')}>
        <ToggleControl label={t('sound.distinguishAB')} info={t('sound.distinguishAB.info')} value={p.distinguishAB} onChange={v => set({ distinguishAB: v })} />
      </Group>

      <Group title={t('sound.g.start')}>
        <ToggleControl label={t('sound.startOn')} info={t('sound.startOn.info')} value={p.startSound} onChange={v => set({ startSound: v })} />
      </Group>

      <Group title={t('sound.g.preview')}>
        <View style={styles.previewRow}>
          <Button label={t('sound.g.start')} variant="secondary" icon={<Icon name="play" size={14} color="textPrimary" />} onPress={() => p.startSound && playPcm(renderStart(), SAMPLE_RATE)} />
          <Button label={t('sound.preview.tick')} variant="secondary" icon={<Icon name="play" size={14} color="textPrimary" />} onPress={() => playPcm(renderClickEx(p.tickPitch, p.harshness, p.clickMs, 0.9), SAMPLE_RATE)} />
          <Button label={t('sound.preview.countdown')} variant="secondary" icon={<Icon name="play" size={14} color="textPrimary" />} onPress={() => playRhythm(p.leadSec, p)} />
          <Button label={t('sound.preview.stop')} variant="secondary" icon={<Icon name="stop" size={14} color="textPrimary" />} onPress={() => stopAudio()} />
        </View>
        <AppText preset="muted" color="textSecondary" style={styles.info}>
          {t('sound.preview.note')}
        </AppText>
      </Group>
    </Screen>
  );
}

export default SoundProfileScreen;
