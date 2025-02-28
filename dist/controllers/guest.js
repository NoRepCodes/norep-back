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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsWithInfo = exports.changePassword = exports.getEmailExist = exports.getEventTable = exports.getLatestEvent = exports.cleanDupl = exports.searchTeam = exports.toggleUpdating = exports.getWods = exports.getEventsPlusTeams = exports.getEvents = exports.registerUser = exports.login = exports.version = exports.test = exports.uri = void 0;
const eventSchema_1 = __importDefault(require("../models/eventSchema"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const t_1 = __importDefault(require("../models/t"));
const dotenv_1 = __importDefault(require("dotenv"));
const wodSchema_1 = __importDefault(require("../models/wodSchema"));
//@ts-ignore
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminSchema_1 = __importDefault(require("../models/adminSchema"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const debug = false;
const uri = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#test");
    // try {
    //uqaxzwlvmbcwnpqi
    // let transporter = nodemailer.createTransport({
    //   service: "yahoo",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: "norep.code@yahoo.com",
    //     pass: "uqaxzwlvmbcwnpqi",
    //   },
    // });
    //   const sendPromises = users.map((user) => {
    //     let mailOptions = {
    //       from: "norep.code@yahoo.com",
    //       to: user.email,
    //       subject: `Haz sido admitido en el evento CHAMPIONSHIP REGIONAL FITGAMES!`,
    //       html: emailMsg(
    //         user.name,
    //         "CHAMPIONSHIP REGIONAL FITGAMES",
    //         user.category,
    //         "678f0ae60a3e3d5d3ef56586"
    //       ),
    //     };
    //     return transporter.sendMail(mailOptions);
    //   });
    //   const results = await Promise.all(sendPromises);
    //   res.send(results);
    // } catch (error) {
    //   console.log(error.message);
    //   res.status(400).json({msg:error.message});
    // }
    res.send("ok");
});
exports.uri = uri;
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#test");
    // const result = await Event.find({ _id: "6656396c8f027cee3e114e68", 'categories.teams': { $exists: true, $type: 'array', $ne: [] } })
    // res.send('version 2.1.3')
    // res.send(process.env.MONGODB_URI);
    res.send("NOREP ONLINE");
});
exports.test = test;
const version = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cacheAdmin, cacheUser } = req.body;
        const version = "4.0.3";
        const user = cacheUser
            ? yield userSchema_1.default.findById(cacheUser, { password: 0 })
            : undefined;
        const admin = cacheAdmin
            ? yield adminSchema_1.default.findById(cacheAdmin, { password: 0 })
            : undefined;
        res.send({ version, user, admin });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.version = version;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#login");
    try {
        const { email, password: pass } = req.body;
        // let a = 's'
        // a.toLowerCase()
        if (email[0] === "@") {
            // const { username, password } = req.body;
            const adm = yield adminSchema_1.default.findOne({ username: email });
            if (adm) {
                bcrypt_1.default.compare(pass, adm.password).then(function (result) {
                    if (result) {
                        res.send({
                            username: adm.username,
                            _id: adm._id,
                        });
                    }
                    else {
                        res.status(404).json({ msg: "Usuario o contraseña incorrectos" });
                    }
                });
            }
        }
        else {
            const user = yield userSchema_1.default.findOne({ email: email.toLowerCase() });
            if (!user)
                return res.status(401).json({ msg: "Correo incorrecto" });
            bcrypt_1.default.compare(pass, user.password, function (_, result) {
                if (!result)
                    return res.status(401).json({ msg: "Contraseña incorrecta" });
                //@ts-ignore
                const { passsword: _x } = user, allData = __rest(user, ["passsword"]);
                //@ts-ignore
                return res.send(allData._doc);
            });
        }
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.login = login;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#register");
    try {
        const { name, password: pass, email, card_id, birth, box, genre, location, shirt, phone, } = req.body;
        const ifEmail = yield userSchema_1.default.find({ email: email.toLowerCase() });
        if (ifEmail.length > 0)
            return res.status(403).json({ msg: "Correo en uso" });
        const ifCard = yield userSchema_1.default.find({ card_id: card_id });
        if (ifCard.length > 0)
            return res.status(403).json({ msg: "Cédula en uso" });
        else {
            let password = bcrypt_1.default.hashSync(pass, bcrypt_1.default.genSaltSync(10));
            const result = yield userSchema_1.default.create({
                password,
                name,
                email: email.toLowerCase(),
                shirt,
                card_id,
                genre,
                location,
                box,
                birth,
                phone,
                // birth: moment(new Date(birth)).unix(),
            });
            const { password: _ } = result, allData = __rest(result, ["password"]);
            //@ts-ignore
            res.send(allData._doc);
        }
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.registerUser = registerUser;
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#getEvents");
    try {
        const events = yield eventSchema_1.default.find().lean();
        events.sort((a, b) => {
            const dateA = new Date(a.since).valueOf();
            const dateB = new Date(b.since).valueOf();
            if (dateA < dateB)
                return -1;
            if (dateA > dateB)
                return 1;
            return 0;
        });
        res.send(events);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getEvents = getEvents;
const getEventsPlusTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#getEventsPlusTeams");
    try {
        const events = yield eventSchema_1.default.find();
        const teams = yield t_1.default.find();
        let data = [events, teams];
        res.send(data);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getEventsPlusTeams = getEventsPlusTeams;
// export const getStart = async (req,res)=>{
//     if(debug) console.log('#getStart')
//     try {
//         const events = await Event.find()
//         let data = [events,+moment()]
//         res.send(data)
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
// }
const getWods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#getWods");
    try {
        const { categories } = req.body;
        const wods = yield wodSchema_1.default.find({ category_id: { $in: categories } });
        res.send(wods);
        // res.send("ok")
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getWods = getWods;
const toggleUpdating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#toggleUpdating");
    try {
        const { event_id, state } = req.body;
        const result = yield eventSchema_1.default.findOneAndUpdate({ _id: event_id }, { $set: { updating: state } });
        res.send(result);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.toggleUpdating = toggleUpdating;
const searchTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#searchTeam");
    try {
        const { searchName } = req.body;
        const result = yield t_1.default.find({
            name: new RegExp(searchName, "i"),
        });
        res.send(result);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.searchTeam = searchTeam;
const cleanDupl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#cleanDupl");
    // res.send('ok')
    try {
        const result = yield t_1.default.find();
        result.forEach((teamx) => {
            result.forEach((t) => __awaiter(void 0, void 0, void 0, function* () {
                //@ts0ignore
                if (teamx.name === t.name &&
                    teamx.category_id === t.category_id &&
                    teamx.event_id === t.event_id) {
                    if (teamx.createdAt < t.createdAt) {
                        yield t_1.default.deleteOne({ _id: t._id });
                    }
                }
            }));
        });
        res.send("ok");
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.cleanDupl = cleanDupl;
const getLatestEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#getLatestEvent");
    try {
        const result = yield eventSchema_1.default.find({}).sort({ updatedAt: -1 }).limit(1);
        res.send(result[0]);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getLatestEvent = getLatestEvent;
const getEventTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#getEventTable");
    try {
        const { _id } = req.query;
        // const event: EventType = await Event.findById(_id).populate('categories.teams.users','name phone card_id');
        const event = yield eventSchema_1.default.findById(_id).populate("categories.teams.users", "name card_id");
        if (event === undefined)
            res.status(404).json({ msg: "Evento no encontrado" });
        else {
            //@ts-ignore
            let categories = event.categories.map((c) => c._id);
            const wods = yield wodSchema_1.default.find({ category_id: { $in: categories } });
            // let data = [events, +moment()]
            res.send({ event, wods, date: new Date() });
        }
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getEventTable = getEventTable;
const getEmailExist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#getEmailExist");
    try {
        const { email, code } = req.query;
        if (!code || typeof code !== "string")
            throw new Error("Código inexistente");
        const user = yield userSchema_1.default.findOne({ email }, { name: 1, email: 1 });
        if (user) {
            let transporter = nodemailer_1.default.createTransport({
                service: "yahoo",
                auth: {
                    user: "norep.code@yahoo.com",
                    pass: "lgippxsozkcbrovy",
                },
            });
            let mailOptions = {
                from: "norep.code@yahoo.com",
                to: user.email,
                subject: `Recuperación de contraseña`,
                html: passEmail(user.name, code),
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    throw new Error("No se ha podido enviar el correo.");
                }
                else {
                    res.send({ itExist: true });
                }
            });
        }
        else
            res.status(404).json({ msg: "El correo ingresado no existe." });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getEmailExist = getEmailExist;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (true)
        console.log("#changePassword");
    try {
        const { email, password: pass } = req.body;
        let password = bcrypt_1.default.hashSync(pass, bcrypt_1.default.genSaltSync(10));
        const user = yield userSchema_1.default.findOneAndUpdate({ email }, { password });
        if (user)
            res.send(true);
        else
            res.status(404).json({ msg: "No se ha encontrado al usuario." });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.changePassword = changePassword;
// export const namehere = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// }
const passEmail = (name, code) => {
    return `<body>
    <div style="width:500px;padding:2em;box-sizing:border-box">
      <h1 style="font-family: sans-serif; font-weight: 600;font-style: normal;color: black;" >${name}</h1>
      <p style="font-family: sans-serif; color: black;margin: 0;" >Código solicitado para el cambio de contraseña:</p>
      <h1 style="text-decoration: underline #F1FF48 10px;font-family:  sans-serif;font-weight: 600;font-style: normal;color: black;" >${code}</h1>
      <p style="font-family: sans-serif; color: black;margin: 0;" >Si usted no ha solicitado el cambio de contraseña ignore este mensage.</p>
    </div>
  </body>`;
};
const eventsWithInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#getEvents");
    try {
        const { cacheUser, cacheAdmin } = req.body;
        const events = yield eventSchema_1.default.find().lean();
        const user = cacheUser
            ? yield userSchema_1.default.findById(cacheUser, { password: 0 })
            : undefined;
        const admin = cacheAdmin
            ? yield adminSchema_1.default.findById(cacheAdmin, { password: 0 })
            : undefined;
        res.send({ events, user, admin });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.eventsWithInfo = eventsWithInfo;
// const emails = [
//   {
//     name: "Duplas Novato Masculino",
//     users: [
//   {
//       email: "radulito19@gmail.com",
//       name: "María al cuadrado",
//   category: "Duplas Novato Masculino",
// },
//       {
//         email: "raulbritogonz@gmail.com",
//         name: "Maria y Lorent",
//       },
//       {
//         email: "slyt19@gmail.com",
//         name: "Maria y Lorentxx",
//       },
//     ],
//   },
// ];
////////// DONE EMAILS
// {
//   email: "mvgallot@gmail.com",
//   name: "María al cuadrado",
//   category: "Duplas Novato Femenino",
// },
// {
//   email: "lorentguadalupe@gmail.com",
//   name: "Maria y Lorent",
//   category: "Duplas Novato Femenino",
// },
// {
//   email: "mariaslas14@gmail.com",
//   name: "Maria y Lorent",
//   category: "Duplas Novato Femenino",
// },
// {
//   email: "jackceliscastro@gmail.com",
//   name: "CAFé CON RON",
//   category: "Duplas Novato Femenino",
// },
// {
//   email: "valentinaparra2023@gmail.com",
//   name: "CAFé CON RON",
//   category: "Duplas Novato Femenino",
// },
// {
//   email: "wendymontielweffer97@gmail.com",
//   name: "MOMS POWER",
//   category: "Duplas Novato Femenino",
// },
// {
//   email: "yorleymarquina44@gmail.com",
//   name: "MOMS POWER",
//   category: "Duplas Novato Femenino",
// },
// {
//   email: "guerramoralesjesuslucas@gmail.com",
//   name: "Los Guaicaipuro",
//   category: "Duplas Novato Masculino",
// },
// {
//   email: "roynerjesusrch@gmail.com",
//   name: "Los Guaicaipuro",
//   category: "Duplas Novato Masculino",
// },
// {
//   email: "fjbelisario29@gmail.com",
//   name: "Titanes",
//   category: "Duplas Novato Masculino",
// },
// {
//   email: "torrealbaamado54@gmail.com",
//   name: "Titanes",
//   category: "Duplas Novato Masculino",
// },
// {
//   email: "carlostovarmizzi@gmail.com",
//   name: "FE!N!",
//   category: "Duplas Novato Masculino",
// },
// {
//   email: "victorjuliocorderanava@gmail.com",
//   name: "FE!N!",
//   category: "Duplas Novato Masculino",
// },
// {
//   email: "dmmaury01@gmail.com",
//   name: "Iron Titans ",
//   category: "Duplas Novato Masculino",
// },
// {
//   email: "francisco.diazl0903@gmail.com",
//   name: "Iron Titans ",
//   category: "Duplas Novato Masculino",
// },
// {
//   email: "cslbs.rx.010510@gmail.com",
//   name: "Atenea y Artemisa",
//   category: "Duplas Escalado Femenino",
// },
// {
//   email: "ariannamedina146@gmail.com",
//   name: "Atenea y Artemisa",
//   category: "Duplas Escalado Femenino",
// },
// {
//   email: "paogonzd@gmail.com",
//   name: "Strong endurance",
//   category: "Duplas Escalado Femenino",
// },
// {
//   email: "yrevelis25@gmail.com",
//   name: "Strong endurance",
//   category: "Duplas Escalado Femenino",
// },
// {
//   email: "marcosliscano.18@gmail.com",
//   name: "Team Kaizen",
//   category: "Duplas Escalado Masculino",
// },
// {
//   email: "luchoantequera1@gmail.com",
//   name: "Team Kaizen",
//   category: "Duplas Escalado Masculino",
// },
// {
//   email: "jsantosrr1@gmail.com",
//   name: "Altitude Strong",
//   category: "Duplas Escalado Masculino",
// },
// {
//   email: "armandochavez290593@gmail.com",
//   name: "Altitude Strong",
//   category: "Duplas Escalado Masculino",
// },
// {
//   email: "ojbborjas@gmail.com",
//   name: "Pichulas",
//   category: "Duplas Escalado Masculino",
// },
// {
//   email: "dajepave@gmail.com",
//   name: "Pichulas",
//   category: "Duplas Escalado Masculino",
// },
// {
//   email: "ejspsalon@gmail.com",
//   name: "Team Rayo",
//   category: "Duplas Escalado Masculino",
// },
// {
//   email: "11eduardoparra11@gmail.com",
//   name: "Team Rayo",
//   category: "Duplas Escalado Masculino",
// },
// {
//   email: "yoberlanm@gmail.com",
//   name: "Un atleta y medio",
//   category: "Duplas Escalado Masculino",
// },
// {
//   email: "derderfit@gmail.com",
//   name: "Un atleta y medio",
//   category: "Duplas Escalado Masculino",
// },
// {
//   email: "johaoswla23@gmail.com",
//   name: "Johana Porras",
//   category: "Avanzado Femenino",
// },
// {
//   email: "yusefalsafadi20@gmail.com",
//   name: "Yusef alsafadi",
//   category: "Avanzado Masculino",
// },
// {
//   email: "melvindavid14@gmail.com",
//   name: "Melvin BoscánJr",
//   category: "Avanzado Masculino",
// },
// {
//   email: "s.enmadavid@gmail.com",
//   name: "Enmanuel sibada ",
//   category: "Avanzado Masculino",
// },
// {
//   email: "hernandezcrespoluis@gmail.com",
//   name: "Luis Fernando ",
//   category: "Avanzado Masculino",
// },
// {
//   email: "darrysjca@gmail.com",
//   name: "Darrys Contreras ",
//   category: "Avanzado Masculino",
// },
// {
//   email: "cruz_goyo@hotmail.com",
//   name: "Cruz Eliezer",
//   category: "Master +35 Masculino",
// },
// {
//   email: "luisdefx26@gmail.com",
//   name: "Luis Perales",
//   category: "RX",
// },
const users = [];
const emailMsg = (team, event, category, event_id) => {
    return `<body>
    <div style="width:500px;padding:2em;box-sizing:border-box">
      <h1 style="font-family: sans-serif; font-weight: 600;font-style: normal;color: black;" >${team.toUpperCase()}</h1>
      <p style="font-family: sans-serif; color: black;margin: 0;" >Ha sido aprobado para participar en el evento :</p>
      <h1 style="text-decoration: underline #F1FF48 10px;font-family:  sans-serif;font-weight: 600;font-style: normal;color: black;" >${event.toUpperCase()}</h1>
      <h2 style="font-size: 1.5em;text-decoration: underline #F1FF48 10px;font-family:  sans-serif;font-weight: 600;font-style: normal;color: black;" >${category.toUpperCase()}</h2>
      <div style="height: 32px;" ></div>
      <a href="https://www.norep.com.ve/resultados/${event_id}" target="_blank" style="color: black;font-style: normal;font-weight: 600;font-family:  sans-serif;background-color: #F1FF48;border: 1px solid #191919;font-size: 1.3em;padding: .5em 1em;color: #191919;cursor: pointer;text-decoration: none;" href="/" >IR AL EVENTO</a>
    </div>
  </body>
  `;
};
//# sourceMappingURL=guest.js.map