import { Link, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  // `EXPO_PUBLIC_AUTORUN=1 npx expo run:ios` runs the whole sequence on launch, without a tap.
  useEffect(() => {
    if (process.env.EXPO_PUBLIC_AUTORUN !== '1') return;
    const timeout = setTimeout(() => router.push('/sheet?autoOpen=1'), 1000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        The sheet renders a ScrollView, then replaces it with plain content while it stays
        presented. The pager opened from it should get a native viewport as tall as its layout.
      </Text>
      <Link href="/sheet" asChild>
        <Button title="Open sheet" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16, justifyContent: 'center', padding: 24 },
  text: { fontSize: 16 },
});
