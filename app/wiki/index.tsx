import { StyleSheet, Text, View } from "react-native";
import { Markdown } from "../../src/components/Markdown";
import { Screen } from "../../src/components/Screen";
import { WebLink } from "../../src/components/WebLink";
import { Panel, SectionTitle } from "../../src/components/ui";
import { wiki, wikiArticlesByCategory } from "../../src/lib/data";
import { colors } from "../../src/theme";

function withoutLeadingHeading(source: string) {
  return source.replace(/^#\s+[^\n]+\n+/, "");
}

export default function WikiIndexPage() {
  const groups = wikiArticlesByCategory();

  return (
    <Screen
      title="Wiki"
      intro="Reusable brewing knowhow. Batch records stay in the brew log."
      testID="wiki-page"
    >
      {wiki.intro_markdown ? (
        <Panel>
          <Markdown source={withoutLeadingHeading(wiki.intro_markdown)} />
        </Panel>
      ) : null}
      {groups.map((group) => (
        <Panel key={group.id}>
          <SectionTitle title={group.label} />
          <View style={styles.list}>
            {group.articles.map((article) => (
              <WebLink key={article.slug} href={`/wiki/${article.slug}`} className="lto-link">
                <Text style={styles.title}>{article.title}</Text>
                {article.summary ? <Text style={styles.summary}>{article.summary}</Text> : null}
              </WebLink>
            ))}
          </View>
        </Panel>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  title: {
    color: colors.brass,
    fontSize: 18,
    fontWeight: "600",
  },
  summary: {
    color: colors.muted,
    marginTop: 4,
    lineHeight: 20,
  },
});
