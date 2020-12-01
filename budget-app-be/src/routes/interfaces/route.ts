import {IRoute} from "./route.interface";
import {ServerState} from "../../server-state";
import {incident, IncidentLevel, IncidentType, token} from "../../dto/auth/token";
import {MongoManager} from "../../mongo-manager";
import {EventEmitter} from "events";

const moment = require("moment");
const atob = require("atob");

export abstract class Route implements IRoute {
    private readonly _requestType: string;
    private readonly _prefix: string;
    private readonly _needsAuth: boolean;
    protected emitter: EventEmitter = new EventEmitter();

    protected constructor(requestType: string, prefix: string, needsAuth: boolean = true) {
        this._requestType = requestType;
        this._prefix = prefix;
        this._needsAuth = needsAuth;
        this.Initialize();
    }

    async handler(request, response) {
        if (this._needsAuth) {
            if (Route.doesNotHaveValidFormat(request)) {
                Route.unauthorised(response);
                return;
            } else {
                let db = new MongoManager();
                // noinspection JSPotentiallyInvalidConstructorUsage
                const tkn: token = new token();
                try {
                    let authorization: string = request.headers.authorization;
                    authorization = atob(authorization.slice(7, authorization.length));
                    Object.assign(tkn, JSON.parse(authorization));
                } catch {
                    // noinspection JSPotentiallyInvalidConstructorUsage
                    await this.invalidToken(new token(), request, db, response);
                    return;
                }
                let expiry = moment(tkn.accessTokenExpiresAt);
                if (expiry < moment()) {
                    // noinspection JSPotentiallyInvalidConstructorUsage
                    let failure = new incident();
                    failure.userId = tkn.userId.toString() || "";
                    failure.parameters = [JSON.stringify(tkn)];
                    failure.remoteAddress = request.connection.remoteAddress;
                    failure.incidentType = IncidentType.expiredToken;
                    failure.incidentLevel = IncidentLevel.low;
                    await db.insert(failure);
                    Route.unauthorised(response, "Token expired, you must authenticate again");
                    return;
                }

                db.onSuccessful.on("onFindSuccessful", async (data) => {
                    console.log(tkn.accessTokenExpiresAt);
                    if (data && data.filter(itm => {
                        let expiry = moment();
                        Object.assign(expiry,  itm.accessTokenExpiresAt);
                        let currExpiry = expiry.toISOString();
                        return itm.userId == tkn.userId && itm.accessToken == tkn.accessToken && currExpiry == tkn.accessTokenExpiresAt
                    }).length > 0)
                        this.emitter.emit("authenticated");
                    else {
                        await this.invalidToken(tkn, request, db, response);
                    }
                });
                db.onFailure.on("onFindFailure", async () => {
                    await db.closeConnection();
                    Route.unauthorised(response);
                });
                await db.find("Token").catch(async () => {
                    await db.closeConnection();
                    Route.unauthorised(response);
                });
            }
        }
    };

    private async invalidToken(tkn: token, request, db, response) {
        // noinspection JSPotentiallyInvalidConstructorUsage
        const failure = new incident();
        failure.userId = (tkn.userId) ? tkn.userId.toString() : "" || "";
        failure.parameters = [JSON.stringify(tkn)];
        failure.remoteAddress = request.connection.remoteAddress;
        failure.incidentType = IncidentType.expiredToken;
        failure.incidentLevel = IncidentLevel.low;
        await db.insert(failure).then(async () => await db.closeConnection(), async () => await db.closeConnection());
        Route.unauthorised(response, "Invalid Token, you must authenticate again");
    }

    private static doesNotHaveValidFormat(request) {
        let headers = request.headers;
        let authorization = headers.authorization;
        let s = (headers.authorization) ? headers.authorization.toLowerCase() : "" || "";
        return !headers
            || (headers && !authorization)
            || (s.replace("bearer ", "").length === 0
                || (!s.startsWith("bearer")));
    }

    private static unauthorised(response, message = "you must authenticate") {
        response.status(401).contentType("application/json").send(JSON.stringify({
            successful: false,
            reason: message
        }));
    }

    public Initialize() {
        ServerState.app.route(this._prefix)[this._requestType]((request, response) => this.handler(request, response));
        console.log(`Enabled ${this._requestType} requests to ${this._prefix}`);
    }
}