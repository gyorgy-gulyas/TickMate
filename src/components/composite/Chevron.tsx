/** List affordance chevron (›). Maps to .chev. */
import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText } from '../primitives';

const styles = StyleSheet.create({
  chev: { fontSize: 20 },
});

export function Chevron() {
  return (
    <AppText preset="navTitle" color="textSecondary" style={styles.chev}>
      ›
    </AppText>
  );
}

export default Chevron;
