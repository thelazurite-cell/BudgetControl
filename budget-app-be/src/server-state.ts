import express from "express";
import {Settings} from "./settings";
import {AuthenticationManager} from "./authentication-manager";
import * as fs from "fs";

export class ServerState {
    private static _config: Settings | null = null;

    public static app: express.Application;
    public static auth: AuthenticationManager = new AuthenticationManager();

    constructor() {
    }

    public static get conf(): Settings {
        if (!this._config) {
            ServerState._config = this.initializeSettings();
        }
        if(this._config)
            return <Settings>ServerState._config;
        throw Error("Couldn't read the configuration");
    }

    public static set conf(value: Settings) {
        this._config = value;
    }

    private static initializeSettings(): Settings {
        const res = this.cleanJSON("appConfig.json");
        const parsedJson = JSON.parse(res);
        let set = new Settings();
        Object.assign(set, parsedJson);
        return set;
    }

    private static cleanJSON(filePath: string) {
        let fc = fs.readFileSync(filePath, {encoding: "utf-8"});
        const spl = fc.split('\n');
        const isComment = /^(([ \t])+[\/])+.+/gm;
        let resultant: string[] = [];
        for (let i = 0; i < spl.length; i++) {
            if (!spl[i].match(isComment) && spl[i].trim().length > 0) {
                resultant.push(spl[i]);
            }
        }
        console.log(resultant);
        return resultant.join("\n");
    }
}