import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatDate } from "../lib/format";
import { colors } from "../theme";
import type { Batch } from "../types";

export function LatestNotes({ notes }: { notes: Batch[] }) {
  const [index, setIndex] = useState(0);
  if (notes.length === 0) {
    return <Text style={styles.empty}>No notes yet.</Text>;
  }

  const note = notes[index];

  return (
    <View>
      {notes.length > 1 ? (
        <View style={styles.controls}>
          <Text style={styles.count}>
            {index + 1} / {notes.length}
          </Text>
          <Pressable onPress={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>
            <Text style={[styles.nav, index === 0 && styles.disabled]}>‹</Text>
          </Pressable>
          <Pressable
            onPress={() => setIndex((value) => Math.min(notes.length - 1, value + 1))}
            disabled={index === notes.length - 1}
          >
            <Text style={[styles.nav, index === notes.length - 1 && styles.disabled]}>›</Text>
          </Pressable>
        </View>
      ) : null}
      <Text style={styles.date}>{formatDate(note.last_log_date)}</Text>
      <Link href={`/brews/${note.batch_id}`} asChild>
        <Pressable>
          <Text style={styles.batch}>{note.name}</Text>
        </Pressable>
      </Link>
      <Text style={styles.excerpt}>{note.latest_log_excerpt}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  count: {
    color: colors.dim,
    fontSize: 13,
  },
  nav: {
    color: colors.brass,
    fontSize: 22,
    paddingHorizontal: 6,
  },
  disabled: {
    opacity: 0.35,
  },
  date: {
    color: colors.dim,
    fontSize: 13,
  },
  batch: {
    color: colors.brass,
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 6,
  },
  excerpt: {
    color: colors.muted,
    lineHeight: 22,
  },
  empty: {
    color: colors.dim,
  },
});
