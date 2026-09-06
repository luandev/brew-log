import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ActiveBrewCard } from "../src/components/ActiveBrewCard";
import { MiniCalendar } from "../src/components/Calendars";
import { LatestNotes } from "../src/components/LatestNotes";
import { NextTasks } from "../src/components/NextTasks";
import { PastBatchesTable } from "../src/components/PastBatchesTable";
import { Screen } from "../src/components/Screen";
import { Panel, SectionTitle } from "../src/components/ui";
import { activeBatches, calendar, latestNotes, pastBatches, schedule } from "../src/lib/data";
import { colors } from "../src/theme";

export default function Home() {
  const active = activeBatches();

  return (
    <Screen hero>
      <View style={styles.grid}>
        <View style={styles.main}>
          <Panel testID="active-brews">
            <SectionTitle
              title="Active Brews"
              icon="active-brews"
              action={
                <Link href="/pages/active" asChild>
                  <Pressable>
                    <Text style={styles.link}>View all</Text>
                  </Pressable>
                </Link>
              }
            />
            <View style={styles.stack}>
              {active.length > 0 ? (
                active.map((batch) => <ActiveBrewCard key={batch.batch_id} batch={batch} />)
              ) : (
                <Text style={styles.empty}>No active batches.</Text>
              )}
            </View>
          </Panel>
          <Panel>
            <SectionTitle title="Latest Notes" icon="notes" />
            <LatestNotes notes={latestNotes()} />
          </Panel>
          <Panel>
            <SectionTitle title="Past Batches" icon="past-batches" />
            <PastBatchesTable batches={pastBatches()} />
          </Panel>
        </View>
        <View style={styles.sidebar}>
          <Panel>
            <SectionTitle title="Calendar" icon="calendar" />
            <MiniCalendar calendar={calendar} />
          </Panel>
          <Panel>
            <SectionTitle
              title="Next Tasks"
              icon="schedule"
              action={
                <Link href="/pages/schedule" asChild>
                  <Pressable>
                    <Text style={styles.link}>View full schedule ›</Text>
                  </Pressable>
                </Link>
              }
            />
            <NextTasks tasks={schedule} />
          </Panel>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  main: {
    flexGrow: 2,
    flexBasis: 420,
    gap: 16,
  },
  sidebar: {
    flexGrow: 1,
    flexBasis: 280,
    gap: 16,
  },
  stack: {
    gap: 10,
  },
  link: {
    color: colors.brass,
    fontSize: 14,
  },
  empty: {
    color: colors.dim,
  },
});
