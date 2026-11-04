import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GREEN = '#2F4A3A';
const CREAM = '#F6F1E7';

type Props = {
  title?: string;      // centered title (Explore, Plan a date)
  brand?: boolean;     // show the logo + app name on the left (Home)
  showBack?: boolean;  // show the back arrow on the left
  right?: ReactNode;   // anything on the right: an icon button, etc.
};

export default function AppHeader({ title, brand, showBack, right }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { paddingTop: insets.top + 8 }]}>
      {/* LEFT SLOT */}
      <View style={s.left}>
        {brand ? (
          <View style={s.brandRow}>
            <Ionicons name="leaf-outline" size={20} color={GREEN} />
            <Text style={s.brandText}>datestinasyon</Text>
          </View>
        ) : showBack && router.canGoBack() ? (
          <HeaderIcon name="arrow-back" onPress={() => router.back()} />
        ) : null}
      </View>

      {/* CENTER SLOT */}
      {title ? <Text style={s.title}>{title}</Text> : <View style={{ flex: 1 }} />}

      {/* RIGHT SLOT */}
      <View style={s.right}>{right}</View>
    </View>
  );
}

export function HeaderIcon({
  name,
  onPress,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={s.iconButton}>
      <Ionicons name={name} size={22} color={GREEN} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: CREAM,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E3DCCB',
  },
  left: { minWidth: 44, alignItems: 'flex-start' },
  right: { minWidth: 44, alignItems: 'flex-end' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandText: { fontSize: 22, fontFamily: 'serif', color: GREEN },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: GREEN,
  },
  iconButton: { padding: 4 },
});