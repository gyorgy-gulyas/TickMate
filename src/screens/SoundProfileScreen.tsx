/**
 * Sound-profile editor — the control panel for every audio-cue knob (spec §8).
 * DRAFT: Hungarian labels + local state, so the parameter set/layout can be
 * decided here before the audio engine reads it and before i18n. Each control
 * has an info (i) toggle that explains it (and its default). Preview is partly
 * live; full knob response lands with the engine step.
 */
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, Icon, SegmentedControl, Slider, Stepper, Toggle } from '../components';
import {
  SOUND_PRESETS,
  matchPreset,
  type SoundPresetId,
  type SoundProfile,
  type CountdownAccel,
  type PitchDir,
} from '../data/model';
import { SAMPLE_RATE, playPcm, playRhythm, renderClick, renderStart, stopAudio } from '../audio';
import { Screen } from './Screen';

const PRESET_OPTS: { key: SoundPresetId; label: string }[] = [
  { key: 'soft', label: 'Lágy' },
  { key: 'normal', label: 'Normál' },
  { key: 'sharp', label: 'Éles' },
];
const ACCEL_OPTS: { key: CountdownAccel; label: string }[] = [
  { key: 'gentle', label: 'Lágy' },
  { key: 'normal', label: 'Normál' },
  { key: 'aggressive', label: 'Agresszív' },
];
const DIR_OPTS: { key: PitchDir; label: string }[] = [
  { key: 'up', label: 'Fel' },
  { key: 'down', label: 'Le' },
  { key: 'flat', label: 'Állandó' },
];
const LEAD_OPTS = [
  { key: '2', label: '2 mp' },
  { key: '3', label: '3 mp' },
  { key: '4', label: '4 mp' },
];

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
    <Pressable accessibilityRole="button" accessibilityLabel="információ" hitSlop={8} onPress={onToggle}>
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
  const [p, setP] = useState<SoundProfile>(SOUND_PRESETS.normal);
  const set = (patch: Partial<SoundProfile>) => setP(prev => ({ ...prev, ...patch }));
  const active = matchPreset(p);
  const pct = (v: number) => `${Math.round(v * 100)}%`;

  return (
    <Screen title="Hangprofil" gap={18} rightActions={<Icon name="question" size={19} color="textSecondary" />}>
      <Group title={`Preset${active ? '' : ' · Egyedi'}`}>
        <SegmentedControl options={PRESET_OPTS} value={(active ?? '') as SoundPresetId} onChange={id => setP(SOUND_PRESETS[id])} />
        <AppText preset="muted" color="textSecondary" style={styles.info}>
          Válassz kiindulási csomagot, majd hangold a knobokkal — a tweak után „Egyedi" lesz.
        </AppText>
      </Group>

      <Group title="Kattanás-hangszín">
        <Control
          label={`Élesség · ${pct(p.harshness)}`}
          info="Lágy (tiszta szinusz) ↔ kemény (négyszög) kattanás. Az élesebb jobban átvág a motor-/szélzajon. Alap: lágy (0%).">
          <Slider value={p.harshness} onChange={v => set({ harshness: v })} style={styles.slider} />
        </Control>
        <Control label="Alap hangmagasság" info="A kattanások alaphangmagassága. Magasabb = élesebb, „csípősebb”. Alap: 2000 Hz.">
          <Stepper value={p.basePitch} onChange={v => set({ basePitch: v })} step={100} min={800} max={4000} unit="Hz" />
        </Control>
        <Control label="Kattanás hossza" info="Egy kattanás hossza. Rövidebb = szárazabb „tikk”. Alap: 8 ms.">
          <Stepper value={p.clickMs} onChange={v => set({ clickMs: v })} step={1} min={4} max={20} unit="ms" />
        </Control>
      </Group>

      <Group title="Másodperc-jelző">
        <ToggleControl
          label="Bekapcsolva"
          info="Minden egész másodpercnél egy rövid kattanás (a kapu-visszaszámláláson kívül). Alap: be."
          value={p.secondsTick}
          onChange={v => set({ secondsTick: v })}
        />
        <Control
          label="Tikk hangmagassága"
          info="A másodperc-tikk hangmagassága — érdemes másra állítani, mint a visszaszámlálásét, hogy ne keverd össze a kettőt. Alap: 2000 Hz.">
          <Stepper value={p.tickPitch} onChange={v => set({ tickPitch: v })} step={100} min={800} max={4000} unit="Hz" />
        </Control>
      </Group>

      <Group title="Kapu-visszaszámlálás">
        <Control label="Kezdés a kapu előtt" info="Hány másodperccel a kapu előtt induljon a visszaszámláló sor. Alap: 3 mp.">
          <SegmentedControl options={LEAD_OPTS} value={String(p.leadSec)} onChange={v => set({ leadSec: Number(v) })} />
        </Control>
        <Control
          label="Gyorsulási görbe"
          info="Mennyire élesen sűrűsödnek a kattanások a kapu felé (a kattanások eloszlása). Alap: normál.">
          <SegmentedControl options={ACCEL_OPTS} value={p.accel} onChange={v => set({ accel: v })} />
        </Control>
        <Control
          label="Ütemek száma"
          info="Hány kattanásból áll a visszaszámláló sor. Több = finomabb, sűrűbb felbontás; kevesebb = ritkább, nagyobb hézagokkal. Alap: 10.">
          <Stepper value={p.beats} onChange={v => set({ beats: v })} step={1} min={4} max={14} />
        </Control>
        <Control
          label="Hangmagasság-kontúr"
          info="A sor hangmagassága a kapu felé emelkedik / ereszkedik / állandó marad. Alap: emelkedő.">
          <SegmentedControl options={DIR_OPTS} value={p.pitchDir} onChange={v => set({ pitchDir: v })} />
        </Control>
        <Control label="Kontúr mértéke" info="Mennyit változik a hangmagasság a sor alatt. Alap: 1800 Hz (2000→3800).">
          <Stepper value={p.pitchRange} onChange={v => set({ pitchRange: v })} step={100} min={0} max={3000} unit="Hz" />
        </Control>
        <Control
          label={`Záró kattanás kiemelése · ${pct(p.finalEmphasis)}`}
          info="Mennyire ugorjon ki az utolsó, kapun lévő kattanás (hangerő + keménység) — ez a „pillanat” jele. Alap: 100%.">
          <Slider value={p.finalEmphasis} onChange={v => set({ finalEmphasis: v })} style={styles.slider} />
        </Control>
        <ToggleControl
          label="Crescendo a kapu felé"
          info="A sor halkból hangosba erősödik a kapu felé = erősebb sürgető érzet. Alap: ki."
          value={p.crescendo}
          onChange={v => set({ crescendo: v })}
        />
        <ToggleControl
          label="Timbre-morf (lágy → éles)"
          info="A sor elején lágy, a kapu felé egyre élesebb a hangszín — maga a textúra is jelzi a közeledést. Alap: ki."
          value={p.timbreMorph}
          onChange={v => set({ timbreMorph: v })}
        />
        <ToggleControl
          label="Egész-mp ütemek hangsúlya"
          info="Az egész másodpercre eső kattanások hangsúlyosabbak (metrikus tagolás). Alap: ki."
          value={p.accentBeats}
          onChange={v => set({ accentBeats: v })}
        />
        <ToggleControl
          label={'„Felkészülés” jel a sor elején'}
          info="A sor első kattanása külön, megkülönböztető hang, jelezve, hogy most indul a visszaszámlálás. Alap: ki."
          value={p.readyMarker}
          onChange={v => set({ readyMarker: v })}
        />
        <ToggleControl
          label="Záró kattanás a kapun (0,00)"
          info="Az utolsó kattanás pont a kapu pillanatában (0,00) szóljon-e. Alap: be."
          value={p.onGateClick}
          onChange={v => set({ onGateClick: v })}
        />
      </Group>

      <Group title="Egyszerre futó kapuk (fonódó / átfedő)">
        <ToggleControl
          label="A/B kapuk megkülönböztetése"
          info="Átfedő/fonódó feladatnál az A és B kapu visszaszámlálása eltérő hangmagasságon szóljon, hogy halld, melyik kapu jön. Alap: ki."
          value={p.distinguishAB}
          onChange={v => set({ distinguishAB: v })}
        />
      </Group>

      <Group title="Induló hang">
        <ToggleControl
          label="Bekapcsolva"
          info="A START gomb megnyomásakor külön, jól felismerhető hang. Alap: be."
          value={p.startSound}
          onChange={v => set({ startSound: v })}
        />
      </Group>

      <Group title="Előhallgatás">
        <View style={styles.previewRow}>
          <Button label="Induló hang" variant="secondary" icon={<Icon name="play" size={14} color="textPrimary" />} onPress={() => playPcm(renderStart(), SAMPLE_RATE)} />
          <Button label="Másodperc-tikk" variant="secondary" icon={<Icon name="play" size={14} color="textPrimary" />} onPress={() => playPcm(renderClick(p.tickPitch), SAMPLE_RATE)} />
          <Button label="Minta visszaszámlálás" variant="secondary" icon={<Icon name="play" size={14} color="textPrimary" />} onPress={() => playRhythm(Math.max(3, p.leadSec), !p.onGateClick)} />
          <Button label="Leállítás" variant="secondary" icon={<Icon name="stop" size={14} color="textPrimary" />} onPress={() => stopAudio()} />
        </View>
        <AppText preset="muted" color="textSecondary" style={styles.info}>
          Az előhallgatás jelenleg részben reagál (tikk hangmagasság, kezdés, záró kattanás). A többi knob a hangmotor-lépés után szól.
        </AppText>
      </Group>
    </Screen>
  );
}

export default SoundProfileScreen;
