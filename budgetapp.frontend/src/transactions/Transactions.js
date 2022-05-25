import { DataViewManager } from "../core-ui/data-views/DataViewManager";

export default function Transactions() {
  return (
    <div>
      <DataViewManager schemaName="Expenditure" />
    </div>
  );
}
