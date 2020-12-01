import {DeleteWriteOpResultObject, MongoClient, ObjectID} from "mongodb";
import {IDataTransferObject} from "./dto/interfaces/data-transfer-object.interface";
import {EventEmitter} from "events";
import {ServerState} from "./server-state";
import {QueryGroup} from "./dto/filtering/query-group";
import {FilterTypeEnum} from "./dto/filtering/filter-type.enum";
import {IComparableItem} from "./dto/filtering/interfaces/comparable-item.interface";
import {Query} from "./dto/filtering/query";
import {Dto} from "./dto/export/dto-module";

const moment = require("moment");

export class MongoManager {
    private client: MongoClient;
    public currentResult: any = null;
    public onSuccessful: EventEmitter = new EventEmitter();
    public onFailure: EventEmitter = new EventEmitter();

    constructor() {
        this.client = new MongoClient(ServerState.conf.database.host, {useUnifiedTopology: true});
    }

    public async insertMany(items: IDataTransferObject[]): Promise<any> {
        if (items.length < 1) return Promise.resolve();
        const type = items[0].constructor.name;
        return await this.runQueryOn(type, async (col) => {
           for(let i = 0; i < items.length; i++){
               items[i].removeNonPersistItems();
           }
           return await col.insertMany(items,async (err, res) =>{
                if(!err){
                    return Promise.resolve(res);
                }
                return Promise.reject(err);
           })
        });
    }

    /***
     * Inserts an item to the database
     * @param item - the item to insert
     */
    public async insert(item: IDataTransferObject) {
        const type = item.constructor.name;

        item.validateCallback.on("onValidateComplete", async () => {
            console.log(item.validationErrors);
            if (item.validationErrors.length > 0) {
                console.log("there were validation errors");
                this.onFailure.emit('onFailure', [this.errorArg("there were validation errors", item.validationErrors)]);
            } else {
                await this.runQueryOn(type, async (col) => {
                    item.removeNonPersistItems();
                    await col.insertOne(item, async (err, docsInserted) => {
                        if (!err) {
                            console.log("insert successful");
                            this.onSuccessful.emit('onSuccessful', docsInserted);
                        } else {
                            console.log("error inserting item");
                            console.log(err);
                            console.log(JSON.stringify(err));
                            this.onFailure.emit('onFailure', [this.errorArg("couldn't insert item", err)]);

                        }
                    });
                });
            }
        });
        item.validateCallback.on("onValidateError", (err) => {
            console.log("validation exception");

            this.onFailure.emit('onFailure', [this.errorArg("couldn't insert item", err)]);
        });
        item.validate().then(async () => {

        });
    }

    /***
     * Finds all matching items from the database
     * @param typeName - the type of item to find
     * @param parameters - the query used to find the item(s)
     */
    public async find(typeName: string, parameters: QueryGroup = null): Promise<any> {
        try {
            console.log(parameters);
            console.log(`running find on type ${typeName}`);
            let searchQuery = this.getFindQuery(parameters, typeName);
            console.log(searchQuery);
            return await this.runQueryOn(typeName, async (col) => {
                return await col.find(typeof searchQuery == "string" ? JSON.parse(searchQuery) : searchQuery, async (err, docsReturned) => {
                    if (!err) {
                        await docsReturned.toArray().then(async (res) => {
                            console.log(res);

                            let items = [];
                            for (let i = 0; i < res.length; i++) {
                                let dto: IDataTransferObject = new Dto[typeName]();
                                Object.assign(dto, res[i]);
                                items.push(dto);
                            }
                            this.onSuccessful.emit('onFindSuccessful', items);
                            return Promise.resolve(items);
                        }, (err) => {
                            console.log("error reading results");
                            console.log(err);
                            console.log(JSON.stringify(err));
                            this.onFailure.emit('onFindFailure', [this.errorArg("couldn't read results", err)]);
                            return Promise.reject(err);
                        })
                    }
                    else {
                        console.log("error finding item");
                        console.log(err);
                        console.log(JSON.stringify(err));
                        this.onFailure.emit('onFindFailure', [this.errorArg("couldn't find item", err)])
                    }
                });
            });
        } catch (e) {
            this.onFailure.emit("onFindFailure", [this.errorArg("error trying to read from database", e)])
        }
    }

