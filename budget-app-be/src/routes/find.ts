import {Route} from "./interfaces/route";
import {StringExtensions} from "../string-extensions";
import {QueryGroup} from "../dto/filtering/query-group";
import {MongoManager} from "../mongo-manager";
import {IDataTransferObject} from "../dto/interfaces/data-transfer-object.interface";
import {Query} from "../dto/filtering/query";

class find extends Route {
    constructor() {
        super('post', '/find/:typeName');
    }

    public async handler(request, response) {
        await super.handler(request, response);
        this.emitter.on("authenticated", async () => {
            if (response.headersSent) return;
            const typeName = StringExtensions.FirstCharToUpper(request.params["typeName"].toLowerCase());
            console.log(request.params);
            console.log(request.body);

            let res: QueryGroup = null;

            try {
                res = this.toQueryTypes(request);
                console.log(res);
            } catch (e) {
                console.log("Couldn't initialize find parameters");
                console.log(e);
            }

            await this.executeQuery(response, typeName, res).catch(reason => {
                response.status(500).contentType("application/json").send(JSON.stringify(reason));
            });
        });
    }

    private async executeQuery(response, typeName, res: QueryGroup) {
        const client = new MongoManager();
        client.onSuccessful.on("onFindSuccessful", (args: Array<IDataTransferObject>) => {
            response.status(200).contentType("application/json").send(JSON.stringify(args));
        });
        client.onFailure.on("onFindFailure", (args) => {
            response.status(500).contentType("application/json").send(JSON.stringify(args));
        });
        await client.find(typeName, res).then((value) => {
        }, reason => {
        });
    }

    private toQueryTypes(request) {
        let res = new QueryGroup();
        Object.assign(res, request.body);
        this.assignQueryTypes(res);
        return res;
    }

    private assignQueryTypes(res) {
        for (let i = 0; i < res.queries.length; i++) {
            var itm = res.queries[i];
            if (itm["queries"] != undefined) {
                let qg = new QueryGroup();
                Object.assign(qg, itm);
                res.queries[i] = qg;
                this.assignQueryTypes(res.queries[i]);
            } else {
                let q = new Query();
                Object.assign(q, itm);
                res.queries[i] = q;
            }
        }
    }
}

module find {

}
export {find as Find}