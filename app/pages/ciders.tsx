import { BatchTable } from "../../src/components/BatchTable";
import { Screen } from "../../src/components/Screen";
import { Panel } from "../../src/components/ui";
import { batchesByType } from "../../src/lib/data";

export default function CidersPage() {
  return (
    <Screen title="Ciders">
      <Panel>
        <BatchTable batches={batchesByType("cider")} emptyMessage="No cider batches yet." />
      </Panel>
    </Screen>
  );
}
