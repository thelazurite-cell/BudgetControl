export interface IDataTransferObject {
  _id: string;
  isDirty: boolean;
  removable: boolean;
  isDeleted: boolean;
  sanitize(): void;
}
