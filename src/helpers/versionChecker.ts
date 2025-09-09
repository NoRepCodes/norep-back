import { google } from "googleapis";

const versionChecker = async ():Promise<string>|null =>{
  const auth = new google.auth.GoogleAuth({
    // keyFile: "./src/helpers/norep-app.json", // Ruta a tu archivo JSON de la clave
    credentials:JSON.parse(process.env.GOOGLE_APIS_CREDENTIALS_JSON)??undefined,
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  });
  const androidpublisher = google.androidpublisher({ version: "v3", auth })

  const editResponse = await androidpublisher.edits.insert({
      packageName: 'norep.app',
    });
    const editId = editResponse.data.id;

    // interal o production
    const trackEnv = 'internal'

    // 3. Obtén la información de la pista de producción
    const trackResponse = await androidpublisher.edits.tracks.get({
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
      return lastRelease.name

      // // 4.2 Version Code (num)
      // const versionCodes = lastRelease.versionCodes;
      
      // // La versión es el último código en la lista
      // const ver = versionCodes[versionCodes.length - 1];
      // // console.log(`La versión de ${trackEnv} de la aplicación es: ${ver}`);
      // return ver
    } else {
      // console.log('No hay lanzamientos en la pista de producción.');
      return null;
    }
}

export default versionChecker