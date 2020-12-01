// noinspection ES6UnusedImports - these statements are actually being used, weird bug
import {category} from '../category';
// noinspection ES6UnusedImports
import {exception} from '../exception';
// noinspection ES6UnusedImports
import {expenditure} from "../expenditure";
// noinspection ES6UnusedImports
import {term,period} from "../financial-term";
// noinspection ES6UnusedImports
import {outgoing} from "../outgoing";
// noinspection ES6UnusedImports
import {user,token,permission,incident} from "../auth/token";

export namespace Dto {
    // noinspection TypeScriptUnresolvedVariable - these statements are resolved.
    export import Category = category;
    // noinspection TypeScriptUnresolvedVariable
    export import Exception = exception;
    // noinspection TypeScriptUnresolvedVariable
    export import Expenditure = expenditure;
    // noinspection TypeScriptUnresolvedVariable
    export import Term = term;
    // noinspection TypeScriptUnresolvedVariable
    export import Outgoing = outgoing;
    // noinspection TypeScriptUnresolvedVariable
    export import User = user;
    // noinspection TypeScriptUnresolvedVariable
    export import Permission = permission;
    // noinspection TypeScriptUnresolvedVariable
    export import Incident = incident;
    // noinspection TypeScriptUnresolvedVariable
    export import Token = token;
    export import Period = period;
}