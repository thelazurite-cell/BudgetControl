import {Route} from "./interfaces/route";
import {StringExtensions} from "../string-extensions";
import {MongoManager} from "../mongo-manager";
import {Dto} from "../dto/export/dto-module";

class update extends Route {
    constructor() {
        super('post', '/update/:typeName');
    }

    async handler(request, response) {
        await super.handler(request, response);
        this.emitter.on("authenticated", async () => {
            if (response.headersSent) return;
            console.log(request.params);
            const typeName = StringExtensions.FirstCharToUpper(request.params["typeName"].toLowerCase());

            var client = new MongoManager();
            var upd = new Dto[typeName]();
            Object.assign(upd, request.body);
            upd.id = request.body._id;

            // remove any extra keys that the client may have sent us in case they're naughty bois
            const DtoAccepted = new Dto[typeName]();
            for(let key in upd){
                if(upd.hasOwnProperty(key)) {
                    if (!DtoAccepted.hasOwnProperty(key)) {
                        delete upd[key];
                    }
                }
            }

            client.onSuccessful.on("onUpdateSuccessful", (args) => {
                response.status(200).contentType("application/json").send(JSON.stringify(args));
            });
            client.onFailure.on("onUpdateFailure", (args) => {
                console.log(request);
                response.status(500).contentType("application/json").send(JSON.stringify(args));
            });
            await client.update(upd).then((value) => {
            }, reason => {
            });
        });
    }
}

module update {

}
export {update as Update}