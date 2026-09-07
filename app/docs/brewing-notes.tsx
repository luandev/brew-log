import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { Markdown } from "../../src/components/Markdown";
import { Screen } from "../../src/components/Screen";
import { Panel } from "../../src/components/ui";
import { colors } from "../../src/theme";

const notes = `# About

The Lone Tree Orchard brew log is a Markdown-first journal of small cider, wine, and experimental batches.

Reusable brewing knowhow lives in the wiki. Batch-specific observations belong inside each brew folder.
`;

export default function BrewingNotesPage() {
  return (
    <Screen title="About">
      <Panel>
        <Markdown source={notes} />
        <Link href="/wiki" asChild>
          <Pressable>
            <Text style={styles.link}>Wiki — techniques, terms, and lessons across batches</Text>
          </Pressable>
        </Link>
        <Link href="/wiki/glossary" asChild>
          <Pressable>
            <Text style={styles.link}>Glossary — common brewing terms</Text>
          </Pressable>
        </Link>
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
