import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { asDateString, formatMonthYear } from "../lib/format";
import { colors } from "../theme";
import type { CalendarData } from "../types";

const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDay(value: string): Date {
  return new Date(`${asDateString(value)}T00:00:00`);
}

function ymd(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function daysInMonth(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function MiniCalendar({ calendar }: { calendar: CalendarData }) {
  const today = parseDay(calendar.today);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const cells = useMemo(() => daysInMonth(cursor.year, cursor.month), [cursor]);
  const taskDates = new Set(calendar.tasks.map((task) => asDateString(task.date)));

  return (
    <View>
      <View style={styles.toolbar}>
        <Pressable onPress={() => setCursor((c) => shiftMonth(c, -1))}>
          <Text style={styles.nav}>‹</Text>
        </Pressable>
        <Text style={styles.title}>{formatMonthYear(cursor.year, cursor.month)}</Text>
        <Pressable onPress={() => setCursor((c) => shiftMonth(c, 1))}>
          <Text style={styles.nav}>›</Text>
        </Pressable>
      </View>
      <View style={styles.grid}>
        {DOW.map((label) => (
          <Text key={label} style={styles.dow}>
            {label}
          </Text>
        ))}
        {cells.map((date) => {
          const key = ymd(date);
          const inMonth = date.getMonth() === cursor.month;
          const isToday = key === asDateString(calendar.today);
          const hasTask = taskDates.has(key);
          return (
            <View key={key} style={[styles.cell, isToday && styles.today]}>
              <Text style={[styles.day, !inMonth && styles.out]}>{date.getDate()}</Text>
              {hasTask ? <View style={styles.dot} /> : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function ScheduleCalendar({ calendar }: { calendar: CalendarData }) {
  const today = parseDay(calendar.today);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const cells = useMemo(() => daysInMonth(cursor.year, cursor.month), [cursor]);

  return (
    <View>
      <View style={styles.toolbar}>
        <Pressable onPress={() => setCursor((c) => shiftMonth(c, -1))}>
          <Text style={styles.nav}>‹</Text>
        </Pressable>
        <Text style={styles.title}>{formatMonthYear(cursor.year, cursor.month)}</Text>
        <Pressable onPress={() => setCursor((c) => shiftMonth(c, 1))}>
          <Text style={styles.nav}>›</Text>
        </Pressable>
        <Pressable onPress={() => setCursor({ year: today.getFullYear(), month: today.getMonth() })}>
          <Text style={styles.todayBtn}>Today</Text>
        </Pressable>
      </View>
      <View style={styles.legend}>
        {calendar.batches.map((batch) => (
          <View key={batch.batch_id} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: batch.accent }]} />
            <Text style={styles.legendText}>{batch.name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.grid}>
        {DOW.map((label) => (
          <Text key={label} style={styles.dow}>
            {label}
          </Text>
        ))}
        {cells.map((date) => {
          const key = ymd(date);
          const inMonth = date.getMonth() === cursor.month;
          const isToday = key === asDateString(calendar.today);
          const stages = calendar.stages.filter((stage) => {
            const start = asDateString(stage.started);
            const end = asDateString(stage.ended) || asDateString(calendar.today);
            return start && key >= start && key <= end;
          });
          const tasks = calendar.tasks.filter((task) => asDateString(task.date) === key);
          return (
            <View key={key} style={[styles.monthCell, isToday && styles.today]}>
              <Text style={[styles.day, !inMonth && styles.out]}>{date.getDate()}</Text>
              {stages.slice(0, 3).map((stage) => (
                <View
                  key={`${stage.batch_id}-${stage.stage}-${stage.started}`}
                  style={[styles.bar, { backgroundColor: stage.accent }]}
                />
              ))}
              {tasks.length > 0 ? <Text style={styles.taskMark}>• {tasks.length}</Text> : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function shiftMonth(cursor: { year: number; month: number }, delta: number) {
  const date = new Date(cursor.year, cursor.month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  nav: {
    color: colors.brass,
    fontSize: 22,
    paddingHorizontal: 4,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    flexGrow: 1,
  },
  todayBtn: {
    color: colors.brass,
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dow: {
    width: "14.28%",
    color: colors.dim,
    fontSize: 11,
    textAlign: "center",
    marginBottom: 6,
  },
  cell: {
    width: "14.28%",
    minHeight: 36,
    alignItems: "center",
    paddingVertical: 4,
  },
  monthCell: {
    width: "14.28%",
    minHeight: 72,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(173, 151, 83, 0.12)",
    gap: 2,
  },
  today: {
    borderColor: colors.brass,
    backgroundColor: "rgba(173, 151, 83, 0.08)",
  },
  day: {
    color: colors.text,
    fontSize: 12,
  },
  out: {
    color: colors.dim,
    opacity: 0.5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.orchard,
    marginTop: 2,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    color: colors.muted,
    fontSize: 12,
  },
  bar: {
    height: 4,
    borderRadius: 2,
  },
  taskMark: {
    color: colors.brass,
    fontSize: 11,
  },
});
