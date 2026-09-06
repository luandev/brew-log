import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Markdown } from "../../../src/components/Markdown";
import { BatchNotesTabs } from "../../../src/components/BatchNotesTabs";
import { StagesTable, StageTrail, StatusGuideLink } from "../../../src/components/BatchMeta";
import { Screen } from "../../../src/components/Screen";
import { Panel, SectionTitle, StatusBadge } from "../../../src/components/ui";
import { batches, getBatch, statusById } from "../../../src/lib/data";
import { formatDate } from "../../../src/lib/format";
import { colors } from "../../../src/theme";

export async function generateStaticParams() {
  return batches.map((batch) => ({ batchId: batch.batch_id }));
}

export default function BatchPage() {
  const { batchId } = useLocalSearchParams<{ batchId: string }>();
  const batch = getBatch(Array.isArray(batchId) ? batchId[0] : batchId);

  if (!batch) {
    return (
      <Screen title="Batch not found">
        <Text style={styles.muted}>No brew is recorded for this ID.</Text>
      </Screen>
    );
  }

  const statusInfo = statusById(batch.status);

  return (
    <Screen>
      <View style={[styles.header, { borderColor: batch.accent }]}>
        <Text style={styles.batchId}>{batch.batch_id}</Text>
        <View testID="batch-title">
          <Text style={styles.title}>{batch.name}</Text>
        </View>
        <View style={styles.meta}>
          <StatusBadge status={batch.status} />
          <Text style={styles.metaText}>{batch.type}</Text>
          {batch.started ? <Text style={styles.metaText}>Started {formatDate(batch.started)}</Text> : null}
          {batch.volume_l ? <Text style={styles.metaText}>{batch.volume_l} L</Text> : null}
          {batch.target_abv ? <Text style={styles.metaText}>Target {batch.target_abv}% ABV</Text> : null}
        </View>
        {Array.isArray(batch.tags) && batch.tags.length > 0 ? (
          <View style={styles.tags}>
            {batch.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.stack}>
        <Panel>
          <SectionTitle title="Current Status" />
          <StageTrail stages={batch.stages} />
          {statusInfo ? <Text style={styles.muted}>{statusInfo.description}</Text> : null}
          <StatusGuideLink status={batch.status} />
          <StagesTable stages={batch.stages} />
        </Panel>

        {batch.summary_markdown ? (
          <Panel>
            <Markdown source={batch.summary_markdown} />
          </Panel>
        ) : null}

        <Panel>
          <BatchNotesTabs batch={batch} />
        </Panel>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    backgroundColor: colors.panel,
    gap: 8,
    marginBottom: 16,
  },
  batchId: {
    color: colors.brass,
    letterSpacing: 1,
    fontSize: 13,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "700",
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  metaText: {
    color: colors.muted,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    color: colors.dim,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
  },
  stack: {
    gap: 16,
  },
  muted: {
    color: colors.muted,
    lineHeight: 22,
  },
});
