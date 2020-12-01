import {Dto} from "./dto/export/dto-module";
import {ServerState} from "./server-state";
import {RouteProvider} from "./route-provider";
import {NodeApplication} from "./node-application";
import {MongoManager} from "./mongo-manager";
import User = Dto.User;
import {IDataTransferObject} from "./dto/interfaces/data-transfer-object.interface";
import {Utf8Encoding} from "./authentication-manager";

const nodePort = 31373;
let encVal = "";
RouteProvider.initialize().then(() => {
    ServerState.app.listen(nodePort, '0.0.0.0', async () => {
        console.log("Node application listening on port: " + nodePort);
        console.log(Dto);
        console.log(ServerState.conf);
        let db = new MongoManager();
        db.onSuccessful.on("onFindSuccessful", async (result) => {
            if (result && result.length === 0) {
                await createAdminastrativeUser(db).then().catch(async (reason) => {
                    console.log(reason);
                    await db.closeConnection();
                    process.exit(-1);
                });
            }
        });

        await db.find(Dto["User"].name).then(async (result) => {

        });
    });
}, (reason) => {
    console.log("Couldn't initialize routes");
    console.log(reason);
});

async function createAdminastrativeUser(db) {
    var administrativeUser = new User();
    administrativeUser.username = "administrator";
    administrativeUser.firstName = "administrative";
    administrativeUser.lastName = "user";
    let auth = ServerState.auth.model;
    administrativeUser.salt = auth.generateSalt();
    encVal = "foobar";

    auth.eventCompleted.on("generateHash", async (res) => {
        administrativeUser.password = res;
        administrativeUser.email = ServerState.conf.general.adminEmail;
        console.log(administrativeUser);
        db.onSuccessful.on('onSuccessful', (data) => {
            console.log("CREATED administrator USER WITH PASSWORD OF" + encVal + " KEEP THIS INFORMATION SOMEWHERE SECURE");
            console.log("THIS MESSAGE WILL ONLY SHOW UP FOR THIS RUN");
            return Promise.resolve();
        });
        db.onFailure.on('onFailure', (reason) => {
            return Promise.reject(reason);
        });
        await db.insert(<IDataTransferObject>administrativeUser).then(() => {
            console.log("done");
        });
    });
    await auth.generateHash(encVal, administrativeUser.salt);
}

