import {IDataTransferObject} from "./data-transfer-object.interface";
import {EventEmitter} from "events";

export class DataTransferObject implements IDataTransferObject {
    _id: string = "";
    validateCallback: EventEmitter = new EventEmitter();
    validationErrors: string[] = [];
    removable: boolean = true;

    async validate(...args: any[]): Promise<void> {
        this.validateCallback.emit("onValidateComplete");
    }

    removeNonPersistItems(): void {
        delete this._id;
        delete this.validateCallback;
        delete this.validationErrors;
    }

}