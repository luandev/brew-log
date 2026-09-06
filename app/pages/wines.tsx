import { BatchTable } from "../../src/components/BatchTable";
import { Screen } from "../../src/components/Screen";
import { Panel } from "../../src/components/ui";
import { batchesByType } from "../../src/lib/data";

export default function WinesPage() {
  return (
    <Screen title="Wines">
      <Panel>
        <BatchTable batches={batchesByType("wine")} emptyMessage="No wine batches yet." />
      </Panel>
    </Screen>
  );
}
