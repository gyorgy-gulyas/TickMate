/** Shared task type options + live schematic preview card (editor + quick task). */
import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText, Card } from '../primitives';
import { Icon } from '../icons';
import { OverlapSchematic, TypeSchematic, buildSchematic, buildSharedSchematic } from '../viz';
import { SECTION_TYPE_META, fmtSec, type SectionType } from '../../data/mock';

/** The four section types as SegmentedControl options. */
export const TASK_TYPE_OPTIONS = (['normal', 'shared', 'nested', 'overlap'] as SectionType[]).map(t => ({
  key: t,
  label: SECTION_TYPE_META[t].short,
  icon: <Icon name={SECTION_TYPE_META[t].icon} size={15} color="textSecondary" />,
}));

const styles = StyleSheet.create({ card: { gap: 0 } });

export type TaskSchematicProps = {
  type: SectionType;
  prepSec: number;
  timeA: number;
  timeB: number;
};

export function TaskSchematic({ type, prepSec, timeA, timeB }: TaskSchematicProps) {
  const tracks =
    type === 'nested'
      ? [
          { label: 'A', startPct: 20, endPct: 94, variant: 'primary' as const, timeLabel: `${fmtSec(timeA)} mp` },
          { label: 'B', startPct: 42, endPct: 70, variant: 'secondary' as const, timeLabel: `${fmtSec(timeB)} mp` },
        ]
      : [
          { label: 'A', startPct: 20, endPct: 62, variant: 'primary' as const, timeLabel: `${fmtSec(timeA)} mp` },
          { label: 'B', startPct: 44, endPct: 94, variant: 'secondary' as const, timeLabel: `${fmtSec(timeB)} mp` },
        ];

  return (
    <Card style={styles.card}>
      <AppText preset="label" color="textSecondary">
        Előnézet · {SECTION_TYPE_META[type].label}
      </AppText>
      {type === 'nested' || type === 'overlap' ? (
        <OverlapSchematic showGomb tracks={tracks} />
      ) : type === 'shared' ? (
        <TypeSchematic {...buildSharedSchematic(prepSec, timeA, timeB)} />
      ) : (
        <TypeSchematic {...buildSchematic(prepSec, timeA)} />
      )}
    </Card>
  );
}

export default TaskSchematic;
