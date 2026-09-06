import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatDate } from "../lib/format";
import { colors } from "../theme";
import type { Batch } from "../types";
import { Icon } from "./Icon";
import { StatusBadge } from "./ui";

export function ActiveBrewCard({ batch }: { batch: Batch }) {
  return (
    <Link href={`/brews/${batch.batch_id}`} asChild>
      <Pressable
        style={StyleSheet.flatten([styles.card, { borderColor: batch.accent }])}
        accessibilityRole="link"
        accessibilityLabel={batch.name}
      >
        <Icon kind="type" id={batch.type} size={72} />
        <View style={styles.info}>
          <Text style={styles.name}>{batch.name}</Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>{batch.batch_id}</Text>
            <StatusBadge status={batch.current_stage || batch.status} />
            {batch.started ? <Text style={styles.metaText}>Started {formatDate(batch.started)}</Text> : null}
            {batch.target_abv ? <Text style={styles.metaText}>Est. {batch.target_abv}% ABV</Text> : null}
          </View>
        </View>
        <View style={styles.progress}>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${Math.min(100, batch.progress_percent || 0)}%`,
                  backgroundColor: batch.accent,
                },
              ]}
            />
          </View>
          <Text style={styles.days}>
            Day {batch.days_elapsed} / {batch.target_days}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "rgba(20, 22, 26, 0.8)",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flex: 1,
    minWidth: 200,
    gap: 8,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  metaText: {
    color: colors.dim,
    fontSize: 13,
  },
  progress: {
    minWidth: 120,
    gap: 6,
  },
  track: {
    height: 8,
    borderRadius: 99,
    backgroundColor: "rgba(242, 235, 217, 0.08)",
    overflow: "hidden",
  },
  fill: {
    height: 8,
    borderRadius: 99,
  },
  days: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "right",
  },
});
