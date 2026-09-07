import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Markdown } from "../../../src/components/Markdown";
import { Screen } from "../../../src/components/Screen";
import { WebLink } from "../../../src/components/WebLink";
import { Panel, SectionTitle } from "../../../src/components/ui";
import { getBatch, getWikiArticle, publishedWikiArticles, wikiCategoryLabel } from "../../../src/lib/data";
import { formatDate } from "../../../src/lib/format";
import { colors } from "../../../src/theme";

function withoutLeadingHeading(source: string) {
  return source.replace(/^#\s+[^\n]+\n+/, "");
}

export async function generateStaticParams() {
  return publishedWikiArticles().map((article) => ({ slug: article.slug }));
}

export default function WikiArticlePage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const article = getWikiArticle(Array.isArray(slug) ? slug[0] : slug);

  if (!article) {
    return (
      <Screen title="Article not found">
        <Text style={styles.muted}>No wiki article is recorded for this slug.</Text>
      </Screen>
    );
  }

  const related = article.related_batches
    .map((batchId) => getBatch(batchId))
    .filter((batch): batch is NonNullable<typeof batch> => Boolean(batch));

  return (
    <Screen title={article.title} testID="wiki-article">
      <View style={styles.meta}>
        <Text style={styles.metaText}>{wikiCategoryLabel(article.category)}</Text>
        {article.updated ? <Text style={styles.metaText}>Updated {formatDate(article.updated)}</Text> : null}
      </View>
      <Panel>
        <Markdown source={withoutLeadingHeading(article.body_markdown)} />
      </Panel>
      {related.length > 0 ? (
        <Panel>
          <SectionTitle title="Related batches" />
          <View style={styles.list}>
            {related.map((batch) => (
              <WebLink key={batch.batch_id} href={`/brews/${batch.batch_id}`} className="lto-link">
                <Text style={styles.link}>
                  {batch.name} ({batch.batch_id})
                </Text>
              </WebLink>
            ))}
          </View>
        </Panel>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  metaText: {
    color: colors.dim,
    fontSize: 14,
    textTransform: "capitalize",
  },
  muted: {
    color: colors.muted,
  },
  list: {
    gap: 8,
  },
  link: {
    color: colors.brass,
  },
});
