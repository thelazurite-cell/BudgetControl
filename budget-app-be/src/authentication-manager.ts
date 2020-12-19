import crypto from "crypto";
import {EventEmitter} from "events";
const atob = require("atob");
const btoa = require("btoa");
export class AuthenticationManager {
    public model: AuthorizationModel = new AuthorizationModel();

    constructor() {

    }
}

export class Utf8Encoding {
    public static getBytes(source: string): number[] {
        console.log(source);
        source = atob(source);
        let utf8: number[] = [];
        for (let i = 0; i < source.length; i++) {
            let code: number = source.charCodeAt(i);
            if (code < 0x80) utf8.push(code);
            else if (code < 0x800) {
                utf8.push(0xc0 | (code >> 6),
                    0x80 | (code & 0x3f));
            }
            else if (code < 0xd800 || code >= 0xe000) {
                utf8.push(0xe0 | (code >> 12),
                    0x80 | ((code >> 6) & 0x3f),
                    0x80 | (code & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                code = 0x10000 + (((code & 0x3ff) << 10)
                    | (source.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (code >> 18),
                    0x80 | ((code >> 12) & 0x3f),
                    0x80 | ((code >> 6) & 0x3f),
                    0x80 | (code & 0x3f));
            }
        }
        return utf8;

    }
}

export class AuthorizationModel {
    private msl: number = 24;
    private mi: number = 100000;
    private mhl: number = 256;
    private dg: string = "sha256";
    public eventCompleted: EventEmitter = new EventEmitter();
    private passwordCriteria: RegExp = /(?=(.*[A-z]{2,}))(?=(.*?[^ \w]{2,}))(?=(.*?\d){2,})+^(.){12,}$/;

    matchesPasswordCriteria(password:string): boolean {
        return this.passwordCriteria.test(password);
    }

    generateSalt(): string {
        return this.getEncryptedValue(this.msl);
    }

    public getEncryptedValue(len: number) {
        return crypto.randomBytes(Math.ceil(len >> 1))
            .toString('hex', 0, len);
    }

    getTimeSafeDifference(sourceA: number[], sourceB: number[]) {
        let diff: number = sourceA.length ^ sourceB.length;
        for (let i: number = 0; i < sourceA.length && i < sourceB.length; i++) {
            diff |= sourceA[i] ^ sourceB[i];
        }
        console.log(diff);
        return diff === 0;
    }

    async generateHash(password: string, salt: string): Promise<void> {
        await crypto.pbkdf2(password, salt, this.mi, this.mhl, this.dg, (err: Error | null, derivedKey: Buffer) => {
            if (!err) {
                this.eventCompleted.emit("generateHash", derivedKey.toString('base64'));
                return;
            }
            let ex = new Error("An unexpected error occurred hashing the password");
            ex.stack = err.stack;
            throw ex;
        });
    }

    generateAccessToken(): string {
        return this.getEncryptedValue(255);
    }
}