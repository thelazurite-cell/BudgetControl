import {DataTransferObject} from "./data-transfer-object";

export class ExpenseDto extends DataTransferObject {
  name: string = "";
  cost: number = 0;
  quantity: number = 0;
  categoryId: string = "";
}
