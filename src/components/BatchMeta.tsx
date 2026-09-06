import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatDate } from "../lib/format";
import { colors } from "../theme";
import type { Batch, StageRow } from "../types";
import { StatusBadge } from "./ui";

export function StageTrail({ stages }: { stages: StageRow[] }) {
  const visible = stages.filter((row) => row.status.toLowerCase() !== "planned");
  if (visible.length === 0) return null;

  return (
    <View style={styles.trail}>
      {visible.map((row) => (
        <View key={`${row.stage}-${row.started}-${row.status}`} style={styles.trailItem}>
          <StatusBadge status={row.stage} />
          <Text style={styles.meta}>{stageMeta(row)}</Text>
        </View>
      ))}
    </View>
  );
}

export function StagesTable({ stages }: { stages: StageRow[] }) {
  if (stages.length === 0) return null;
  return (
    <View>
      <Text style={styles.tableTitle}>Fermentation stages</Text>
      {stages.map((row) => (
        <View key={`${row.stage}-${row.status}-${row.started}`} style={styles.row}>
          <StatusBadge status={row.stage} />
          <Text style={styles.cell}>{row.started || "—"}</Text>
          <Text style={styles.cell}>
            {row.ended ? row.ended : row.status === "active" ? "ongoing" : "—"}
          </Text>
          <Text style={styles.cell}>{row.status}</Text>
        </View>
      ))}
    </View>
  );
}

export function ScheduleTable({ batch }: { batch: Batch }) {
  if (!batch.schedule?.length) {
    return <Text style={styles.empty}>No scheduled actions.</Text>;
  }
  return (
    <View>
      {batch.schedule.map((row) => (
        <View key={`${row.date}-${row.action}`} style={styles.row}>
          <Text style={styles.cell}>{formatDate(row.date)}</Text>
          <Text style={[styles.cell, styles.grow]}>{row.action}</Text>
          <Text style={styles.cell}>{row.status}</Text>
        </View>
      ))}
    </View>
  );
}

export function StatusGuideLink({ status }: { status: string }) {
  return (
    <Link href={`/pages/status-guide#${status}` as "/pages/status-guide"} asChild>
      <Pressable>
        <Text style={styles.link}>What this status means</Text>
      </Pressable>
    </Link>
  );
}

function stageMeta(row: StageRow): string {
  const status = row.status.toLowerCase();
  if (status === "skipped") return "Skipped";
  if (row.started && row.ended && row.started !== row.ended) return `${row.started} → ${row.ended}`;
  if (row.started && row.ended) return row.started;
  if (row.started && status === "active") return `Since ${row.started}`;
  if (row.started) return row.started;
  return "—";
}

const styles = StyleSheet.create({
  trail: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  trailItem: {
    gap: 4,
  },
  meta: {
    color: colors.dim,
    fontSize: 12,
  },
  tableTitle: {
    color: colors.brass,
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(173, 151, 83, 0.15)",
  },
  cell: {
    color: colors.muted,
    minWidth: 90,
  },
  grow: {
    flexGrow: 1,
    minWidth: 160,
  },
  empty: {
    color: colors.dim,
  },
  link: {
    color: colors.brass,
  },
});
