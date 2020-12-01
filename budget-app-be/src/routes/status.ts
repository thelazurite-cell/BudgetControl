import {Route} from "./interfaces/route";
import {ServerState} from "../server-state";

class status extends Route{
    constructor(){
        super("get", "/", false);
    }

    async handler(request, response) {
        await super.handler(request, response);
        if (response.headersSent) return;
        response.status(200).contentType("application/json")
            .send(JSON.stringify({status: "ok"}));
    }
}
module status {

}
export {status as Status}