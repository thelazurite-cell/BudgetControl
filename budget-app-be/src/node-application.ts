import express from "express";
import * as bodyParser from "body-parser";
import {RouteProvider} from "./route-provider";
import {ServerState} from "./server-state";
import {MongoManager} from "./mongo-manager";
import {Dto} from "./dto/export/dto-module";
import User = Dto.User;

export class NodeApplication {
    public routeProvider: RouteProvider = new RouteProvider();

    constructor() {
        ServerState.app = express();
        this.configure();
    }

    private configure(): void {

        ServerState.app.use(bodyParser.json());
        ServerState.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", ServerState.conf.general.userApplication);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
            next();
        });
        //ServerState.app.use(ServerState.auth.authorize());
        ServerState.app.use(bodyParser.urlencoded({extended: false}));
    }
}