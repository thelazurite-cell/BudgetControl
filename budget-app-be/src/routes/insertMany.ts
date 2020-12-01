import {Route} from "./interfaces/route";
import {MongoManager} from "../mongo-manager";
import {Dto} from "../dto/export/dto-module";
import {StringExtensions} from "../string-extensions";
import {IDataTransferObject} from "../dto/interfaces/data-transfer-object.interface";

class insertMany extends Route {
    constructor() {
        super('put', '/insertMany/:typeName');
    }

    async handler(request, response) {
        await super.handler(request, response);
        this.emitter.on("authenticated", async () => {
            console.log('insertManyCalled');
            if (response.headersSent) return;
            console.log(request.params);
            const typeName = StringExtensions.FirstCharToUpper(request.params["typeName"].toLowerCase());

            var client = new MongoManager();

            let items: IDataTransferObject[] = [];

            if (request.body.length) {
                for (let i = 0; i < request.body.length; i++) {
                    let ins: IDataTransferObject = new Dto[typeName]();
                    Object.assign(ins, request.body[i]);
                    console.log(JSON.stringify(ins));
                    items.push(ins);
                }
            }

            return await client.insertMany(items)
                .then((value) => response.status(200).contentType('application/json').send(JSON.stringify(value)))
                .catch((reason) => response.status(500).contentType('application/json').send(JSON.stringify(reason)));
        });
    }
}

module insertMany {

}
export {insertMany as InsertMany}