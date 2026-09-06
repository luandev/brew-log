import { ScheduleCalendar } from "../../src/components/Calendars";
import { NextTasks } from "../../src/components/NextTasks";
import { Screen } from "../../src/components/Screen";
import { Panel, SectionTitle } from "../../src/components/ui";
import { calendar, schedule } from "../../src/lib/data";

export default function SchedulePage() {
  return (
    <Screen
      testID="schedule-page"
      title="Schedule"
      intro="Stage timelines with start/end dates, plus upcoming actions."
    >
      <Panel>
        <ScheduleCalendar calendar={calendar} />
      </Panel>
      <Panel>
        <SectionTitle title="Upcoming Actions" icon="upcoming" />
        <NextTasks tasks={schedule} />
      </Panel>
    </Screen>
  );
}
