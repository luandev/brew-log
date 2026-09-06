import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import type { LogEntry } from "../types";
import { Markdown } from "./Markdown";

export function LogReader({ entries }: { entries: LogEntry[] }) {
  const [index, setIndex] = useState(() => Math.max(0, entries.length - 1));
  if (entries.length === 0) {
    return <Text style={styles.empty}>No log entries yet.</Text>;
  }

  const entry = entries[index];

  return (
    <View>
      <View style={styles.controls}>
        <Text style={styles.count}>
          {index + 1} / {entries.length}
        </Text>
        <Pressable onPress={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>
          <Text style={[styles.nav, index === 0 && styles.disabled]}>‹</Text>
        </Pressable>
        <Pressable
          onPress={() => setIndex((value) => Math.min(entries.length - 1, value + 1))}
          disabled={index === entries.length - 1}
        >
          <Text style={[styles.nav, index === entries.length - 1 && styles.disabled]}>›</Text>
        </Pressable>
      </View>
      <Text style={styles.heading}>
        {entry.date}
        {entry.day_label ? ` — ${entry.day_label}` : ""}
      </Text>
      {entry.stage ? <Text style={styles.stage}>{entry.stage}</Text> : null}
      <LogSection title="Observation" body={entry.observation} defaultOpen />
      <LogSection title="Measurements" body={entry.measurements} />
      <LogSection title="Actions" body={entry.actions} />
      <LogSection title="Next" body={entry.next} />
    </View>
  );
}

function LogSection({
  title,
  body,
  defaultOpen = false,
}: {
  title: string;
  body?: string | null;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (!body) return null;
  return (
    <View style={styles.section}>
      <Pressable onPress={() => setOpen((value) => !value)}>
        <Text style={styles.sectionTitle}>
          {open ? "▾" : "▸"} {title}
        </Text>
      </Pressable>
      {open ? <Markdown source={body} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  count: {
    color: colors.dim,
  },
  nav: {
    color: colors.brass,
    fontSize: 22,
    paddingHorizontal: 6,
  },
  disabled: {
    opacity: 0.35,
  },
  heading: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  stage: {
    color: colors.muted,
    marginBottom: 12,
  },
  section: {
    marginTop: 10,
    gap: 6,
  },
  sectionTitle: {
    color: colors.brass,
    fontWeight: "600",
  },
  empty: {
    color: colors.dim,
  },
});
