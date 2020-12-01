import {DataTransferObject} from "../interfaces/data-transfer-object";
import {Moment} from "moment";
export enum IncidentLevel{
    critical = "critical",
    error = "error",
    high = "high",
    warning = "warning",
    debug = "debug",
    low = "low",
    none = "none"
}
export enum IncidentType{
    unknown = "unknown",
    invalidCredentials = "invalid credentials",
    expiredToken = "expired token",
    invalidToken = "invalid token",
    login = "user logged in",
    lockOut = "user locked out"
}
class Incident extends DataTransferObject{
    public userId: string = "unknown";
    public remoteAddress: string = "";
    public incidentType: IncidentType = IncidentType.unknown;
    public incidentLevel: IncidentLevel = IncidentLevel.none;
    public parameters: string[] = [];
}
module Incident {

}
export {Incident as incident}

class Permission extends DataTransferObject{
    public userId: string = "";
    public permissionName: string = "";
    public allow: boolean = false;
}
module Permission {

}
export {Permission as permission}

class Token extends DataTransferObject {
    accessToken: string;
    accessTokenExpiresAt: any;
    userId: string;
}

module Token {

}
export {Token as token}

class User extends  DataTransferObject{
    _id: string = "";
    username: string = "";
    password: string = "";
    salt: string = "";
    firstName:string ="";
    lastName:string ="";
    email:string ="";
    loginAttempts: number = 0;
    lockedOut: boolean = false;
}

module User {

}
export {User as user}


