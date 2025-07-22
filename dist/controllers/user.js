"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.pushTicket = exports.updateUserInfo = exports.sendEmail = exports.checkUsers = exports.registerTicket = exports.deleteAdmin = exports.createAdmin = exports.getUserRecords = exports.registerTeam = void 0;
const uploadImages_1 = require("../helpers/uploadImages");
const userSchema_1 = __importStar(require("../models/userSchema"));
const eventSchema_1 = __importDefault(require("../models/eventSchema"));
const wodSchema_1 = __importDefault(require("../models/wodSchema"));
const adminSchema_1 = __importDefault(require("../models/adminSchema"));
//@ts-ignore
const bcrypt_1 = __importDefault(require("bcrypt"));
const ticketSchema_1 = __importDefault(require("../models/ticketSchema"));
//@ts-ignore
// import nodemailer from "nodemailer";
const verifyBody_1 = __importDefault(require("../helpers/verifyBody"));
const resend_1 = require("resend");
const debug = true;
const registerTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // if(debug) console.log('#namehere')
    try {
        // TO DO:
        // age and gender is validated in front -- CHECK THAT EVENT IS NOT 30 MINS OLDER IN FRONT BEFORE UPDATE
        // PLUS: USE GET TO VERIFY USERS CARDS_ID & GET _ID'S
        const { team, category_id } = req.body;
        const result = yield eventSchema_1.default.findOne({
            "categories._id": category_id,
        });
        if (result === null)
            return res.status(404).json({ msg: "Categoría no encontrada" });
        const cindex = result.categories.findIndex((c) => c._id.toString() === category_id);
        if (((_b = (_a = result.categories[cindex].filter) === null || _a === void 0 ? void 0 : _a.limit) !== null && _b !== void 0 ? _b : 999) <=
            result.categories[cindex].teams.length) {
            return res.status(403).json({ msg: "Límite de equipos alcanzado" });
        }
        if (result.categories[cindex].teams.some((t) => t.name === team.name)) {
            return res
                .status(403)
                .json({ msg: `El nombre del equipo ya está en uso` });
        }
        let duplUser = undefined;
        result.categories.forEach((c) => {
            c.teams.forEach((t) => {
                t.users.some((u) => {
                    if (team.users.includes(u.toString())) {
                        duplUser = u.toString();
                        return true;
                    }
                });
            });
        });
        if (duplUser) {
            const findUser = yield userSchema_1.default.findById(duplUser, { name: 1 });
            if (findUser)
                return res.status(403).json({
                    msg: `El usuario ${findUser.name} ya se encuentra registrado en el evento`,
                });
            else
                return res.status(403).json({
                    msg: `El usuario ${duplUser} ya se encuentra registrado en el evento`,
                });
        }
        result.categories[cindex].teams.push(team);
        yield result.save();
        return res.send(result);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.registerTeam = registerTeam;
const getUserRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if(debug) console.log('#namehere')
    try {
        // const filter = {
        //     example: 1,
        // }
        const results = yield wodSchema_1.default.find({ "results.users": req.query._id }, {});
        res.send(results);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getUserRecords = getUserRecords;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#createAdmin");
    try {
        const { username, pass } = req.body;
        bcrypt_1.default.hash(pass, 7, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            // Store hash in your password DB.
            const result = yield adminSchema_1.default.create({ username, password: hash });
            res.send(result);
        }));
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.createAdmin = createAdmin;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#deleteAdmin");
    try {
        const { _id } = req.body;
        const result = yield adminSchema_1.default.findOneAndDelete({ _id });
        res.send(result);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.deleteAdmin = deleteAdmin;
const registerTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (debug)
        console.log("#registerTicket");
    try {
        const { users, values } = req.body;
        const { category_id, name, dues, phone } = values;
        const result = yield eventSchema_1.default.findOne({
            "categories._id": category_id,
        });
        let cindex = undefined;
        if (result === null)
            return res.status(404).json({ msg: "Categoría no encontrada" });
        cindex = result.categories.findIndex((c) => c._id.toString() === category_id);
        if (((_b = (_a = result.categories[cindex].filter) === null || _a === void 0 ? void 0 : _a.limit) !== null && _b !== void 0 ? _b : 999) <=
            result.categories[cindex].teams.length) {
            return res.status(403).json({ msg: "Límite de equipos alcanzado" });
        }
        if (result.categories[cindex].teams.some((t) => t.name === name)) {
            return res
                .status(403)
                .json({ msg: `El nombre del equipo ya está en uso` });
        }
        let duplUser = undefined;
        result.categories.forEach((c) => {
            c.teams.forEach((t) => {
                t.users.some((u) => {
                    if (users.includes(u.toString())) {
                        duplUser = u.toString();
                        return true;
                    }
                });
            });
        });
        if (duplUser) {
            const findUser = yield userSchema_1.default.findById(duplUser, { name: 1 });
            if (findUser)
                return res.status(403).json({
                    msg: `El usuario ${findUser.name} ya se encuentra registrado en el evento`,
                });
            else
                return res.status(403).json({
                    msg: `El usuario ${duplUser} ya se encuentra registrado en el evento`,
                });
        }
        const { secure_url, public_id } = yield (0, uploadImages_1.uploadImage)({
            secure_url: dues[0].secure_url,
            public_id: "_",
        });
        const ev = yield eventSchema_1.default.findOneAndUpdate({
            "categories._id": category_id,
        }, { $inc: { "categories.$.slots": 1 } }, { new: true });
        if (ev) {
            yield ticketSchema_1.default.create({
                event: result.name,
                category: result.categories[cindex].name,
                category_id: result.categories[cindex]._id,
                users,
                captain: users[0],
                phone,
                name,
                dues: [
                    {
                        // secure_url: "asd",
                        // public_id: "asd",
                        secure_url,
                        public_id,
                        transf: dues[0].transf,
                        payDues: dues[0].payDues,
                    },
                ],
                duesLimit: ev.dues,
            });
            // this is to save
            // result.categories[cindex].teams.push(users);
            // await result.save();
            return res.send({ msg: "Solicitud enviada con exito!" });
        }
        else
            res.status(404).json({ msg: "Evento no encontrado" });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.registerTicket = registerTicket;
const checkUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    if (debug)
        console.log("#checkUser");
    try {
        const { captain, card_2, card_3, card_4, category } = req.body;
        let auxFem = 0;
        let auxMal = 0;
        let amin = (_a = category.filter) === null || _a === void 0 ? void 0 : _a.age_min;
        let amax = (_b = category.filter) === null || _b === void 0 ? void 0 : _b.age_max;
        let age_max = amax
            ? new Date(`${2025 - amax}-${new Date().getMonth()}-${new Date().getDay()}`)
            : undefined;
        let age_min = amin
            ? new Date(`${2025 - amin}-${new Date().getMonth()}-${new Date().getDay()}`)
            : undefined;
        let users_id = [captain._id];
        if (captain) {
            if (((_c = category.filter) === null || _c === void 0 ? void 0 : _c.male) || ((_d = category.filter) === null || _d === void 0 ? void 0 : _d.female)) {
                if (captain.genre === "Masculino")
                    auxMal += 1;
                else
                    auxFem += 1;
            }
            if (age_min && new Date(captain.birth) > age_min) {
                return res.status(403).json({
                    msg: `Usuario ${captain.name} no cumple con la edad necesaria para participar.`,
                });
            }
            else if (age_max && new Date(captain.birth) < age_max) {
                return res.status(403).json({
                    msg: `Usuario ${captain.name} excede la edad necesaria para participar.`,
                });
            }
        }
        if (card_2) {
            const fu2 = yield userSchema_1.default.findOne({ card_id: card_2 });
            if (fu2) {
                users_id.push(fu2._id.toString());
                if (((_e = category.filter) === null || _e === void 0 ? void 0 : _e.male) || ((_f = category.filter) === null || _f === void 0 ? void 0 : _f.female)) {
                    if (fu2.genre === "Masculino")
                        auxMal += 1;
                    else
                        auxFem += 1;
                }
                if (age_min && new Date(fu2.birth) > age_min) {
                    return res.status(403).json({
                        msg: `Usuario ${fu2.name} no cumple con la edad necesaria para participar.`,
                    });
                }
                else if (age_max && new Date(fu2.birth) < age_max) {
                    return res.status(403).json({
                        msg: `Usuario ${fu2.name} excede la edad necesaria para participar.`,
                    });
                }
            }
            else {
                return res
                    .status(403)
                    .json({ msg: `Usuario con C.I: ${card_2} no encontrado.` });
            }
        }
        if (card_3) {
            const fu3 = yield userSchema_1.default.findOne({ card_id: card_2 });
            if (fu3) {
                users_id.push(fu3._id.toString());
                if (((_g = category.filter) === null || _g === void 0 ? void 0 : _g.male) || ((_h = category.filter) === null || _h === void 0 ? void 0 : _h.female)) {
                    if (fu3.genre === "Masculino")
                        auxMal += 1;
                    else
                        auxFem += 1;
                }
                if (age_min && new Date(fu3.birth) > age_min) {
                    return res.status(403).json({
                        msg: `Usuario ${fu3.name} no cumple con la edad necesaria para participar.`,
                    });
                }
                else if (age_max && new Date(fu3.birth) < age_max) {
                    return res.status(403).json({
                        msg: `Usuario ${fu3.name} excede la edad necesaria para participar.`,
                    });
                }
            }
            else {
                return res
                    .status(403)
                    .json({ msg: `Usuario con C.I: ${card_3} no encontrado.` });
            }
        }
        if (card_4) {
            const fu4 = yield userSchema_1.default.findOne({ card_id: card_2 });
            if (fu4) {
                users_id.push(fu4._id.toString());
                if (((_j = category.filter) === null || _j === void 0 ? void 0 : _j.male) || ((_k = category.filter) === null || _k === void 0 ? void 0 : _k.female)) {
                    if (fu4.genre === "Masculino")
                        auxMal += 1;
                    else
                        auxFem += 1;
                }
                if (age_min && new Date(fu4.birth) > age_min) {
                    return res.status(403).json({
                        msg: `Usuario ${fu4.name} no cumple con la edad necesaria para participar.`,
                    });
                }
                else if (age_max && new Date(fu4.birth) < age_max) {
                    return res.status(403).json({
                        msg: `Usuario ${fu4.name} excede la edad necesaria para participar.`,
                    });
                }
            }
            else {
                return res
                    .status(403)
                    .json({ msg: `Usuario con C.I: ${card_4} no encontrado.` });
            }
        }
        if (((_l = category.filter) === null || _l === void 0 ? void 0 : _l.male) && auxMal > ((_m = category.filter) === null || _m === void 0 ? void 0 : _m.male)) {
            return res
                .status(403)
                .json({ msg: `Exceso de participantes masculinos en el equipo.` });
        }
        else if (((_o = category.filter) === null || _o === void 0 ? void 0 : _o.female) && auxFem > ((_p = category.filter) === null || _p === void 0 ? void 0 : _p.female)) {
            return res
                .status(403)
                .json({ msg: `Exceso de participantes femeninos en el equipo.` });
        }
        else {
            res.send(users_id);
        }
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.checkUsers = checkUsers;
const sendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (debug)
        console.log("#sendEmail");
    try {
        const ticket = { users: "xx" };
        const users = yield userSchema_1.default.find({ _id: { $in: ticket.users } }, { email: 1 });
        const resend = new resend_1.Resend((_a = process.env.RESEND_API_KEY) !== null && _a !== void 0 ? _a : "");
        const userList = users.map((u) => u.email);
        const { data, error } = yield resend.emails.send({
            from: "no-reply@norep.com.ve",
            to: userList,
            subject: "hello world",
            html: emailMsg("Dignitas", "Breath", "Solitude", "idkhere"),
        });
        if (error)
            return res.status(400).json({ error });
        res.send(users);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.sendEmail = sendEmail;
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#updateUserInfo");
    try {
        (0, verifyBody_1.default)(req.body, userSchema_1.userV);
        const _a = req.body, { _id, email } = _a, userData = __rest(_a, ["_id", "email"]);
        const findUser = yield userSchema_1.default.findOneAndUpdate({ _id }, Object.assign({ email: email.toLowerCase() }, userData), { new: true });
        if (!findUser)
            res.status(404).json({ msg: "Usuario no encontrado." });
        res.send(findUser);
        // res.status(400).json({ msg:'wtf' });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
});
exports.updateUserInfo = updateUserInfo;
const pushTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#pushTicket");
    try {
        const { captain_id, transf, payDues, img } = req.body;
        const ticket = yield ticketSchema_1.default.findOne({ users: captain_id });
        if (ticket) {
            const { secure_url, public_id } = yield (0, uploadImages_1.uploadImage)({
                secure_url: img,
                public_id: "_",
            });
            // console.log(secure_url, public_id);
            ticket.dues.push({
                secure_url,
                public_id,
                transf,
                payDues,
            });
            yield ticket.save();
            res.send("ok");
        }
        else {
            res.status(404).json({ msg: "No se ha encontrado un pago anterior." });
        }
        // res.send("ok");
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.pushTicket = pushTicket;
// export const namehere:RequestHandler = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// }
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
//# sourceMappingURL=user.js.map