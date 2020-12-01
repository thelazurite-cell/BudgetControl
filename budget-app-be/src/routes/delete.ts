import {Route} from "./interfaces/route";
import {StringExtensions} from "../string-extensions";
import {MongoManager} from "../mongo-manager";

class del extends Route {
    constructor() {
        super('delete', '/delete/:typeName/:identifier');
    }

    async handler(request, response) {
        await super.handler(request, response);
        this.emitter.on("authenticated", async () => {
            if (response.headersSent) return;
            const typeName = StringExtensions.FirstCharToUpper(request.params["typeName"].toLowerCase());
            const client = new MongoManager();
            client.onSuccessful.on("onDeleteSuccessful", (args) => {
                response.status(200).contentType("application/json").send(JSON.stringify(args));
            });
            client.onFailure.on("onDeleteFailure", (args) => {
                response.status(500).contentType("application/json").send(JSON.stringify(args));
            });
            await client.delete(typeName, request.params["identifier"]).then((value) => {
            }, reason => {
            });
        });
    }
}

module del {

}
export {del as Delete}