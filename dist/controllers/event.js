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
exports.toggleUpdating = exports.updateTeams = exports.updateResults = exports.updateWods = exports.deleteEvent = exports.updateEvent = exports.createEvent = void 0;
const uploadImages_1 = require("../helpers/uploadImages");
const eventSchema_1 = __importStar(require("../models/eventSchema"));
const wodSchema_1 = __importDefault(require("../models/wodSchema"));
const mongoose_1 = require("mongoose");
const verifyBody_1 = __importDefault(require("../helpers/verifyBody"));
const debug = true;
// EVENTS
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#createEvent");
    try {
        (0, verifyBody_1.default)(req.body, eventSchema_1.eventV);
        const _a = req.body, { secure_url: s_url, partners: pimages } = _a, bData = __rest(_a, ["secure_url", "partners"]);
        const { secure_url, public_id } = yield (0, uploadImages_1.uploadImage)({
            secure_url: s_url,
            public_id: "_",
        });
        const partners = yield (0, uploadImages_1.uploadImages)(pimages);
        yield eventSchema_1.default.create(Object.assign(Object.assign({}, bData), { secure_url, public_id, partners }));
        res.send({ msg: "Evento Creado con exito!" });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.createEvent = createEvent;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (debug)
        console.log("#updateEvent");
    try {
        (0, verifyBody_1.default)(req.body, eventSchema_1.eventV);
        const _b = req.body, { _id, secure_url: s_url, public_id: p_id, partners: pimages } = _b, bData = __rest(_b, ["_id", "secure_url", "public_id", "partners"]);
        const evnt = (yield eventSchema_1.default.findById(_id)).toObject();
        if (evnt === null || evnt === undefined)
            return res.status(400).json({ msg: "Evento no encontrado" });
        let bool = false;
        bData.categories.forEach((c) => {
            var _a, _b;
            c._id = new mongoose_1.Types.ObjectId(c._id);
            const categ = evnt.categories.find((categ) => categ._id === c._id);
            if (categ && (categ === null || categ === void 0 ? void 0 : categ.teams.length) !== ((_a = c.teams) === null || _a === void 0 ? void 0 : _a.length))
                bool = true;
            else if (categ && (categ === null || categ === void 0 ? void 0 : categ.teams.length) === ((_b = c.teams) === null || _b === void 0 ? void 0 : _b.length))
                c.teams = [...categ.teams];
        });
        if (bool)
            throw new Error("Equipos incompatibles, refrescar la pagina solucionara el problema.");
        const { secure_url, public_id } = yield (0, uploadImages_1.uploadImage)({
            secure_url: s_url,
            public_id: p_id,
        });
        const partners = yield (0, uploadImages_1.uploadImages)(pimages);
        const result = yield eventSchema_1.default.findOneAndUpdate({ _id }, Object.assign(Object.assign({}, bData), { secure_url, public_id, partners }), { new: true });
        res.send(result);
        // console.log(req.body)
        // res.status(400).json({ msg: 'test' })
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ msg: (_a = error.message) !== null && _a !== void 0 ? _a : JSON.stringify(error) });
    }
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (debug) console.log('#deleteEvent')
    try {
        const { _id, public_id, partners } = req.body;
        const result = yield eventSchema_1.default.deleteOne({ _id: _id });
        if (result.deletedCount > 0) {
            yield (0, uploadImages_1.deleteImage)(public_id);
            yield (0, uploadImages_1.deleteImages)(partners);
            return res.send(result);
        }
        else
            return res.status(404).json({ msg: "Evento no encontrado" });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
    res.send("ok");
});
exports.deleteEvent = deleteEvent;
/// WODS
const updateWods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#updateWods");
    try {
        const { wods, toDelete, categories } = req.body;
        const updWod = (wod) => __awaiter(void 0, void 0, void 0, function* () {
            const query = wod._id
                ? { _id: wod._id }
                : { category_id: wod.category_id, _id: new mongoose_1.Types.ObjectId() };
            const { _id } = wod, data = __rest(wod, ["_id"]);
            return yield wodSchema_1.default.findOneAndUpdate(query, Object.assign(Object.assign({}, data), { $set: { results: [] } }), { new: true, upsert: true }).lean();
        });
        const delWods = () => __awaiter(void 0, void 0, void 0, function* () {
            if (toDelete.length > 0) {
                return yield wodSchema_1.default.deleteMany({ _id: { $in: toDelete } });
            }
        });
        /// CHECK THAT WODS UPLOAD IN ORDER
        // const result = await Promise.all([
        //   ...wods.map((w:any) => updWod(w)),
        //   delWods(),
        // ]);
        for (const w of wods) {
            yield updWod(w);
        }
        yield delWods();
        const findWods = yield wodSchema_1.default.find({
            category_id: { $in: categories },
        });
        res.send(findWods);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
});
exports.updateWods = updateWods;
const updateResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if(debug) console.log('#namehere')
    try {
        const { wod_id, results, categories } = req.body;
        const notExist = results.some((team_res) => !team_res.team_id);
        if (notExist)
            return res.status(404).json({ msg: "Uno de los equipos no existe" });
        const w = yield wodSchema_1.default.findOneAndUpdate({ _id: wod_id }, {
            $set: { results },
        }, { new: true });
        const wods = yield wodSchema_1.default.find({ category_id: { $in: categories } });
        res.send(wods);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.updateResults = updateResults;
const updateTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#updateTeams");
    try {
        const { teams, category_id, toDelete } = req.body;
        // let aux = [...teams];
        teams.forEach((team) => {
            // if(team._id ==='_') aux[i]._id===undefined
            // if(team.captain ==='_') aux[i].captain===undefined
            if (team._id === "_")
                team._id = undefined;
            if (team.captain === "_")
                team.captain = undefined;
        });
        const event = yield eventSchema_1.default.findOneAndUpdate({ "categories._id": category_id }, {
            "categories.$.teams": teams,
        }, { new: true });
        yield wodSchema_1.default.updateMany({ category_id }, {
            $pull: { team: { _id: { $in: toDelete } } }
        });
        res.send(event);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.updateTeams = updateTeams;
const toggleUpdating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#toggleUpdating");
    try {
        const { category_id, state } = req.body;
        const event = yield eventSchema_1.default.findOneAndUpdate({ "categories._id": category_id }, {
            "categories.$.updating": state,
        }, { new: true });
        // console.log(evn);
        if (event) {
            res.send(event);
        }
        else {
            res.status(400).json({ msg: "Evento no encontrado" });
        }
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.toggleUpdating = toggleUpdating;
// export const migration: RequestHandler = async (req, res) => {
//   if (debug) console.log("#migration");
//   try {
//     const user = await User.find();
//     res.send(user)
//   } catch (error: any) {
//     res.status(400).json({ msg: error.message });
//   }
// };
// export const namehere:RequestHandler = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// export const namehere:RequestHandler = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// }
//# sourceMappingURL=event.js.map