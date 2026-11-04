import AppHeader, { HeaderIcon } from "@/components/AppHeader";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F6F1E7' }}>
      <AppHeader
        brand
        right={<HeaderIcon name="notifications-outline" onPress={() => {}} />}
      />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Page</Text>
      </View>
    </View>
  );
}