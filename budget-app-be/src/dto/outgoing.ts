import {ExpenseDto} from './interfaces/expense-dto';
import {EventEmitter} from "events";

class Outgoing extends ExpenseDto {
    public categoryId: string = "";
    public cost: number = 0;
    public _id: string = "";
    public name: string = "";
    public quantity: number = 0;
    public payOnDay: number = 0;
}
module Outgoing{

}
export {Outgoing as outgoing}