    /***
     * updates an item in the database
     * @param item - the item to update
     */
    public async update(item: IDataTransferObject, manId = null) {
        const type = item.constructor.name;
        const id = manId || item._id || (<any>item).id;

        if (!id || id.trim() == "") {
            this.onFailure.emit("onUpdateFailure", this.errorArg("no identifier provided", item));
            return;
        }
        item.removeNonPersistItems();
        var dtoEntries = Object.entries(item);
        let temp = this.generateUpdateQuery(dtoEntries);
        const updateQuery = `{ "$set": {${temp.join(", ")}} }`;
        console.log(updateQuery);
        try {
            await this.executeUpdateQuery(type, id, updateQuery);
        } catch (e) {
            this.onFailure.emit("onUpdateFailure", this.errorArg("couldn't update", e));
        }
    }

    /***
     * deletes an item in the database
     * @param typeName - the type of item to delete.
     * @param id - the id of the item to delete
     */
    public async delete(typeName: string, id: string) {
        let qg = new QueryGroup();
        qg.comparisonType = FilterTypeEnum.byId;
        let q = new Query();
        q.fieldValue = id;
        qg.queries.push(q);

        this.onSuccessful.on("onFindSuccessful", async (data: Array<IDataTransferObject>) => {
            console.log("attempting deletion of item");
            const item = data[0];
            if (!item.removable) {
                this.onFailure.emit("onDeleteFailure", `deletion of ${typeName}:${id} is not permitted`);
                return;
            }
            await this.runQueryOn(typeName, async (col) => {
                await col.deleteOne({"_id": new ObjectID(id)}).then((value: DeleteWriteOpResultObject) => {
                    if (value.result.ok) {
                        this.onSuccessful.emit("onDeleteSuccessful", value);
                    } else {
                        this.onFailure.emit("onDeleteFailure", value);
                    }
                }, (reason) => {
                    this.onFailure.emit("onDeleteFailure", reason);
                });
            })
        });
        this.onFailure.on("onFindFailure", (reason) => {
            this.onFailure.emit("onDeleteFailure", reason);
        });
        await this.find(typeName, qg).then(() => {
        }, (reason) => {
            this.onFailure.emit("onDeleteFailure", reason);
        });
    }

    /***
     * deletes the parameters used on the server side.
     * @param dto - the item to delete server side parameters from
     */
    private static removeServerSideParameters(dto: IDataTransferObject) {
        delete dto.validateCallback;
        delete dto.validationErrors;
    }

    /***
     * ensure the required parameters exist and match boundary checks
     * @param parameters - the query group.
     */
    private static findHasValidStructure(parameters: QueryGroup) {
        return parameters && parameters.queries && parameters.queries.length > 0;
    }

    /***
     * executes an update on the database
     * @param type - the type to update
     * @param id - the id of the item to update.
     * @param updateQuery - the query to update item
     */
    private async executeUpdateQuery(type, id, updateQuery: string) {
        await this.runQueryOn(type, async (col) => {
            await col.updateOne({"_id": new ObjectID(id)}, JSON.parse(updateQuery)).then((value) => {
                if (value.result.ok) {
                    this.onSuccessful.emit("onUpdateSuccessful", value);
                } else {
                    this.onFailure.emit("onUpdateFailure", value);
                }
            }, (reason) => {
                this.onFailure.emit("onUpdateFailure", reason);
            });
        });
    }

