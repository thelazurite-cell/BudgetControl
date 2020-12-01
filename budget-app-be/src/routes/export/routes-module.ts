import {Status} from "../status";
import {Find} from "../find";
import {Delete} from "../delete";
import {Insert} from "../insert";
import {Update} from "../update";
import {Authenticate} from "../auth/authenticate";
import {InsertMany} from "../insertMany";

export namespace Routes {
    export const All = [Authenticate, Status, Find, Insert, InsertMany, Update, Delete];
}