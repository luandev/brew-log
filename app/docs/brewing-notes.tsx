import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { Markdown } from "../../src/components/Markdown";
import { Screen } from "../../src/components/Screen";
import { Panel } from "../../src/components/ui";
import { colors } from "../../src/theme";

const notes = `# Brewing Notes

General reusable brewing knowledge belongs here.

Batch-specific observations belong inside the relevant batch folder.
`;

export default function BrewingNotesPage() {
  return (
    <Screen title="About">
      <Panel>
        <Markdown source={notes} />
        <Link href="/pages/status-guide" asChild>
          <Pressable>
            <Text style={styles.link}>Status Guide — batch lifecycle and current batches in each stage</Text>
          </Pressable>
        </Link>
      </Panel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  link: {
    color: colors.brass,
    marginTop: 12,
  },
});
