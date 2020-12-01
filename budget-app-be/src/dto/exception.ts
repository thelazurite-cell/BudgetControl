import {IDataTransferObject, NoPersist} from './interfaces/data-transfer-object.interface';
import {EventEmitter} from "events";
import {DataTransferObject} from "./interfaces/data-transfer-object";

class Exception extends DataTransferObject {
    public outgoingId: string = "";
    public costModifier: boolean = true;
    public startFrom: Date = new Date();
    public expiryDate: Date | null = null;
    public costAmount: number = 0;
    public reason: string = "";
}

module Exception {
}
export {Exception as exception}