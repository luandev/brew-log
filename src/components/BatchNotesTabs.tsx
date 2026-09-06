import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import type { Batch } from "../types";
import { LogReader } from "./LogReader";
import { Markdown } from "./Markdown";
import { ScheduleTable } from "./BatchMeta";
import { Icon } from "./Icon";

const TABS = [
  { id: "log", label: "Log" },
  { id: "recipe", label: "Recipe" },
  { id: "schedule", label: "Schedule" },
  { id: "notes", label: "Notes" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function BatchNotesTabs({ batch }: { batch: Batch }) {
  const [tab, setTab] = useState<TabId>("log");

  return (
    <View style={styles.wrap} testID="batch-notes">
      <View style={styles.header}>
        <Icon kind="section" id="notes" size={36} />
        <Text style={styles.title}>Notes</Text>
      </View>
      <View style={styles.tabList} accessibilityRole="tablist">
        {TABS.map((item) => {
          const selected = item.id === tab;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setTab(item.id)}
              style={[styles.tab, selected && styles.tabActive]}
            >
              <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {tab === "log" ? <LogReader entries={batch.log_entries || []} /> : null}
      {tab === "recipe" ? (
        <View testID="batch-recipe">
          <Markdown source={batch.recipe_markdown} />
        </View>
      ) : null}
      {tab === "schedule" ? <ScheduleTable batch={batch} /> : null}
      {tab === "notes" ? (
        <View>
          <Markdown source={batch.tasting_markdown} />
          <Markdown source={batch.media_markdown} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    color: colors.brass,
    fontSize: 18,
    fontWeight: "700",
  },
  tabList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tabActive: {
    backgroundColor: "rgba(173, 151, 83, 0.18)",
  },
  tabLabel: {
    color: colors.muted,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: colors.brass,
  },
});
