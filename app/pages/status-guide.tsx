import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { Panel, SectionTitle, StatusBadge } from "../../src/components/ui";
import { batches, statuses } from "../../src/lib/data";
import { colors } from "../../src/theme";

export default function StatusGuidePage() {
  const lifecycle = statuses.filter((status) => status.active);

  return (
    <Screen
      title="Status Guide"
      intro="Batch status is set in each brew's README.md front matter. It drives badges, active brew lists, schedule visibility, and progress tracking."
    >
      <Panel>
        <SectionTitle title="Lifecycle" icon="lifecycle" />
        <View style={styles.flow}>
          {lifecycle.map((status, index) => (
            <View key={status.id} style={styles.flowItem}>
              <StatusBadge status={status.id} />
              {index < lifecycle.length - 1 ? <Text style={styles.arrow}>→</Text> : null}
            </View>
          ))}
        </View>
        <Text style={styles.note}>
          Stages can be skipped. Terminal paths: finished, failed, archived.
        </Text>
      </Panel>
      <View style={styles.grid}>
        {statuses.map((status) => {
          const inStatus = batches.filter((batch) => batch.status === status.id);
          return (
            <Panel key={status.id}>
              <View style={styles.cardHeader}>
                <StatusBadge status={status.id} />
                <Text style={styles.phase}>{status.phase}</Text>
              </View>
              <Text style={styles.description}>{status.description}</Text>
              <Text style={styles.meta}>Recipe section: {status.recipe_section}</Text>
              <Text style={styles.meta}>Log focus: {status.log_focus}</Text>
              <Text style={styles.meta}>Schedule focus: {status.schedule_focus}</Text>
              <Text style={styles.meta}>
                Typically next: {status.next.length ? status.next.join(", ") : "—"}
              </Text>
              <Text style={styles.meta}>Active batch list: {status.active ? "Shown" : "Hidden"}</Text>
              {inStatus.length > 0 ? (
                <View style={styles.batchList}>
                  {inStatus.map((batch) => (
                    <Link key={batch.batch_id} href={`/brews/${batch.batch_id}`} asChild>
                      <Pressable>
                        <Text style={styles.link}>
                          {batch.name} ({batch.batch_id})
                        </Text>
                      </Pressable>
                    </Link>
                  ))}
                </View>
              ) : null}
            </Panel>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  flowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  arrow: {
    color: colors.dim,
  },
  note: {
    color: colors.dim,
    fontSize: 13,
  },
  grid: {
    marginTop: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  phase: {
    color: colors.dim,
    fontSize: 13,
  },
  description: {
    color: colors.muted,
    lineHeight: 22,
  },
  meta: {
    color: colors.dim,
    fontSize: 13,
  },
  batchList: {
    gap: 6,
  },
  link: {
    color: colors.brass,
  },
});
