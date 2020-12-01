import {EventEmitter} from "events";
import {DataTransferObject} from "./interfaces/data-transfer-object";

class Term extends DataTransferObject {
    public name: string = '';
    public startDay: number = 0;
    public endDay: number = 0;
    public startFrom: Date = new Date();
    public expiryDate: Date | null = null;
    public baseIncome: number = 0;
}

module Term {
}
export {Term as term}

class Period extends DataTransferObject {
    public name: string = "";
    public termId: string = "";
    public startsFrom: Date = new Date();
    public endsOn: Date = new Date();
    public income: number = 0;
    public discrepancyReason: string = "";
}

module Period {

}
export {Period as period}