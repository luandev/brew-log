import { createElement } from "react";
import { usePathname } from "expo-router";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { assetUrl } from "../lib/format";
import { colors, navItems, site } from "../theme";
import { Icon } from "./Icon";
import { WebLink } from "./WebLink";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <View style={styles.header} {...webClass("lto-header")}>
      <View style={styles.inner}>
        <WebLink href="/" className="lto-brand" label={site.title}>
          <View style={styles.brand}>
            <Icon file="lone-tree-seal-nav" size={52} label={site.title} />
            <Text style={styles.wordmark}>{site.title}</Text>
          </View>
        </WebLink>
        <View style={styles.nav} accessibilityRole="navigation">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <WebLink
                key={item.href}
                href={item.href}
                className={active ? "lto-nav-link is-active" : "lto-nav-link"}
              >
                {item.label}
              </WebLink>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export function SiteHero({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.hero, compact && styles.heroCompact]} {...webClass("lto-hero")}>
      {Platform.OS === "web"
        ? createElement("img", {
            src: assetUrl("assets/brand/hero.png"),
            className: "lto-hero-img",
            alt: "",
          })
        : (
          <Image
            source={{ uri: assetUrl("assets/brand/hero.png") }}
            style={styles.heroFallback}
            accessibilityLabel=""
          />
        )}
      <View style={styles.heroScrim} />
      <View style={[styles.heroContent, compact && styles.heroContentCompact]}>
        <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>{site.title}</Text>
        <View style={styles.heroSubtitleRow}>
          <Image
            source={{ uri: assetUrl("assets/brand/branch-divider.svg") }}
            style={styles.branch}
            accessibilityLabel=""
          />
          <Text style={styles.heroSubtitle}>{site.journal}</Text>
          <Image
            source={{ uri: assetUrl("assets/brand/branch-divider.svg") }}
            style={[styles.branch, styles.branchFlip]}
            accessibilityLabel=""
          />
        </View>
        {compact ? null : (
          <Text style={styles.heroTagline}>
            {site.heroTagline}
            {"\n"}
            {site.heroSubtagline}
          </Text>
        )}
      </View>
    </View>
  );
}

export function SiteFooter() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerGrid}>
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>{site.title}</Text>
          <Text style={styles.footerText}>{site.tagline}</Text>
          <Text style={styles.footerText}>{site.description}</Text>
        </View>
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>Brew Log</Text>
          <FooterLink href="/" label="Dashboard" />
          <FooterLink href="/pages/batches" label="All Batches" />
          <FooterLink href="/pages/schedule" label="Schedule" />
          <FooterLink href="/pages/active" label="Active Brews" />
        </View>
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>Browse</Text>
          <FooterLink href="/pages/ciders" label="Ciders" />
          <FooterLink href="/pages/wines" label="Wines" />
          <FooterLink href="/pages/status-guide" label="Status Guide" />
          <FooterLink href="/docs/brewing-notes" label="About" />
        </View>
      </View>
      <Text style={styles.copy}>© {new Date().getFullYear()} {site.title}</Text>
    </View>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <WebLink href={href} className="lto-footer-link">
      {label}
    </WebLink>
  );
}

function webClass(className: string) {
  return Platform.OS === "web" ? { className } : {};
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "rgba(14, 15, 16, 0.92)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  inner: {
    maxWidth: 1100,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  wordmark: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  nav: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "center",
  },
  hero: {
    position: "relative",
    minHeight: 280,
    justifyContent: "center",
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heroCompact: {
    minHeight: 140,
  },
  heroFallback: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.42,
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14, 15, 16, 0.45)",
  },
  heroContent: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
    gap: 8,
    zIndex: 1,
  },
  heroContentCompact: {
    paddingVertical: 24,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
  },
  heroTitleCompact: {
    fontSize: 26,
  },
  heroSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  branch: {
    width: 120,
    height: 12,
  },
  branchFlip: {
    transform: [{ scaleX: -1 }],
  },
  heroSubtitle: {
    color: colors.brass,
    fontSize: 16,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  heroTagline: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 20,
  },
  footerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
  },
  footerCol: {
    flexGrow: 1,
    minWidth: 180,
    gap: 8,
  },
  footerTitle: {
    color: colors.brass,
    fontWeight: "700",
    marginBottom: 4,
  },
  footerText: {
    color: colors.dim,
    fontSize: 14,
    lineHeight: 20,
  },
  copy: {
    color: colors.dim,
    fontSize: 12,
    textAlign: "center",
  },
});
