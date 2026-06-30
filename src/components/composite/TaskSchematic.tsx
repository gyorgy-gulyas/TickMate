/** Shared task type options + live schematic preview card (editor + quick task). */
import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText, Card } from '../primitives';
import { Icon } from '../icons';
import { OverlapSchematic, TypeSchematic, buildSchematic, buildSharedSchematic } from '../viz';
import { SECTION_TYPE_META, fmtSec, type SectionType } from '../../data/model';
import { useT, typeKey } from '../../i18n';

/** The four section types as SegmentedControl options, with localized labels. */
export function useTaskTypeOptions() {
  const t = useT();
  return (['normal', 'shared', 'nested', 'overlap'] as SectionType[]).map(type => ({
    key: type,
    label: t(typeKey(type, 'short')),
    icon: <Icon name={SECTION_TYPE_META[type].icon} size={15} color="textSecondary" />,
  }));
}

const styles = StyleSheet.create({ card: { gap: 0 } });

export type TaskSchematicProps = {
  type: SectionType;
  prepSec: number;
  timeA: number;
  timeB: number;
};

export function TaskSchematic({ type, prepSec, timeA, timeB }: TaskSchematicProps) {
  const t = useT();
  const u = t('unit.sec');
  const tracks =
    type === 'nested'
      ? [
          { label: 'A', startPct: 20, endPct: 94, variant: 'primary' as const, timeLabel: `${fmtSec(timeA)} ${u}` },
          { label: 'B', startPct: 42, endPct: 70, variant: 'secondary' as const, timeLabel: `${fmtSec(timeB)} ${u}` },
        ]
      : [
          { label: 'A', startPct: 20, endPct: 62, variant: 'primary' as const, timeLabel: `${fmtSec(timeA)} ${u}` },
          { label: 'B', startPct: 44, endPct: 94, variant: 'secondary' as const, timeLabel: `${fmtSec(timeB)} ${u}` },
        ];

  return (
    <Card style={styles.card}>
      <AppText preset="label" color="textSecondary">
        {t('schematic.preview')} · {t(typeKey(type))}
      </AppText>
      {type === 'nested' || type === 'overlap' ? (
        <OverlapSchematic showGomb tracks={tracks} />
      ) : type === 'shared' ? (
        <TypeSchematic {...buildSharedSchematic(prepSec, timeA, timeB, u)} />
      ) : (
        <TypeSchematic {...buildSchematic(prepSec, timeA, u)} />
      )}
    </Card>
  );
}

export default TaskSchematic;
