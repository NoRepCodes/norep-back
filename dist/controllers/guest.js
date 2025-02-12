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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsWithInfo = exports.changePassword = exports.getEmailExist = exports.getEventTable = exports.getLatestEvent = exports.cleanDupl = exports.searchTeam = exports.toggleUpdating = exports.getWods = exports.getEventPlusWods = exports.getEventsPlusTeams = exports.getEvents = exports.version = exports.test = exports.uri = void 0;
const eventSchema_1 = __importDefault(require("../models/eventSchema"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const t_1 = __importDefault(require("../models/t"));
const dotenv_1 = __importDefault(require("dotenv"));
const wodSchema_1 = __importDefault(require("../models/wodSchema"));
//@ts-ignore
const bcrypt_1 = __importDefault(require("bcrypt"));
//@ts-ignore
const nodemailer_1 = __importDefault(require("nodemailer"));
const adminSchema_1 = __importDefault(require("../models/adminSchema"));
dotenv_1.default.config();
const debug = false;
const uri = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#test");
    ;
    res.send('ok');
});
exports.uri = uri;
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#test");
    // const result = await Event.find({ _id: "6656396c8f027cee3e114e68", 'categories.teams': { $exists: true, $type: 'array', $ne: [] } })
    // res.send('version 2.1.3')
    // res.send(process.env.MONGODB_URI);
    res.send('NOREP ONLINE');
});
exports.test = test;
const version = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cacheAdmin, cacheUser } = req.body;
        const version = '4.0.0';
        const user = cacheUser ? yield userSchema_1.default.findById(cacheUser, { password: 0 }) : undefined;
        const admin = cacheAdmin ? yield adminSchema_1.default.findById(cacheAdmin, { password: 0 }) : undefined;
        res.send({ version, user, admin });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.version = version;
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
const getEventPlusWods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#getEventPlusWods");
    try {
        const { _id } = req.query;
        const events = yield eventSchema_1.default.find().lean();
        // console.log(events)
        const event = events.find((ev) => ev._id.toString() === _id);
        if (event === undefined)
            res.status(404).json({ msg: "Evento no encontrado" });
        else {
            let categories = event.categories.map((c) => c._id);
            const wods = yield wodSchema_1.default.find({ category_id: { $in: categories } });
            // let data = [events, +moment()]
            res.send({ events, wods });
        }
        // res.send("ok")
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getEventPlusWods = getEventPlusWods;
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
        console.log("#loginAdmin");
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
        const event = yield eventSchema_1.default.findById(_id).populate("categories.teams.users", 'name card_id');
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
        if (!code || typeof code !== 'string')
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
        const user = cacheUser ? yield userSchema_1.default.findById(cacheUser, { password: 0 }) : undefined;
        const admin = cacheAdmin ? yield adminSchema_1.default.findById(cacheAdmin, { password: 0 }) : undefined;
        res.send({ events, user, admin });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.eventsWithInfo = eventsWithInfo;
//# sourceMappingURL=guest.js.map