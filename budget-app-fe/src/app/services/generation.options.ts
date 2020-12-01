import {TableHeader} from './table.header';
import {CustomAction} from './table';

export class GenerationOptions {
  public hideColumns: Array<string> = ['_id', 'validateCallback', 'validationErrors', 'isDirty', 'isDeleted', 'removable', 'id'];
  public headingOverride: Array<TableHeader> = [];
  public sumFields: Array<string> = [];
  public readOnly: boolean = false;
  public customActions: CustomAction[] = [];
  public hasPagination: boolean = true;
  public pageSizes: number[] = [5, 10, 15, 20, 50, 100];
  constructor(sumFields = [], customActions = [], hideColumns = [], headingOverride = []) {
    this.sumFields = sumFields;
    this.customActions = customActions;
    this.headingOverride = headingOverride;
    this.hideColumns.push(...hideColumns);
  }
}