    /***
     * run a query on the database with the specified collection
     * @param collection - the collection to use
     * @param action - the action to undertake
     */
    private async runQueryOn(collection: string, action: (col) => Promise<any>): Promise<void> {
        console.log("running query on: " + ServerState.conf.database.host);
        console.log("attempting to connect...");
        await this.client.connect(async (err, client) => {
            if (!err) {
                console.log("connected successfully");

                const db = client.db(ServerState.conf.database.database);
                const col = db.collection(collection);
                console.log("running client action");
                await action(col).then(async (value) => {
                }, async (reason) => {
                    this.onFailure.emit('onFailure', [{
                        error: "couldn't run query",
                        reason,
                        json: JSON.stringify(reason)
                    }]);
                    console.log("error running query");
                    console.log(reason);
                    console.log(JSON.stringify(reason));
                });
            }
            else {
                console.log("error connecting");
                console.log(JSON.stringify(err));
            }
            return;
        });
    }

    /***
     * generates an update query
     * @param dtoEntries - the fields of a data transfer object.
     */
    private generateUpdateQuery(dtoEntries) {
        let temp = [];
        for (let i = 0; i < dtoEntries.length; i++) {
            let isStringParam = typeof dtoEntries[i][1] == "string";
            temp.push(`"${dtoEntries[i][0]}": ${isStringParam ? '"' + dtoEntries[i][1] + '"' : dtoEntries[i][1]}`)
        }
        return temp;
    }

    /***
     * generates an error response.
     * @param message
     * @param err
     */
    private errorArg(message, err) {
        return {error: message, reason: err, json: JSON.stringify(err)};
    }

    /***
     * gets a query for finding items in the database
     * @param parameters - the query items from a request
     * @param typeName - the collection type name
     */
    private getFindQuery(parameters: QueryGroup, typeName: string) {
        let searchQuery: any;
        if (MongoManager.findHasValidStructure(parameters)) {
            console.log("parsing find parameters");
            let str = "";
            const res = this.generateQuery(new Dto[typeName](), parameters, str);
            console.log(typeof res);
            if (typeof res == "string") {
                str += res;
                searchQuery = str
            }
            else {
                searchQuery = res;
            }
        } else {
            searchQuery = "{}";
        }
        return searchQuery;
    }

    /***
     * generate valid json.
     * @param type
     * @param comparable
     * @param str
     */
    private generateQuery(type: IDataTransferObject, comparable: IComparableItem, str: string) {
        console.log(comparable.constructor.name);
        if (comparable.constructor.name == QueryGroup.name) {

            console.log("I found a query group");
            const parameters = <QueryGroup>comparable;
            if (parameters.comparisonType == FilterTypeEnum.byId) {
                if (!parameters.queries || parameters.queries.length != 1) {
                    this.onFailure.emit('onFindFailure', [this.errorArg("You need one parameter to find by id", parameters)]);
                } else {
                    return {"_id": new ObjectID((<Query>parameters.queries[0]).fieldValue)}
                }
            }
            else if ((parameters.comparisonType == FilterTypeEnum.and || parameters.comparisonType == FilterTypeEnum.or)) {
                if (!parameters.queries || parameters.queries.length != 2) {
                    this.onFailure.emit('onFindFailure', [this.errorArg("You need two parameters for and/or statements. ", parameters)]);
                } else {
                    str += `"${parameters.comparisonType}": [`;
                    for (let i = 0; i < parameters.queries.length; i++) {
                        str += this.generateQuery(type, parameters.queries[i], str);
                        if (i + 1 != parameters.queries.length) str += ","
                    }
                    str += "]";
                }
            } else {
                for (let i = 0; i < parameters.queries.length; i++) {
                    str += this.generateQuery(type, parameters.queries[i], str);
                    if (i + 1 != parameters.queries.length) str += ","
                }
            }
        } else if (comparable.constructor.name == Query.name) {
            console.log("I found a query");
            const parameters = <Query>comparable;
            let isStringParam = typeof type[parameters.fieldName] == "string";

            str += `{"${parameters.fieldName}": {"${parameters.comparisonType}":  ${isStringParam ? '"' + encodeURI(parameters.fieldValue) + '"' : parameters.fieldValue}}}`;
        }
        return str;
    }

    public async closeConnection() {
        await this.client.close().then(() => console.log("connection closed"));
    }
}