// app/explore.tsx
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList, Pressable, ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AREAS, FEATURES } from '../libs/features';
import { supabase } from '../libs/supabase';

type Place = {
  id: string;
  name: string;
  area: string | null;
  category: string;
  price_min: number | null;
  price_max: number | null;
  rating: number | null;
  indoor: boolean;
};

const BUDGETS = [
  { label: 'Any', value: null },
  { label: 'Under ₱1,000', value: 1000 },
  { label: 'Under ₱2,000', value: 2000 },
  { label: 'Under ₱3,000', value: 3000 },
];

export default function ExploreScreen() {
  const [area, setArea] = useState<string | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let query = supabase
        .from('places')
        .select('id, name, area, category, price_min, price_max, rating, indoor')
        .eq('city', 'Metro Manila')
        .order('rating', { ascending: false });

      if (area) query = query.eq('area', area);
      if (budget) query = query.lte('price_min', budget);

      const { data, error } = await query;
      if (cancelled) return;
      if (error) console.error(error.message);
      else setPlaces(data ?? []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [area, budget]);

  return (
    <View style={s.screen}>
      <Text style={s.title}>Find your kind of date</Text>

      {/* Single place / Day itinerary toggle */}
      <View style={s.tabs}>
        <View style={[s.tab, s.tabActive]}>
          <Text style={s.tabActiveText}>Single place</Text>
        </View>
        <View style={[s.tab, !FEATURES.dayItinerary && s.tabDisabled]}>
          <Text style={s.tabText}>Day itinerary</Text>
          {!FEATURES.dayItinerary && <Text style={s.soon}>Soon</Text>}
        </View>
      </View>

      {/* Area chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chipRow}>
        <Chip label="All areas" active={area === null} onPress={() => setArea(null)} />
        {AREAS.map((a) => (
          <Chip key={a} label={a} active={area === a} onPress={() => setArea(a)} />
        ))}
      </ScrollView>

      {/* Budget chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chipRow}>
        {BUDGETS.map((b) => (
          <Chip key={b.label} label={b.label} active={budget === b.value}
            onPress={() => setBudget(b.value)} />
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={places}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          ListEmptyComponent={
            <Text style={s.empty}>No places match yet. Try another area or budget.</Text>
          }
          renderItem={({ item }) => (
            <View style={s.card}>
              <Text style={s.cardMeta}>
                {item.category.toUpperCase()} · {item.area ?? 'Metro Manila'}
              </Text>
              <Text style={s.cardTitle}>{item.name}</Text>
              <Text style={s.cardPrice}>
                ₱{item.price_min ?? 0}–₱{item.price_max ?? 0} for two
                {item.rating ? `  ·  ★ ${item.rating}` : ''}
              </Text>
              <Text style={s.cardTag}>{item.indoor ? 'Indoor' : 'Outdoor'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

function Chip({ label, active, onPress }: {
  label: string; active: boolean; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={[s.chipText, active && s.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const GREEN = '#2F4A3A';
const CREAM = '#F6F1E7';

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CREAM, paddingTop: 60 },
  title: { fontSize: 28, fontFamily: 'serif', color: GREEN, paddingHorizontal: 16 },
  tabs: { flexDirection: 'row', margin: 16, backgroundColor: '#EAE3D3', borderRadius: 999, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  tabActive: { backgroundColor: '#fff' },
  tabDisabled: { opacity: 0.5 },
  tabActiveText: { color: GREEN, fontWeight: '600' },
  tabText: { color: GREEN },
  soon: { fontSize: 10, color: '#fff', backgroundColor: GREEN, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, overflow: 'hidden' },
  chipRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: '#CFC7B3', backgroundColor: '#fff' },
  chipActive: { backgroundColor: GREEN, borderColor: GREEN },
  chipText: { color: GREEN },
  chipTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 4 },
  cardMeta: { fontSize: 11, letterSpacing: 1, color: '#8A8472' },
  cardTitle: { fontSize: 20, fontFamily: 'serif', color: GREEN },
  cardPrice: { color: '#4A4A4A' },
  cardTag: { color: '#8A8472', fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 40, color: '#8A8472' },
});