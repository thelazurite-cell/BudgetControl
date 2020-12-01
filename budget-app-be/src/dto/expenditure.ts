import {ExpenseDto} from './interfaces/expense-dto';
import {EventEmitter} from "events";

class Expenditure extends ExpenseDto {
    public date: Date = new Date();
    public amountSpent: number = 0;
    public outgoingId: string = '';
    public periodId: string = '';
    public paid: boolean = true;
    public dueDate: Date = new Date();
    public notes: string = '';
}

module Expenditure {

}
export {Expenditure as expenditure}