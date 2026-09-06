import { createElement } from "react";
import { Link } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { formatDate, statusLabel } from "../lib/format";
import { colors } from "../theme";
import type { Batch, StageRow } from "../types";
import { FormattedDate } from "./FormattedDate";
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
      {Platform.OS === "web" ? (
        createElement(
          "table",
          { className: "lto-batch-table" },
          createElement(
            "thead",
            null,
            createElement(
              "tr",
              null,
              ...["Stage", "Started", "Ended", "Status"].map((head) =>
                createElement("th", { key: head }, head),
              ),
            ),
          ),
          createElement(
            "tbody",
            null,
            ...stages.map((row) =>
              createElement(
                "tr",
                { key: `${row.stage}-${row.status}-${row.started}` },
                createElement("td", null, createElement(StatusBadge, { status: row.stage })),
                createElement("td", null, createElement(FormattedDate, { value: row.started })),
                createElement("td", null, endedValue(row)),
                createElement("td", { className: "lto-status-cell" }, statusLabel(row.status)),
              ),
            ),
          ),
        )
      ) : (
        <>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.head, styles.stageCol]}>Stage</Text>
            <Text style={[styles.cell, styles.head]}>Started</Text>
            <Text style={[styles.cell, styles.head]}>Ended</Text>
            <Text style={[styles.cell, styles.head]}>Status</Text>
          </View>
          {stages.map((row) => (
            <View key={`${row.stage}-${row.status}-${row.started}`} style={styles.row}>
              <View style={styles.stageCol}>
                <StatusBadge status={row.stage} />
              </View>
              <View style={styles.cell}>
                <FormattedDate value={row.started} />
              </View>
              <View style={styles.cell}>{endedValue(row)}</View>
              <Text style={styles.cell}>{statusLabel(row.status)}</Text>
            </View>
          ))}
        </>
      )}
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
          <View style={styles.cell}>
            <FormattedDate value={row.date} />
          </View>
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

function endedValue(row: StageRow) {
  if (row.ended) return <FormattedDate value={row.ended} />;
  if (row.status.toLowerCase() === "active") {
    return <Text style={styles.ongoing}>ongoing</Text>;
  }
  return <FormattedDate value={null} />;
}

function stageMeta(row: StageRow): string {
  const status = row.status.toLowerCase();
  if (status === "skipped") return "Skipped";
  if (row.started && row.ended && row.started !== row.ended) {
    return `${formatDate(row.started)} → ${formatDate(row.ended)}`;
  }
  if (row.started && row.ended) return formatDate(row.started);
  if (row.started && status === "active") return `Since ${formatDate(row.started)}`;
  if (row.started) return formatDate(row.started);
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
    flexWrap: "nowrap",
    gap: 10,
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(173, 151, 83, 0.15)",
  },
  cell: {
    color: colors.muted,
    minWidth: 110,
    flexShrink: 0,
  },
  stageCol: {
    minWidth: 180,
    flexGrow: 1,
  },
  head: {
    color: colors.dim,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  grow: {
    flexGrow: 1,
    minWidth: 160,
  },
  ongoing: {
    color: colors.muted,
    fontStyle: "italic",
  },
  empty: {
    color: colors.dim,
  },
  link: {
    color: colors.brass,
  },
});
