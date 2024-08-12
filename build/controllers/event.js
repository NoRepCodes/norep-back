"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUpdating = exports.updateTeams = exports.updateResults = exports.updateWods = exports.deleteEvent = exports.updateEvent = exports.createEvent = void 0;
var uploadImages_1 = require("../helpers/uploadImages");
var eventSchema_1 = __importDefault(require("../models/eventSchema"));
var wodSchema_1 = __importDefault(require("../models/wodSchema"));
var mongoose_1 = require("mongoose");
var debug = true;
// EVENTS
var createEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, since, dues, until, place, accesible, s_url, categories, pimages, register_time, manual_teams, _b, secure_url, public_id, partners, results, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = req.body, name_1 = _a.name, since = _a.since, dues = _a.dues, until = _a.until, place = _a.place, accesible = _a.accesible, s_url = _a.secure_url, categories = _a.categories, pimages = _a.partners, register_time = _a.register_time, manual_teams = _a.manual_teams;
                return [4 /*yield*/, (0, uploadImages_1.uploadImage)({
                        secure_url: s_url,
                        public_id: "_",
                    })];
            case 1:
                _b = _c.sent(), secure_url = _b.secure_url, public_id = _b.public_id;
                return [4 /*yield*/, (0, uploadImages_1.uploadImages)(pimages)];
            case 2:
                partners = _c.sent();
                return [4 /*yield*/, eventSchema_1.default.create({
                        name: name_1,
                        since: since,
                        until: until,
                        place: place,
                        dues: dues,
                        secure_url: secure_url,
                        public_id: public_id,
                        accesible: accesible,
                        categories: categories,
                        partners: partners,
                        register_time: register_time,
                        manual_teams: manual_teams,
                    })];
            case 3:
                _c.sent();
                return [4 /*yield*/, eventSchema_1.default.find()];
            case 4:
                results = _c.sent();
                res.send(results);
                return [3 /*break*/, 6];
            case 5:
                error_1 = _c.sent();
                console.log(error_1);
                res.status(400).json({ msg: error_1.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createEvent = createEvent;
var updateEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _id, name_2, since, until, dues, place, accesible, categories, s_url, p_id, pimages, manual_teams, register_time, evnt_1, bool_1, _b, secure_url, public_id, partners, results, error_2;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 6, , 7]);
                _a = req.body, _id = _a._id, name_2 = _a.name, since = _a.since, until = _a.until, dues = _a.dues, place = _a.place, accesible = _a.accesible, categories = _a.categories, s_url = _a.secure_url, p_id = _a.public_id, pimages = _a.partners, manual_teams = _a.manual_teams, register_time = _a.register_time;
                return [4 /*yield*/, eventSchema_1.default.findById(_id)];
            case 1:
                evnt_1 = _d.sent();
                if (evnt_1 === null || evnt_1 === undefined)
                    return [2 /*return*/, res.status(400).json({ msg: "Evento no encontrado" })];
                bool_1 = false;
                categories.forEach(function (c, index) {
                    var _a, _b;
                    c._id = new mongoose_1.Types.ObjectId(c._id);
                    //@ts-ignore
                    // const i = evnt.categories.findIndex(categ => categ._id.toString() === c._id)
                    var categ = evnt_1.categories.find(function (categ) { return categ._id === c._id; });
                    //@ts-ignore
                    if (categ && (categ === null || categ === void 0 ? void 0 : categ.teams.length) !== ((_a = c.teams) === null || _a === void 0 ? void 0 : _a.length))
                        bool_1 = true;
                    //@ts-ignore
                    else if (categ && (categ === null || categ === void 0 ? void 0 : categ.teams.length) === ((_b = c.teams) === null || _b === void 0 ? void 0 : _b.length))
                        //@ts-ignore
                        c.teams = __spreadArray([], categ.teams, true);
                });
                if (bool_1)
                    return [2 /*return*/, res.status(400).json({
                            msg: "Se ha registrado un equipo nuevo mientras, refrescar la pagina solucionara el problema.",
                        })];
                return [4 /*yield*/, (0, uploadImages_1.uploadImage)({
                        secure_url: s_url,
                        public_id: p_id,
                    })];
            case 2:
                _b = _d.sent(), secure_url = _b.secure_url, public_id = _b.public_id;
                return [4 /*yield*/, (0, uploadImages_1.uploadImages)(pimages)];
            case 3:
                partners = _d.sent();
                // console.log(categories)
                evnt_1.name = name_2;
                evnt_1.since = since;
                evnt_1.until = until;
                evnt_1.dues = dues;
                evnt_1.partners = partners;
                evnt_1.place = place;
                evnt_1.accesible = accesible;
                //@ts-ignore
                evnt_1.categories = categories;
                evnt_1.secure_url = secure_url;
                evnt_1.public_id = public_id;
                evnt_1.register_time = register_time;
                evnt_1.manual_teams = manual_teams;
                return [4 /*yield*/, evnt_1.save()];
            case 4:
                _d.sent();
                return [4 /*yield*/, eventSchema_1.default.find()];
            case 5:
                results = _d.sent();
                res.send(results);
                return [3 /*break*/, 7];
            case 6:
                error_2 = _d.sent();
                console.log(error_2);
                res.status(400).json({ msg: (_c = error_2.message) !== null && _c !== void 0 ? _c : JSON.stringify(error_2) });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.updateEvent = updateEvent;
var deleteEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _id, public_id, partners, result, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, _id = _a._id, public_id = _a.public_id, partners = _a.partners;
                return [4 /*yield*/, eventSchema_1.default.deleteOne({ _id: _id })];
            case 1:
                result = _b.sent();
                if (!(result.deletedCount > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, uploadImages_1.deleteImage)(public_id)];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, uploadImages_1.deleteImages)(partners)];
            case 3:
                _b.sent();
                return [2 /*return*/, res.send(result)];
            case 4: return [2 /*return*/, res.status(404).json({ msg: "Evento no encontrado" })];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_3 = _b.sent();
                res.status(400).json({ msg: error_3.message });
                return [3 /*break*/, 7];
            case 7:
                res.send("ok");
                return [2 /*return*/];
        }
    });
}); };
exports.deleteEvent = deleteEvent;
/// WODS
var updateWods = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, wods, toDelete_1, categories, updWod_1, delWods, result, findWods, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, wods = _a.wods, toDelete_1 = _a.toDelete, categories = _a.categories;
                updWod_1 = function (wod) { return __awaiter(void 0, void 0, void 0, function () {
                    var query, _id, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                query = wod._id
                                    ? { _id: wod._id }
                                    : { category_id: wod.category_id, _id: new mongoose_1.Types.ObjectId() };
                                _id = wod._id, data = __rest(wod, ["_id"]);
                                return [4 /*yield*/, wodSchema_1.default.findOneAndUpdate(query, __assign(__assign({}, data), { $set: { results: [] } }), { new: true, upsert: true }).lean()];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); };
                delWods = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(toDelete_1.length > 0)) return [3 /*break*/, 2];
                                return [4 /*yield*/, wodSchema_1.default.deleteMany({ _id: { $in: toDelete_1 } })];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray([], wods.map(function (w) { return updWod_1(w); }), true), [
                        delWods(),
                    ], false))];
            case 1:
                result = _b.sent();
                return [4 /*yield*/, wodSchema_1.default.find({
                        category_id: { $in: categories },
                    })];
            case 2:
                findWods = _b.sent();
                res.send(findWods);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.log(error_4);
                res.status(400).json({ msg: error_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateWods = updateWods;
var updateResults = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, wod_id, results, categories, notExist, w, wods, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, wod_id = _a.wod_id, results = _a.results, categories = _a.categories;
                notExist = results.some(function (team_res) { return !team_res.team_id; });
                if (notExist)
                    return [2 /*return*/, res.status(404).json({ msg: "Uno de los equipos no existe" })];
                return [4 /*yield*/, wodSchema_1.default.findOneAndUpdate({ _id: wod_id }, {
                        $set: { results: results },
                    }, { new: true })];
            case 1:
                w = _b.sent();
                return [4 /*yield*/, wodSchema_1.default.find({ category_id: { $in: categories } })];
            case 2:
                wods = _b.sent();
                // console.log(wods);
                res.send(wods);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                res.status(400).json({ msg: error_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateResults = updateResults;
var updateTeams = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, teams, category_id, aux, results, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (debug)
                    console.log("#updateTeams");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                _a = req.body, teams = _a.teams, category_id = _a.category_id;
                aux = __spreadArray([], teams, true);
                aux.forEach(function (team, i) {
                    // if(team._id ==='_') aux[i]._id===undefined
                    // if(team.captain ==='_') aux[i].captain===undefined
                    if (team._id === "_")
                        team._id = undefined;
                    if (team.captain === "_")
                        team.captain = undefined;
                });
                console.log(aux);
                return [4 /*yield*/, eventSchema_1.default.findOneAndUpdate({ "categories._id": category_id }, {
                        "categories.$.teams": aux,
                    })];
            case 2:
                _b.sent();
                return [4 /*yield*/, eventSchema_1.default.find()];
            case 3:
                results = _b.sent();
                res.send(results);
                return [3 /*break*/, 5];
            case 4:
                error_6 = _b.sent();
                res.status(400).json({ msg: error_6.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateTeams = updateTeams;
var toggleUpdating = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category_id, state, evn, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (debug)
                    console.log("#toggleUpdating");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, category_id = _a.category_id, state = _a.state;
                return [4 /*yield*/, eventSchema_1.default.findOneAndUpdate({ "categories._id": category_id }, {
                        "categories.$.updating": state,
                    }, { new: true })];
            case 2:
                evn = _b.sent();
                // console.log(evn);
                if (evn) {
                    res.send("ok");
                }
                else {
                    res.status(400).json({ msg: "Evento no encontrado" });
                }
                return [3 /*break*/, 4];
            case 3:
                error_7 = _b.sent();
                res.status(400).json({ msg: error_7.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.toggleUpdating = toggleUpdating;
// export const migration: RequestHandler = async (req, res) => {
//   if (debug) console.log("#migration");
//   try {
//     const user = await User.find();
//     res.send(user);
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
