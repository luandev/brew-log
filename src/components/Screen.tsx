import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import { Icon } from "./Icon";
import { SiteFooter, SiteHero } from "./SiteChrome";

export function Screen({
  children,
  title,
  intro,
  hero = "compact",
  icon,
  testID,
}: {
  children: ReactNode;
  title?: string;
  intro?: string;
  hero?: boolean | "compact";
  icon?: string;
  testID?: string;
}) {
  const mode = hero === false ? "none" : hero === true ? "full" : "compact";

  return (
    <View testID={testID} style={styles.scroll}>
      {mode === "none" ? null : <SiteHero compact={mode === "compact"} />}
      <View style={styles.wrapper}>
        {title ? (
          <View style={styles.titleRow}>
            {icon ? <Icon kind="section" id={icon} size={40} /> : null}
            <Text style={styles.title}>{title}</Text>
          </View>
        ) : null}
        {intro ? <Text style={styles.intro}>{intro}</Text> : null}
        {children}
        <SiteFooter />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: "transparent",
    flexGrow: 1,
    flexShrink: 0,
  },
  wrapper: {
    maxWidth: 1100,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "700",
  },
  intro: {
    color: colors.muted,
    marginBottom: 20,
    lineHeight: 22,
  },
});
