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
exports.getAllEventUsers = exports.loginAdmin = exports.updateTeamInfo = exports.getTeamInfo = void 0;
const eventSchema_1 = __importDefault(require("../models/eventSchema"));
//@ts-ignore
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminSchema_1 = __importDefault(require("../models/adminSchema"));
const debug = true;
const getTeamInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#getTeamInfo");
    try {
        const { _id } = req.query;
        if (!_id)
            throw new Error("Equipo inexistente");
        const event = yield eventSchema_1.default.findOne({ "categories.teams._id": _id }, { "categories.teams.$": 1 }).populate("categories.teams.users", "name phone card_id");
        if (!event)
            res.status(404).json({ msg: "Equipo no encontrado" });
        //@ts-ignore
        const team = event.categories[0].teams.find((t) => t._id == _id);
        res.send(team);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getTeamInfo = getTeamInfo;
const updateTeamInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#updateTeamInfo");
    try {
        const { team, categoryIdToPush } = req.body;
        const event = yield eventSchema_1.default.findOne({
            "categories.teams._id": team._id,
        });
        if (categoryIdToPush) {
            event.categories.forEach((c, i) => {
                c.teams.forEach((t, index) => {
                    if (t._id.toString() === team._id) {
                        event.categories[i].teams.splice(index, 1);
                        event.categories[i].slots = event.categories[i].slots - 1;
                    }
                });
                if (c._id.toString() === categoryIdToPush) {
                    event.categories[i].teams.push(Object.assign({}, team));
                    event.categories[i].slots = event.categories[i].slots + 1;
                }
            });
            // return res.send(event);
        }
        else {
            event.categories.forEach((c, i) => {
                c.teams.forEach((t, index) => {
                    if (t._id.toString() === team._id)
                        event.categories[i].teams[index] = team;
                });
            });
            // res.send(event);
        }
        //@ts-ignore
        yield event.save();
        res.send({ msg: "Equipo actualizado con exito!" });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.updateTeamInfo = updateTeamInfo;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (true)
        console.log("#loginAdmin");
    try {
        const { email, password: pass } = req.body;
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
        else
            res.status(404).json({ msg: "Usuario incorrecto" });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.loginAdmin = loginAdmin;
const getAllEventUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (true)
        console.log("#getAllEventUsers");
    try {
        const { _id } = req.query;
        const event = yield eventSchema_1.default.findById(_id, {
            "categories.teams": 1,
        })
            .populate("categories.teams.users", "name phone card_id")
            .lean();
        if (!event)
            res.status(404).json({ msg: "Evento no encontrado" });
        const allUsers = [];
        event.categories.forEach((c) => {
            c.teams.forEach((t) => {
                t.users.forEach((u) => {
                    allUsers.push(u);
                });
            });
        });
        allUsers.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB)
                return -1;
            if (nameA > nameB)
                return 1;
            return 0;
        });
        res.send(allUsers);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getAllEventUsers = getAllEventUsers;
//# sourceMappingURL=admin.js.map