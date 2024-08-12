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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestEvent = exports.cleanDupl = exports.searchTeam = exports.toggleUpdating = exports.getWods = exports.getEventPlusWods = exports.getEventsPlusTeams = exports.getEvents = exports.test = void 0;
var eventSchema_1 = __importDefault(require("../models/eventSchema"));
var t_1 = __importDefault(require("../models/t"));
var dotenv_1 = __importDefault(require("dotenv"));
var wodSchema_1 = __importDefault(require("../models/wodSchema"));
dotenv_1.default.config();
var debug = false;
var test = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (debug)
            console.log('#test');
        // const result = await Event.find({ _id: "6656396c8f027cee3e114e68", 'categories.teams': { $exists: true, $type: 'array', $ne: [] } })
        res.send('version 2.0.0');
        return [2 /*return*/];
    });
}); };
exports.test = test;
var getEvents = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var events, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (debug)
                    console.log('#getEvents');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, eventSchema_1.default.find().lean()];
            case 2:
                events = _a.sent();
                res.send(events);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(400).json({ msg: error_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getEvents = getEvents;
var getEventsPlusTeams = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var events, teams, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (debug)
                    console.log('#getEventsPlusTeams');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, eventSchema_1.default.find()];
            case 2:
                events = _a.sent();
                return [4 /*yield*/, t_1.default.find()];
            case 3:
                teams = _a.sent();
                data = [events, teams];
                res.send(data);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                res.status(400).json({ msg: error_2.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
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
var getEventPlusWods = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id_1, events, event_1, categories, wods, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (debug)
                    console.log('#getEventPlusWods');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                _id_1 = req.query._id;
                return [4 /*yield*/, eventSchema_1.default.find().lean()
                    // console.log(events)
                ];
            case 2:
                events = _a.sent();
                event_1 = events.find(function (ev) { return ev._id.toString() === _id_1; });
                if (!(event_1 === undefined)) return [3 /*break*/, 3];
                res.status(404).json({ msg: "Evento no encontrado" });
                return [3 /*break*/, 5];
            case 3:
                categories = event_1.categories.map(function (c) { return c._id; });
                return [4 /*yield*/, wodSchema_1.default.find({ category_id: { '$in': categories } })
                    // let data = [events, +moment()]
                ];
            case 4:
                wods = _a.sent();
                // let data = [events, +moment()]
                res.send({ events: events, wods: wods });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                res.status(400).json({ msg: error_3.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getEventPlusWods = getEventPlusWods;
var getWods = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, wods, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (debug)
                    console.log('#getWods');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                categories = req.body.categories;
                return [4 /*yield*/, wodSchema_1.default.find({ category_id: { '$in': categories } })];
            case 2:
                wods = _a.sent();
                res.send(wods);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(400).json({ msg: error_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getWods = getWods;
var toggleUpdating = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, event_id, state, result, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (debug)
                    console.log('#toggleUpdating');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, event_id = _a.event_id, state = _a.state;
                return [4 /*yield*/, eventSchema_1.default.findOneAndUpdate({ _id: event_id }, { $set: { updating: state } })];
            case 2:
                result = _b.sent();
                res.send(result);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                res.status(400).json({ msg: error_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.toggleUpdating = toggleUpdating;
var searchTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var searchName, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (debug)
                    console.log('#loginAdmin');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                searchName = req.body.searchName;
                return [4 /*yield*/, t_1.default.find({
                        name: new RegExp(searchName, "i")
                    })];
            case 2:
                result = _a.sent();
                res.send(result);
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                res.status(400).json({ msg: error_6.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.searchTeam = searchTeam;
var cleanDupl = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result_1, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (debug)
                    console.log('#cleanDupl');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, t_1.default.find()];
            case 2:
                result_1 = _a.sent();
                result_1.forEach(function (teamx) {
                    result_1.forEach(function (t) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(teamx.name === t.name && teamx.category_id === t.category_id && teamx.event_id === t.event_id)) return [3 /*break*/, 2];
                                    if (!(teamx.createdAt < t.createdAt)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, t_1.default.deleteOne({ _id: t._id })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                });
                res.send('ok');
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                res.status(400).json({ msg: error_7.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.cleanDupl = cleanDupl;
var getLatestEvent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (debug)
                    console.log('#getLatestEvent');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, eventSchema_1.default.find({}).sort({ updatedAt: -1 }).limit(1)];
            case 2:
                result = _a.sent();
                res.send(result[0]);
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                res.status(400).json({ msg: error_8.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getLatestEvent = getLatestEvent;
// export const namehere = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// }
