import { IDataTransferObject } from "./data-transfer-object.interface";


export class User implements IDataTransferObject {
  sanitize(): void {
    this.loginAttempts = +this.loginAttempts;  
  }

  _id: string = "";
  isDirty: boolean = false;
  username: string = "";
  password: string = "";
  salt: string = "";
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  loginAttempts: number = 0;
  lockedOut: boolean = false;
  removable: boolean;
  isDeleted: boolean;
}
