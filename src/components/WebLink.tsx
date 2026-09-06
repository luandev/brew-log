import { createElement, type ReactNode } from "react";
import { Link } from "expo-router";
import { Platform, Pressable, type StyleProp, type ViewStyle } from "react-native";
import { routeUrl } from "../lib/format";

export function WebLink({
  href,
  children,
  style,
  className,
  label,
}: {
  href: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
  label?: string;
}) {
  if (Platform.OS === "web") {
    return createElement(
      "a",
      {
        href: routeUrl(href),
        className: className || "lto-link",
        "aria-label": label,
        style: { textDecoration: "none" },
      },
      children,
    );
  }

  return (
    <Link href={href as "/"} asChild>
      <Pressable style={style} accessibilityLabel={label}>
        {children}
      </Pressable>
    </Link>
  );
}
