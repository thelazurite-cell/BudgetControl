import {MongoManager} from "./mongo-manager";
import {Dto} from "./dto/export/dto-module";
import {ServerState} from "./server-state";
import {QueryGroup} from "./dto/filtering/query-group";
import {Query} from "./dto/filtering/query";
import {StringExtensions} from "./string-extensions";
import {IDataTransferObject} from "./dto/interfaces/data-transfer-object.interface";
import {Routes} from "./routes/export/routes-module";
import {NodeApplication} from "./node-application";


export class RouteProvider {
    static async initialize(): Promise<void> {
        new NodeApplication();

        for(let i = 0; i < Routes.All.length; i++){
            await new Routes.All[i]();
        }
    }
}

