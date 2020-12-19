import {Route} from "../interfaces/route";
import {ServerState} from "../../server-state";
import {Utf8Encoding} from "../../authentication-manager";
import {MongoManager} from "../../mongo-manager";
import {QueryGroup} from "../../dto/filtering/query-group";
import {Query} from "../../dto/filtering/query";
import {FilterTypeEnum} from "../../dto/filtering/filter-type.enum";
import {incident, IncidentLevel, IncidentType, token, user} from "../../dto/auth/token";
import {IDataTransferObject} from "../../dto/interfaces/data-transfer-object.interface";
const moment = require("moment");
const btoa = require("btoa");
const atob = require("atob");

class auth extends Route {
    constructor() {
        super('post', '/auth/login', false);
    }

    async handler(request, response) {
        await super.handler(request, response);
        if (response.headersSent) return;
        let body = await request.body;
        if (body.attempt) {
            const decoded: string[] = atob(body.attempt).toString().split(":");
            console.log(decoded);
            if (!decoded.length || (decoded.length && decoded.length < 2)) {
                response.status(400).contentType("application/json").send(JSON.stringify({
                    successful: false,
                    reason: "Provide a username and password"
                }));
                return;
            } else {
                const db = new MongoManager();
                const query = this.buildFindUserQuery(decoded);
                db.onSuccessful.on("onFindSuccessful", async (data) => {
                    let auth = ServerState.auth.model;
                    if (data && data.length > 0) {
                        const user = <user>data[0];
                        const id = <IDataTransferObject>data[0]._id.toString();
                        for (let i = 0;i < 1000; i++)
                        console.log(id);
                        if (user.lockedOut) {
                            const failure = new incident();
                            failure.incidentLevel = IncidentLevel.high;
                            failure.incidentType = IncidentType.lockOut;
                            failure.remoteAddress = request.connection.remoteAddress;
                            failure.parameters = [];
                            failure.userId = user._id;
                            db.onSuccessful.on("onSuccessful", async (data)=>{
                                await db.closeConnection();
                            });
                            db.onFailure.on("onFailure", async (reason)=>{
                                await db.closeConnection();
                            });
                            await db.insert(failure);
                            this.invalid(response, "You are locked out");
                        } else {
                            auth.eventCompleted.on("generateHash", async (value) => {
                                const correct = auth.getTimeSafeDifference(Utf8Encoding.getBytes(value), Utf8Encoding.getBytes(user.password));
                                console.log(correct);
                                if (correct) {
                                    user.loginAttempts = 0;
                                    const success = new incident();
                                    success.incidentLevel = IncidentLevel.low;
                                    success.incidentType = IncidentType.login;
                                    success.remoteAddress = request.connection.remoteAddress;
                                    success.parameters = [];
                                    success.userId = user._id;
                                    await db.insert(success);

                                    const tkn = new token();
                                    tkn.accessToken = auth.getEncryptedValue(255);
                                    tkn.accessTokenExpiresAt = moment().add(ServerState.conf.general.tokenExpiryMinutes, "minutes");
                                    tkn.userId = user._id;

                                    await db.insert(tkn);

                                    response.status(200).header({"Access-Control-Allow-Origin":ServerState.conf.general.userApplication}).contentType("application/json").send(JSON.stringify({success:true, result: btoa(JSON.stringify(tkn))}));
                                } else {
                                    const failure = new incident();
                                    failure.incidentLevel = IncidentLevel.high;
                                    failure.incidentType = IncidentType.invalidCredentials;
                                    failure.remoteAddress = request.connection.remoteAddress;
                                    failure.parameters = [body];
                                    failure.userId = user._id;

                                    await db.insert(failure);

                                    user.loginAttempts++;
                                    if(user.loginAttempts === ServerState.conf.general.maxGuesses)
                                    {
                                        user.lockedOut = true;
                                        this.invalid(response, "You have been locked out.")
                                    }else {
                                        this.invalid(response);
                                    }
                                }
                                const dbu = new MongoManager();
                                dbu.onSuccessful.on("onUpdateSuccessful", async (data)=>{
                                    await db.closeConnection();
                                    await dbu.closeConnection();
                                });
                                dbu.onFailure.on("onUpdateFailure", async (reason)=>{
                                    console.log(reason);
                                    await db.closeConnection();
                                    await dbu.closeConnection();
                                });
                                await dbu.update(user, id).then(()=> {

                                }, (reason)=>{
                                    console.log(reason);
                                });
                                return;
                            });
                            await auth.generateHash(decoded[1], user.salt).then(() => {

                            })
                        }
                    } else {
                        const failure = new incident();
                        failure.incidentLevel = IncidentLevel.high;
                        failure.incidentType = IncidentType.invalidCredentials;
                        failure.remoteAddress = request.connection.remoteAddress;
                        failure.parameters = [body];
                        await db.insert(failure);
                        this.invalid(response);
                        return;
                    }
                });
                db.onFailure.on("onFindFailure", reason => {
                    this.invalid(response);
                    return;
                });
                await db.find("User", query).then(async (result) => {
                }, reason => {
                    this.invalid(response);
                    return;
                });
            }
        } else {
            response.status(400).contentType("application/json").send(JSON.stringify({
                successful: false,
                reason: "Provide an authentication attempt"
            }))
        }
    }

    private invalid(response, message = "Invalid username or password") {
        response.status(400).contentType("application/json").send(JSON.stringify({
            successful: false,
            reason: message
        }));
    }

    private buildFindUserQuery(decoded: string[]) {
        var qg = new QueryGroup();
        var q = new Query();
        q.fieldName = "username";
        q.comparisonType = FilterTypeEnum.equals;
        q.fieldValue = decoded[0];
        qg.queries.push(q);
        return qg;
    }
}

module auth {

}
export {auth as Authenticate}