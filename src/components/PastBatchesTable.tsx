import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatDate } from "../lib/format";
import { colors } from "../theme";
import type { Batch } from "../types";
import { StatusBadge } from "./ui";

export function PastBatchesTable({ batches }: { batches: Batch[] }) {
  if (batches.length === 0) {
    return <Text style={styles.empty}>No completed batches yet.</Text>;
  }

  return (
    <View>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.head]}>Batch</Text>
        <Text style={[styles.cell, styles.head, styles.grow]}>Name</Text>
        <Text style={[styles.cell, styles.head]}>Started</Text>
        <Text style={[styles.cell, styles.head]}>ABV</Text>
        <Text style={[styles.cell, styles.head]}>Outcome</Text>
      </View>
      {batches.map((batch) => (
        <View key={batch.batch_id} style={styles.row}>
          <Link href={`/brews/${batch.batch_id}`} asChild>
            <Pressable style={styles.cell}>
              <Text style={styles.link}>{batch.batch_id}</Text>
            </Pressable>
          </Link>
          <Link href={`/brews/${batch.batch_id}`} asChild>
            <Pressable style={[styles.cell, styles.grow]}>
              <Text style={styles.link}>{batch.name}</Text>
            </Pressable>
          </Link>
          <Text style={styles.cell}>{formatDate(batch.started)}</Text>
          <Text style={styles.cell}>
            {batch.actual_abv ? `${batch.actual_abv}%` : batch.target_abv ? `${batch.target_abv}%` : "—"}
          </Text>
          <View style={styles.cell}>
            <StatusBadge status={batch.status} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(173, 151, 83, 0.2)",
    alignItems: "center",
  },
  cell: {
    minWidth: 80,
    color: colors.muted,
    fontSize: 14,
  },
  grow: {
    flexGrow: 1,
    minWidth: 140,
  },
  head: {
    color: colors.dim,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  link: {
    color: colors.brass,
  },
  empty: {
    color: colors.dim,
  },
});
