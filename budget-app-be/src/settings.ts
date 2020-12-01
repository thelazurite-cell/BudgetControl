import {MongoSettings} from "./mongo-settings";

export class GeneralSettings {
    public userApplication: string = "";
    public adminEmail: string = "";
    public maxGuesses: number = 3;
    public tokenExpiryMinutes: number = 60;
}

export class Settings {
    public database: MongoSettings = new MongoSettings();
    public general: GeneralSettings = new GeneralSettings();
}