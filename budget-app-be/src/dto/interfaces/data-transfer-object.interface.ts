import {EventEmitter} from "events";

export interface IDataTransferObject {
    _id: string;
    removable: boolean;
    validationErrors: string[];
    validateCallback: EventEmitter;

    validate(...args: any[]): Promise<void>;

    removeNonPersistItems(): void;
}

export function NoPersist() {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log(target);
    }
}