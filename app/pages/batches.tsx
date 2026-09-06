import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BatchTable } from "../../src/components/BatchTable";
import { Screen } from "../../src/components/Screen";
import { Icon } from "../../src/components/Icon";
import { Panel } from "../../src/components/ui";
import { batches } from "../../src/lib/data";
import { colors } from "../../src/theme";

export default function BatchesPage() {
  const types = useMemo(
    () => Array.from(new Set(batches.map((batch) => batch.type))).sort(),
    [],
  );
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? batches : batches.filter((batch) => batch.type === filter);

  return (
    <Screen title="Batches" icon="batches" testID="batches-page">
      <View style={styles.tabs} accessibilityRole="tablist">
        <FilterTab id="all" label="All" selected={filter === "all"} onSelect={setFilter} />
        {types.map((type) => (
          <FilterTab
            key={type}
            id={type}
            label={type}
            selected={filter === type}
            onSelect={setFilter}
            iconType={type}
          />
        ))}
      </View>
      <Panel>
        <BatchTable batches={visible} emptyMessage="No batches documented yet." />
      </Panel>
    </Screen>
  );
}

function FilterTab({
  id,
  label,
  selected,
  onSelect,
  iconType,
}: {
  id: string;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
  iconType?: string;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={() => onSelect(id)}
      style={[styles.tab, selected && styles.tabActive]}
    >
      {iconType ? <Icon kind="type" id={iconType} size={22} /> : null}
      <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: "rgba(173, 151, 83, 0.18)",
  },
  tabLabel: {
    color: colors.muted,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  tabLabelActive: {
    color: colors.brass,
  },
});
