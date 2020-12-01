export interface IDataTransferObject {
  _id: string;
  isDirty: boolean;
  removable: boolean;
  isDeleted: boolean;
}

export class User implements  IDataTransferObject{
  _id: string = "";
  isDirty: boolean = false;
  username: string = "";
  password: string = "";
  salt: string = "";
  firstName:string ="";
  lastName:string ="";
  email:string ="";
  loginAttempts: number = 0;
  lockedOut: boolean = false;
  removable: boolean;
  isDeleted: boolean;
}
