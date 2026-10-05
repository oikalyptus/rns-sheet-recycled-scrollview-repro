import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

import Pager from '../../components/Pager';

const ROWS = Array.from({ length: 30 }, (_, index) => index);

export default function Sheet() {
  const { autoOpen } = useLocalSearchParams<{ autoOpen?: string }>();
  const [isScrollViewMounted, setIsScrollViewMounted] = useState(true);
  const [isPagerOpen, setIsPagerOpen] = useState(false);

  // Stands in for a loading state that renders a ScrollView and is then swapped for other content
  // while the sheet stays presented.
  useEffect(() => {
    const timeout = setTimeout(() => setIsScrollViewMounted(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  // `rnssheetrecycledscrollview://sheet?autoOpen=1` runs the whole sequence without a tap.
  useEffect(() => {
    if (isScrollViewMounted || autoOpen !== '1') return;
    const timeout = setTimeout(() => setIsPagerOpen(true), 500);
    return () => clearTimeout(timeout);
  }, [autoOpen, isScrollViewMounted]);

  return (
    <View style={styles.container}>
      {isScrollViewMounted ? (
        <ScrollView>
          {ROWS.map((row) => (
            <Text key={row} style={styles.row}>
              Row {row}
            </Text>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <Text style={styles.text}>The sheet's ScrollView is gone; the sheet stays presented.</Text>
          <Button title="Open full-screen pager" onPress={() => setIsPagerOpen(true)} />
        </View>
      )}

      {isPagerOpen && <Pager onClose={() => setIsPagerOpen(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, gap: 16, justifyContent: 'center', padding: 24 },
  row: { fontSize: 16, padding: 16 },
  text: { fontSize: 16 },
});
