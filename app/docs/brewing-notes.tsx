import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Markdown } from "../../src/components/Markdown";
import { Screen } from "../../src/components/Screen";
import { Panel, SectionTitle } from "../../src/components/ui";
import { assetUrl } from "../../src/lib/format";
import { colors } from "../../src/theme";

const notes = `# About

The Lone Tree Orchard brew log is a Markdown-first journal of small cider, wine, and experimental batches.

Reusable brewing knowhow lives in the wiki. Batch-specific observations belong inside each brew folder.
`;

const orchardPhotos = [
  {
    file: "tabby-under-apple-blossom.jpg",
    description: "A tabby cat walking beneath the apple tree in bloom",
    caption: "Apple blossom and a wandering cat",
    ratio: 828 / 1100,
  },
  {
    file: "tabby-at-the-orchard-table.jpg",
    description: "A tabby cat resting on a garden table with the tree behind",
    caption: "A sunny spot by the tree",
    ratio: 1280 / 963,
  },
  {
    file: "cats-in-the-garden.jpg",
    description: "A black cat and a tabby cat exploring the garden",
    caption: "The garden patrol",
    ratio: 828 / 1100,
  },
  {
    file: "black-cat-on-grass.jpg",
    description: "A black cat lying close to the grass",
    caption: "A quiet moment in the grass",
    ratio: 1280 / 963,
  },
  {
    file: "fox-at-the-window.jpg",
    description: "A fox outside the window watched by a cat indoors",
    caption: "A visitor at the window",
    ratio: 828 / 1100,
  },
  {
    file: "sleeping-fox.jpg",
    description: "A fox curled up asleep among the branches",
    caption: "A fox taking a nap",
    ratio: 828 / 1100,
  },
  {
    file: "two-foxes-by-the-tree.jpg",
    description: "Two foxes resting together beside the garden tree",
    caption: "Two foxes by the tree",
    ratio: 773 / 907,
  },
];

export default function BrewingNotesPage() {
  return (
    <Screen title="About">
      <View style={styles.stack}>
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

        <Panel testID="orchard-gallery">
          <SectionTitle title="Around the Orchard" />
          <Text style={styles.intro}>
            The small garden behind the brews has an apple tree, curious cats and occasional fox
            visitors. Here are a few glimpses of the place that gives this journal its name.
          </Text>
          <View style={styles.gallery}>
            {orchardPhotos.map((photo) => (
              <View key={photo.file} style={styles.card}>
                <Image
                  source={{ uri: assetUrl(`assets/brand/orchard/${photo.file}`) }}
                  style={[styles.photo, { aspectRatio: photo.ratio }]}
                  accessibilityLabel={photo.description}
                  resizeMode="cover"
                />
                <Text style={styles.caption}>{photo.caption}</Text>
              </View>
            ))}
          </View>
        </Panel>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 20,
  },
  link: {
    color: colors.brass,
    marginTop: 12,
  },
  intro: {
    color: colors.muted,
    lineHeight: 22,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 16,
  },
  card: {
    flexBasis: 280,
    flexGrow: 1,
    maxWidth: 490,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.panel,
  },
  photo: {
    width: "100%",
    backgroundColor: colors.border,
  },
  caption: {
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
