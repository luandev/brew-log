import { createElement } from "react";
import { Image, Platform } from "react-native";
import lookup from "../data/icon_lookup.json";
import { assetUrl } from "../lib/format";

type LookupKind = "status" | "type" | "section";

export function iconFile(kind: LookupKind, id: string): string | undefined {
  const entries = lookup[kind] as { id: string; file: string }[];
  return entries.find((entry) => entry.id === id)?.file;
}

export function Icon({
  file,
  kind,
  id,
  size = 36,
  label,
}: {
  file?: string;
  kind?: LookupKind;
  id?: string;
  size?: number;
  label?: string;
}) {
  const name = file || (kind && id ? iconFile(kind, id) : undefined);
  if (!name) return null;
  const src = assetUrl(`assets/icons/${name}.png`);

  if (Platform.OS === "web") {
    return createElement("img", {
      src,
      alt: label || "",
      width: size,
      height: size,
      className: "lto-icon",
      style: { width: size, height: size, objectFit: "contain", flexShrink: 0 },
    });
  }

  return (
    <Image
      source={{ uri: src }}
      resizeMode="contain"
      style={{ width: size, height: size }}
      accessibilityLabel={label || ""}
    />
  );
}
