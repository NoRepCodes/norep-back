"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const versionChecker = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const auth = new googleapis_1.google.auth.GoogleAuth({
        // keyFile: "./src/helpers/norep-app.json", // Ruta a tu archivo JSON de la clave
        credentials: (_a = JSON.parse(process.env.GOOGLE_APIS_CREDENTIALS_JSON)) !== null && _a !== void 0 ? _a : undefined,
        scopes: ["https://www.googleapis.com/auth/androidpublisher"],
    });
    const androidpublisher = googleapis_1.google.androidpublisher({ version: "v3", auth });
    const editResponse = yield androidpublisher.edits.insert({
        packageName: 'norep.app',
    });
    const editId = editResponse.data.id;
    // interal o production
    const trackEnv = 'internal';
    // 3. Obtén la información de la pista de producción
    const trackResponse = yield androidpublisher.edits.tracks.get({
        packageName: 'norep.app',
        editId: editId,
        track: trackEnv
        // track: 'production',
    });
    // console.log(trackResponse.data.releases);
    const releases = trackResponse.data.releases;
    // console.log(track);
    if (releases && releases.length > 0) {
        //3.1 Name version here
        // 4. Extrae el código de la versión
        const lastRelease = releases[releases.length - 1];
        // 4.1 Version Name (x.y.z)
        return lastRelease.name;
        // // 4.2 Version Code (num)
        // const versionCodes = lastRelease.versionCodes;
        // // La versión es el último código en la lista
        // const ver = versionCodes[versionCodes.length - 1];
        // // console.log(`La versión de ${trackEnv} de la aplicación es: ${ver}`);
        // return ver
    }
    else {
        // console.log('No hay lanzamientos en la pista de producción.');
        return null;
    }
});
exports.default = versionChecker;
//# sourceMappingURL=versionChecker.js.map