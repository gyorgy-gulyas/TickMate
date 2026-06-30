/**
 * Drag-to-reorder section list (no extra deps — PanResponder + Animated, works
 * on web and native). The grip handle drags a row; rows swap live as the finger
 * crosses thresholds. The up/down buttons stay as an accessible fallback.
 */
import React, { useRef, useState } from 'react';
import { Animated, PanResponder, Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { Icon, SectionRow } from '../components';
import { SECTION_TYPE_META, fmtSec, type Section } from '../data/model';
import { useT, typeKey } from '../i18n';
import { useStore } from '../store/useStore';
import { useTheme } from '../theme';

export type SectionReorderListProps = {
  raceId: string;
  sections: Section[];
  onOpen: (sectionId: string) => void;
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  handle: { paddingHorizontal: 4, paddingVertical: 10, justifyContent: 'center' },
  main: { flex: 1 },
  reorder: { marginLeft: 4 },
  reorderBtn: { paddingHorizontal: 6, paddingVertical: 1 },
});

// Web: stop the browser from selecting text / scrolling while dragging the grip.
const web = (s: Record<string, string>): ViewStyle | null =>
  Platform.OS === 'web' ? (s as unknown as ViewStyle) : null;
const WEB_NOSELECT = web({ userSelect: 'none' });
const WEB_GRAB = web({ userSelect: 'none', touchAction: 'none', cursor: 'grab' });
const WEB_GRABBING = web({ userSelect: 'none', touchAction: 'none', cursor: 'grabbing' });

export function SectionReorderList({ raceId, sections, onOpen }: SectionReorderListProps) {
  const t = useT();
  const theme = useTheme();
  const reorderSection = useStore(s => s.reorderSection);
  const moveSection = useStore(s => s.moveSection);

  const [rowH, setRowH] = useState(0);
  const [dragId, setDragId] = useState<string | null>(null);

  const pan = useRef(new Animated.Value(0)).current;
  const rowHRef = useRef(0);
  const idsRef = useRef<string[]>([]);
  const startIndexRef = useRef(0);
  const curIndexRef = useRef(0);
  const responders = useRef<Record<string, ReturnType<typeof PanResponder.create>>>({});

  rowHRef.current = rowH;
  idsRef.current = sections.map(s => s.id);

  const responderFor = (id: string) => {
    if (!responders.current[id]) {
      responders.current[id] = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          const idx = idsRef.current.indexOf(id);
          startIndexRef.current = idx;
          curIndexRef.current = idx;
          pan.setValue(0);
          setDragId(id);
        },
        onPanResponderMove: (_e, g) => {
          const h = rowHRef.current;
          if (h <= 0) return;
          const n = idsRef.current.length;
          const start = startIndexRef.current;
          const target = Math.max(0, Math.min(n - 1, start + Math.round(g.dy / h)));
          while (curIndexRef.current !== target) {
            const step = target > curIndexRef.current ? 1 : -1;
            reorderSection(raceId, curIndexRef.current, curIndexRef.current + step);
            curIndexRef.current += step;
          }
          pan.setValue(g.dy - (curIndexRef.current - start) * h);
        },
        onPanResponderRelease: () => {
          Animated.timing(pan, { toValue: 0, duration: 120, useNativeDriver: false }).start();
          setDragId(null);
        },
        onPanResponderTerminate: () => {
          pan.setValue(0);
          setDragId(null);
        },
      });
    }
    return responders.current[id];
  };

  return (
    <View style={WEB_NOSELECT}>
      {sections.map((s, i) => {
        const last = sections.length - 1;
        const dragging = s.id === dragId;
        const draggingStyle = dragging
          ? { transform: [{ translateY: pan }], zIndex: 10, elevation: 6, backgroundColor: theme.colors.surface, borderRadius: 10 }
          : null;
        return (
          <Animated.View
            key={s.id}
            onLayout={e => {
              if (!rowHRef.current) setRowH(e.nativeEvent.layout.height);
            }}
            style={[styles.row, draggingStyle]}>
            {sections.length > 1 ? (
              <View
                accessibilityLabel={t('a11y.drag')}
                style={[styles.handle, dragging ? WEB_GRABBING : WEB_GRAB]}
                {...responderFor(s.id).panHandlers}>
                <Icon name="dots-six-vertical" size={18} color={dragging ? 'accentText' : 'textSecondary'} />
              </View>
            ) : null}
            <View style={styles.main}>
              <SectionRow
                index={i + 1}
                typeIcon={<Icon name={SECTION_TYPE_META[s.type].icon} size={15} color="textSecondary" />}
                name={s.name}
                meta={t(typeKey(s.type))}
                value={`${s.segments.map(g => fmtSec(g.timeSec)).join(' + ')} ${t('unit.sec')}`}
                audioReady={s.audioReady}
                divider={!dragging && i < last}
                onPress={() => onOpen(s.id)}
              />
            </View>
            {sections.length > 1 ? (
              <View style={styles.reorder}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('a11y.moveUp')}
                  disabled={i === 0}
                  onPress={() => moveSection(raceId, s.id, -1)}
                  style={styles.reorderBtn}>
                  <Icon name="caret-up" size={16} color={i === 0 ? 'railAlt' : 'textSecondary'} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('a11y.moveDown')}
                  disabled={i === last}
                  onPress={() => moveSection(raceId, s.id, 1)}
                  style={styles.reorderBtn}>
                  <Icon name="caret-down" size={16} color={i === last ? 'railAlt' : 'textSecondary'} />
                </Pressable>
              </View>
            ) : null}
          </Animated.View>
        );
      })}
    </View>
  );
}

export default SectionReorderList;
