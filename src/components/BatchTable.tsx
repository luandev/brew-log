import { createElement } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { formatDate } from "../lib/format";
import { colors } from "../theme";
import type { Batch } from "../types";
import { Icon } from "./Icon";
import { StatusBadge } from "./ui";
import { WebLink } from "./WebLink";

export function BatchTable({ batches, emptyMessage }: { batches: Batch[]; emptyMessage: string }) {
  if (batches.length === 0) {
    return <Text style={styles.empty}>{emptyMessage}</Text>;
  }

  if (Platform.OS === "web") {
    return createElement(
      "table",
      { className: "lto-batch-table" },
      createElement(
        "thead",
        null,
        createElement("tr", null, ...["ID", "Name", "Type", "Status", "Started"].map((head) =>
          createElement("th", { key: head }, head),
        )),
      ),
      createElement(
        "tbody",
        null,
        ...batches.map((batch) =>
          createElement(
            "tr",
            { key: batch.batch_id },
            createElement(
              "td",
              null,
              createElement(WebLink, { href: `/brews/${batch.batch_id}`, className: "lto-link" }, batch.batch_id),
            ),
            createElement(
              "td",
              null,
              createElement(WebLink, { href: `/brews/${batch.batch_id}`, className: "lto-link" }, batch.name),
            ),
            createElement(
              "td",
              null,
              createElement(View, { style: styles.typeCell },
                createElement(Icon, { kind: "type", id: batch.type, size: 28 }),
                createElement(Text, { style: styles.typeLabel }, batch.type),
              ),
            ),
            createElement("td", null, createElement(StatusBadge, { status: batch.status })),
            createElement("td", null, formatDate(batch.started)),
          ),
        ),
      ),
    );
  }

  return (
    <View>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.head]}>ID</Text>
        <Text style={[styles.cell, styles.head, styles.grow]}>Name</Text>
        <Text style={[styles.cell, styles.head]}>Type</Text>
        <Text style={[styles.cell, styles.head]}>Status</Text>
        <Text style={[styles.cell, styles.head]}>Started</Text>
      </View>
      {batches.map((batch) => (
        <View key={batch.batch_id} style={styles.row}>
          <WebLink href={`/brews/${batch.batch_id}`} style={styles.cell}>
            <Text style={styles.link}>{batch.batch_id}</Text>
          </WebLink>
          <WebLink href={`/brews/${batch.batch_id}`} style={[styles.cell, styles.grow]}>
            <Text style={styles.link}>{batch.name}</Text>
          </WebLink>
          <View style={[styles.cell, styles.typeCell]}>
            <Icon kind="type" id={batch.type} size={24} />
            <Text style={styles.typeLabel}>{batch.type}</Text>
          </View>
          <View style={styles.cell}>
            <StatusBadge status={batch.status} />
          </View>
          <Text style={styles.cell}>{formatDate(batch.started)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(173, 151, 83, 0.2)",
    alignItems: "center",
  },
  cell: {
    minWidth: 72,
    color: colors.muted,
    fontSize: 14,
  },
  grow: {
    flexGrow: 1,
    minWidth: 160,
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
  typeCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeLabel: {
    color: colors.muted,
    textTransform: "capitalize",
  },
});
