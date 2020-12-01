import {Route} from "./interfaces/route";
import {MongoManager} from "../mongo-manager";
import {Dto} from "../dto/export/dto-module";
import {StringExtensions} from "../string-extensions";
import {IDataTransferObject} from "../dto/interfaces/data-transfer-object.interface";

class insert extends Route {
    constructor() {
        super('put', '/insert/:typeName');
    }

    async handler(request, response) {
        await super.handler(request, response);
        this.emitter.on("authenticated", async () => {
            console.log('insertCalled');
            if (response.headersSent) return;
            console.log(request.params);
            const typeName = StringExtensions.FirstCharToUpper(request.params["typeName"].toLowerCase());

            var client = new MongoManager();
            var ins: IDataTransferObject = new Dto[typeName]();
            Object.assign(ins, request.body);

            // // remove any extra keys that the client may have sent us in case they're naughty bois
            // const DtoAccepted = new Dto[typeName]();
            // for(let key in ins){
            //     if(ins.hasOwnProperty(key)) {
            //         if (!DtoAccepted.hasOwnProperty(key)) {
            //             delete ins[key];
            //         }
            //     }
            // }

            client.onSuccessful.on("onSuccessful", (args) => {
                response.status(200).contentType("application/json").send(JSON.stringify(args));
            });
            client.onFailure.on("onFailure", (args) => {
                response.status(500).contentType("application/json").send(JSON.stringify(args));
            });
            await client.insert(ins).then((value) => {
            }, reason => {
            });
        });
    }
}

module insert {

}
export {insert as Insert}