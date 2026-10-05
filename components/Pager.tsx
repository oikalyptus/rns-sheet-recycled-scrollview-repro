import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Modal,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const PAGES = ['#f87171', '#60a5fa', '#34d399'];

type Size = { height: number; width: number };

export default function Pager({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<ScrollView>(null);
  const [layout, setLayout] = useState<Size>();
  const [viewport, setViewport] = useState<Size>();
  const [contentHeight, setContentHeight] = useState<number>();

  // Any scroll event reports the UIScrollView's real bounds (layoutMeasurement), so nudge it once
  // instead of waiting for a drag.
  useEffect(() => {
    if (!layout) return;
    const timeout = setTimeout(() => scrollRef.current?.scrollTo({ animated: false, x: 1, y: 0 }), 500);
    return () => clearTimeout(timeout);
  }, [layout]);

  const handleScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    setViewport(nativeEvent.layoutMeasurement);
    setContentHeight(nativeEvent.contentSize.height);
    console.log('[pager]', JSON.stringify({ layout, ...nativeEvent }));
  };

  const isBroken = !!layout && !!viewport && Math.round(viewport.height) !== Math.round(layout.height);

  return (
    <Modal animationType="slide" onRequestClose={onClose}>
      <View style={styles.fill} onLayout={({ nativeEvent }) => setLayout(nativeEvent.layout)}>
        {!!layout && (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
          >
            {PAGES.map((color) => (
              <View key={color} style={{ backgroundColor: color, height: layout.height, width: layout.width }} />
            ))}
          </ScrollView>
        )}
      </View>

      <View pointerEvents="box-none" style={styles.overlay}>
        <Text style={styles.label}>Layout height (onLayout): {layout?.height ?? '…'}</Text>
        <Text style={styles.label}>Content height (onScroll): {contentHeight ?? '…'}</Text>
        <Text style={styles.label}>Native viewport height (onScroll): {viewport?.height ?? '…'}</Text>
        <Text style={[styles.label, styles.verdict]}>
          {viewport ? (isBroken ? 'BROKEN: the pager scrolls vertically' : 'OK') : 'Measuring…'}
        </Text>
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  label: { color: 'white', fontSize: 16, fontWeight: '600' },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    gap: 8,
    left: 16,
    padding: 16,
    position: 'absolute',
    right: 16,
    top: 120,
  },
  verdict: { fontSize: 18 },
});
