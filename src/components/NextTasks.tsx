import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatDate } from "../lib/format";
import { colors } from "../theme";
import type { ScheduleTask } from "../types";

export function NextTasks({ tasks }: { tasks: ScheduleTask[] }) {
  if (tasks.length === 0) {
    return <Text style={styles.empty}>No pending tasks.</Text>;
  }

  return (
    <View style={styles.list}>
      {tasks.slice(0, 6).map((task) => (
        <View key={`${task.batch_id}-${task.date}-${task.action}`} style={styles.item}>
          <Text style={styles.date}>{formatDate(task.date)}</Text>
          <View style={styles.body}>
            <Text style={styles.action}>{task.action}</Text>
            <Link href={`/brews/${task.batch_id}`} asChild>
              <Pressable>
                <Text style={styles.batch}>{task.name}</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  item: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  date: {
    color: colors.brass,
    fontSize: 13,
    minWidth: 72,
    paddingTop: 2,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  action: {
    color: colors.text,
  },
  batch: {
    color: colors.muted,
    fontSize: 13,
  },
  empty: {
    color: colors.dim,
  },
});
