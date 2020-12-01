import {IDataTransferObject} from './interfaces/data-transfer-object.interface';
import {MongoManager} from "../mongo-manager";
import {QueryGroup} from "./filtering/query-group";
import {Query} from "./filtering/query";
import {FilterTypeEnum} from "./filtering/filter-type.enum";
import {DataTransferObject} from "./interfaces/data-transfer-object";

class Category extends DataTransferObject {
    public name: string = "";
    public color: string = "#000";
    public threshold: number = 0;

    public async validate(): Promise<void> {
        const client = new MongoManager();
        let qg = this.buildNameCheckQuery();
        await this.EnsureNameIsNotUsed(client, qg);
    }

    private async EnsureNameIsNotUsed(client, qg) {
        client.onSuccessful.on("onFindSuccessful", (args) => {
            if (args && args.length && args.length > 0) {
                this.validationErrors.push(`A category with the name '${this.name}' already exists`);
            }
            this.validateCallback.emit("onValidateComplete");
        });
        client.onFailure.on("onFindFailure", (args) => {
            console.log("failed to check if category exists");
            this.validateCallback.emit("onValidateError", args);
        });
        await client.find(this.constructor.name, qg).then((args) => {
        }, reason => {
        });
    }

    private buildNameCheckQuery() {
        let qg = new QueryGroup();
        let q = new Query();
        q.fieldName = "name";
        q.comparisonType = FilterTypeEnum.equals;
        q.fieldValue = this.name;
        qg.queries.push(q);
        return qg;
    }
}

module Category {
}
export {Category as category}