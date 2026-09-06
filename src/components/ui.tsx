import type { ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { colors, statusColors } from "../theme";
import { statusLabel } from "../lib/format";
import { Icon } from "./Icon";

export function StatusBadge({ status }: { status: string }) {
  const tone = statusColors[status] ?? {
    background: "rgba(173, 151, 83, 0.1)",
    color: colors.muted,
    border: colors.border,
  };

  return (
    <View style={[styles.badge, { backgroundColor: tone.background, borderColor: tone.border }]}>
      <Icon kind="status" id={status} size={14} />
      <Text style={[styles.label, { color: tone.color }]}>{statusLabel(status)}</Text>
    </View>
  );
}

export function Panel({
  children,
  style,
  testID,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  return (
    <View testID={testID} style={[styles.panel, style]}>
      {children}
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  icon,
}: {
  title: string;
  action?: ReactNode;
  icon?: string;
}) {
  return (
    <View style={styles.sectionTitle}>
      <View style={styles.sectionTitleLeft}>
        {icon ? <Icon kind="section" id={icon} size={36} /> : null}
        <Text style={styles.sectionTitleText}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
    letterSpacing: 0.2,
  },
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 4,
  },
  sectionTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  sectionTitleText: {
    color: colors.brass,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
