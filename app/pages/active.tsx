import { ActiveBrewCard } from "../../src/components/ActiveBrewCard";
import { Screen } from "../../src/components/Screen";
import { Panel } from "../../src/components/ui";
import { activeBatches } from "../../src/lib/data";
import { StyleSheet, View } from "react-native";

export default function ActivePage() {
  const active = activeBatches();
  return (
    <Screen title="Active Brews">
      <Panel>
        <View style={styles.stack}>
          {active.map((batch) => (
            <ActiveBrewCard key={batch.batch_id} batch={batch} />
          ))}
        </View>
      </Panel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 10 },
});
