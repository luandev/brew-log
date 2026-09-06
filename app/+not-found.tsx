import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../src/components/Screen";
import { colors } from "../src/theme";

export default function NotFound() {
  return (
    <Screen title="Not found">
      <Text style={styles.body}>That page is not in the brew log.</Text>
      <Link href="/" asChild>
        <Pressable>
          <Text style={styles.link}>Back to the dashboard</Text>
        </Pressable>
      </Link>
      <View />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.muted,
    marginBottom: 12,
  },
  link: {
    color: colors.brass,
  },
});
