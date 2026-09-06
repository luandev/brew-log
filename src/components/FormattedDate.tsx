import { createElement } from "react";
import { Platform, Text, type StyleProp, type TextStyle } from "react-native";
import { asDateString, formatDate } from "../lib/format";
import { colors } from "../theme";

export function FormattedDate({
  value,
  fallback = "—",
  style,
}: {
  value?: string | Date | null;
  fallback?: string;
  style?: StyleProp<TextStyle>;
}) {
  const raw = asDateString(value);
  if (!raw) {
    return <Text style={[styles, style]}>{fallback}</Text>;
  }

  const label = formatDate(value);
  if (Platform.OS === "web") {
    return createElement(
      "time",
      { dateTime: raw, className: "lto-date" },
      label,
    );
  }

  return <Text style={[styles, style]}>{label}</Text>;
}

const styles: TextStyle = {
  color: colors.muted,
};
