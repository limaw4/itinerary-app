import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { supabase } from '../libs/supabase';

type Place = {
  id: string;
  name: string;
  category: string;
  price_min: number | null;
  price_max: number | null;
};

export default function PlacesScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('places')
        .select('id, name, category, price_min, price_max')
        .eq('city', 'Baguio')
        .order('rating', { ascending: false });

      if (error) console.error(error.message);
      else setPlaces(data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 80 }} />;

  return (
    <FlatList
      data={places}
      keyExtractor={(p) => p.id}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#f3f3f3' }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
          <Text>{item.category} · ₱{item.price_min}–₱{item.price_max}</Text>
        </View>
      )}
    />
  );
}