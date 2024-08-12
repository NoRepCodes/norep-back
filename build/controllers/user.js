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
exports.rejectTicket = exports.approveTicket = exports.pushTicket = exports.getTickets = exports.checkUsers = exports.registerTicket = exports.loginAdmin = exports.deleteAdmin = exports.createAdmin = exports.getUserRedcords = exports.registerTeam = exports.registerUser = exports.login = void 0;
var uploadImages_1 = require("../helpers/uploadImages");
var userSchema_1 = __importDefault(require("../models/userSchema"));
var eventSchema_1 = __importDefault(require("../models/eventSchema"));
var wodSchema_1 = __importDefault(require("../models/wodSchema"));
var adminSchema_1 = __importDefault(require("../models/adminSchema"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var ticketSchema_1 = __importDefault(require("../models/ticketSchema"));
var debug = true;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, pass, adm_1, user_1, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (debug)
                    console.log("#login");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                _a = req.body, email = _a.email, pass = _a.pass;
                if (!(email[0] === "@")) return [3 /*break*/, 3];
                return [4 /*yield*/, adminSchema_1.default.findOne({ username: email })];
            case 2:
                adm_1 = _b.sent();
                if (adm_1) {
                    bcrypt_1.default.compare(pass, adm_1.password).then(function (result) {
                        if (result) {
                            res.send({
                                username: adm_1.username,
                                _id: adm_1._id,
                            });
                        }
                        else {
                            res.status(404).json({ msg: "Usuario o contraseña incorrectos" });
                        }
                    });
                }
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, userSchema_1.default.findOne({ email: email })];
            case 4:
                user_1 = _b.sent();
                if (!user_1)
                    return [2 /*return*/, res.status(401).json({ msg: "Correo incorrecto" })];
                bcrypt_1.default.compare(pass, user_1.password, function (_, result) {
                    if (!result)
                        return res.status(401).json({ msg: "Contraseña incorrecta" });
                    //@ts-ignore
                    var _x = user_1.passsword, allData = __rest(user_1, ["passsword"]);
                    //@ts-ignore
                    return res.send(allData._doc);
                });
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                res.status(400).json({ msg: error_1.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var registerUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, pass, email, card_id, birth, box, genre, location_1, shirt, phone, ifEmail, ifCard, password, result, _, allData, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (debug)
                    console.log('#register');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                _a = req.body, name_1 = _a.name, pass = _a.pass, email = _a.email, card_id = _a.card_id, birth = _a.birth, box = _a.box, genre = _a.genre, location_1 = _a.location, shirt = _a.shirt, phone = _a.phone;
                console.log('something is wird');
                return [4 /*yield*/, userSchema_1.default.find({ email: email })];
            case 2:
                ifEmail = _b.sent();
                if (ifEmail.length > 0)
                    return [2 /*return*/, res.status(403).json({ msg: "Correo en uso" })];
                return [4 /*yield*/, userSchema_1.default.find({ card_id: card_id })];
            case 3:
                ifCard = _b.sent();
                if (!(ifCard.length > 0)) return [3 /*break*/, 4];
                return [2 /*return*/, res.status(403).json({ msg: "Cédula en uso" })];
            case 4:
                password = bcrypt_1.default.hashSync(pass, bcrypt_1.default.genSaltSync(10));
                return [4 /*yield*/, userSchema_1.default.create({
                        password: password,
                        name: name_1,
                        email: email,
                        shirt: shirt,
                        card_id: card_id,
                        genre: genre,
                        location: location_1,
                        box: box,
                        birth: birth,
                        phone: phone,
                        // birth: moment(new Date(birth)).unix(),
                    })];
            case 5:
                result = _b.sent();
                _ = result.password, allData = __rest(result, ["password"]);
                //@ts-ignore
                res.send(allData._doc);
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_2 = _b.sent();
                res.status(400).json({ msg: error_2.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.registerUser = registerUser;
var registerTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, team_1, category_id_1, result, cindex, duplUser_1, findUser, error_3;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                _a = req.body, team_1 = _a.team, category_id_1 = _a.category_id;
                return [4 /*yield*/, eventSchema_1.default.findOne({
                        "categories._id": category_id_1,
                    })];
            case 1:
                result = _d.sent();
                if (result === null)
                    return [2 /*return*/, res.status(404).json({ msg: "Categoría no encontrada" })];
                cindex = result.categories.findIndex(function (c) { return c._id.toString() === category_id_1; });
                if (((_c = (_b = result.categories[cindex].filter) === null || _b === void 0 ? void 0 : _b.limit) !== null && _c !== void 0 ? _c : 999) <=
                    result.categories[cindex].teams.length) {
                    return [2 /*return*/, res.status(403).json({ msg: "Límite de equipos alcanzado" })];
                }
                if (result.categories[cindex].teams.some(function (t) { return t.name === team_1.name; })) {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ msg: "El nombre del equipo ya est\u00E1 en uso" })];
                }
                duplUser_1 = undefined;
                result.categories.forEach(function (c) {
                    c.teams.forEach(function (t) {
                        t.users.some(function (u) {
                            if (team_1.users.includes(u.toString())) {
                                duplUser_1 = u.toString();
                                return true;
                            }
                        });
                    });
                });
                if (!duplUser_1) return [3 /*break*/, 3];
                return [4 /*yield*/, userSchema_1.default.findById(duplUser_1, { name: 1 })];
            case 2:
                findUser = _d.sent();
                if (findUser)
                    return [2 /*return*/, res.status(403).json({
                            msg: "El usuario ".concat(findUser.name, " ya se encuentra registrado en el evento"),
                        })];
                else
                    return [2 /*return*/, res.status(403).json({
                            msg: "El usuario ".concat(duplUser_1, " ya se encuentra registrado en el evento"),
                        })];
                _d.label = 3;
            case 3:
                result.categories[cindex].teams.push(team_1);
                return [4 /*yield*/, result.save()];
            case 4:
                _d.sent();
                return [2 /*return*/, res.send(result)];
            case 5:
                error_3 = _d.sent();
                res.status(400).json({ msg: error_3.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.registerTeam = registerTeam;
var getUserRedcords = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, wodSchema_1.default.find({ "results.users": req.query._id }, {})];
            case 1:
                results = _a.sent();
                res.send(results);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(400).json({ msg: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserRedcords = getUserRedcords;
var createAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username_1, pass;
    return __generator(this, function (_b) {
        if (debug)
            console.log("#createAdmin");
        try {
            _a = req.body, username_1 = _a.username, pass = _a.pass;
            bcrypt_1.default.hash(pass, 7, function (err, hash) { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, adminSchema_1.default.create({ username: username_1, password: hash })];
                        case 1:
                            result = _a.sent();
                            res.send(result);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (error) {
            res.status(400).json({ msg: error.message });
        }
        return [2 /*return*/];
    });
}); };
exports.createAdmin = createAdmin;
var deleteAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (debug)
                    console.log("#deleteAdmin");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                _id = req.body._id;
                return [4 /*yield*/, adminSchema_1.default.findOneAndDelete({ _id: _id })];
            case 2:
                result = _a.sent();
                res.send(result);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(400).json({ msg: error_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteAdmin = deleteAdmin;
var loginAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (debug)
            console.log("#loginAdmin");
        try {
        }
        catch (error) {
            res.status(400).json({ msg: error.message });
        }
        return [2 /*return*/];
    });
}); };
exports.loginAdmin = loginAdmin;
var registerTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, users_1, category_id_2, inputs_1, image, phone, result, cindex, duplUser_2, findUser, _b, secure_url, public_id, ev, error_6;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (debug)
                    console.log("#registerTicket");
                _e.label = 1;
            case 1:
                _e.trys.push([1, 10, , 11]);
                _a = req.body, users_1 = _a.users, category_id_2 = _a.category_id, inputs_1 = _a.inputs, image = _a.image, phone = _a.phone;
                return [4 /*yield*/, eventSchema_1.default.findOne({
                        "categories._id": category_id_2,
                    })];
            case 2:
                result = _e.sent();
                cindex = undefined;
                if (result === null)
                    return [2 /*return*/, res.status(404).json({ msg: "Categoría no encontrada" })];
                cindex = result.categories.findIndex(function (c) { return c._id.toString() === category_id_2; });
                if (((_d = (_c = result.categories[cindex].filter) === null || _c === void 0 ? void 0 : _c.limit) !== null && _d !== void 0 ? _d : 999) <=
                    result.categories[cindex].teams.length) {
                    return [2 /*return*/, res.status(403).json({ msg: "Límite de equipos alcanzado" })];
                }
                if (result.categories[cindex].teams.some(function (t) { return t.name === inputs_1.name; })) {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ msg: "El nombre del equipo ya est\u00E1 en uso" })];
                }
                duplUser_2 = undefined;
                result.categories.forEach(function (c) {
                    c.teams.forEach(function (t) {
                        t.users.some(function (u) {
                            if (users_1.includes(u.toString())) {
                                duplUser_2 = u.toString();
                                return true;
                            }
                        });
                    });
                });
                if (!duplUser_2) return [3 /*break*/, 4];
                return [4 /*yield*/, userSchema_1.default.findById(duplUser_2, { name: 1 })];
            case 3:
                findUser = _e.sent();
                if (findUser)
                    return [2 /*return*/, res.status(403).json({
                            msg: "El usuario ".concat(findUser.name, " ya se encuentra registrado en el evento"),
                        })];
                else
                    return [2 /*return*/, res.status(403).json({
                            msg: "El usuario ".concat(duplUser_2, " ya se encuentra registrado en el evento"),
                        })];
                _e.label = 4;
            case 4: return [4 /*yield*/, (0, uploadImages_1.uploadImage)({
                    secure_url: image,
                    public_id: "_",
                })];
            case 5:
                _b = _e.sent(), secure_url = _b.secure_url, public_id = _b.public_id;
                return [4 /*yield*/, eventSchema_1.default.findOneAndUpdate({
                        "categories._id": category_id_2,
                    }, { $inc: { "categories.$.slots": 1 } }, { new: true })];
            case 6:
                ev = _e.sent();
                if (!ev) return [3 /*break*/, 8];
                return [4 /*yield*/, ticketSchema_1.default.create({
                        event: result.name,
                        category: result.categories[cindex].name,
                        category_id: result.categories[cindex]._id,
                        users: users_1,
                        captain: users_1[0],
                        phone: phone,
                        name: inputs_1.name,
                        dues: [
                            {
                                // secure_url: "asd",
                                // public_id: "asd",
                                secure_url: secure_url,
                                public_id: public_id,
                                transf: inputs_1.transf,
                                payDues: inputs_1.payDues,
                            },
                        ],
                        duesLimit: ev.dues,
                    })];
            case 7:
                _e.sent();
                // this is to save
                // result.categories[cindex].teams.push(users);
                // await result.save();
                return [2 /*return*/, res.send({ msg: "Solicitud enviada con exito!" })];
            case 8:
                res.status(404).json({ msg: "Evento no encontrado" });
                _e.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_6 = _e.sent();
                res.status(400).json({ msg: error_6.message });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.registerTicket = registerTicket;
var checkUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, captain, card_2, card_3, card_4, category, auxFem, auxMal, am, amax, age_max, age_min, users_id, fu2, fu3, fu4, error_7;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                if (debug)
                    console.log("#checkUser");
                _r.label = 1;
            case 1:
                _r.trys.push([1, 8, , 9]);
                _a = req.body, captain = _a.captain, card_2 = _a.card_2, card_3 = _a.card_3, card_4 = _a.card_4, category = _a.category;
                auxFem = 0;
                auxMal = 0;
                am = (_b = category.filter) === null || _b === void 0 ? void 0 : _b.age_min;
                amax = (_c = category.filter) === null || _c === void 0 ? void 0 : _c.age_max;
                age_max = amax
                    ? new Date("".concat(2024 - amax, "-").concat(new Date().getMonth(), "-").concat(new Date().getDay()))
                    : undefined;
                age_min = am
                    ? new Date("".concat(2024 - am, "-").concat(new Date().getMonth(), "-").concat(new Date().getDay()))
                    : undefined;
                users_id = [captain._id];
                if (captain) {
                    if (((_d = category.filter) === null || _d === void 0 ? void 0 : _d.male) || ((_e = category.filter) === null || _e === void 0 ? void 0 : _e.female)) {
                        if (captain.genre === "Masculino")
                            auxMal += 1;
                        else
                            auxFem += 1;
                    }
                    if (age_min && new Date(captain.birth) > age_min) {
                        return [2 /*return*/, res.status(403).json({
                                msg: "Usuario ".concat(captain.name, " no cumple con la edad necesaria para participar."),
                            })];
                    }
                    else if (age_max && new Date(captain.birth) < age_max) {
                        return [2 /*return*/, res.status(403).json({
                                msg: "Usuario ".concat(captain.name, " excede la edad necesaria para participar."),
                            })];
                    }
                }
                if (!card_2) return [3 /*break*/, 3];
                return [4 /*yield*/, userSchema_1.default.findOne({ card_id: card_2 })];
            case 2:
                fu2 = _r.sent();
                if (fu2) {
                    users_id.push(fu2._id.toString());
                    if (((_f = category.filter) === null || _f === void 0 ? void 0 : _f.male) || ((_g = category.filter) === null || _g === void 0 ? void 0 : _g.female)) {
                        if (fu2.genre === "Masculino")
                            auxMal += 1;
                        else
                            auxFem += 1;
                    }
                    if (age_min && new Date(fu2.birth) > age_min) {
                        return [2 /*return*/, res.status(403).json({
                                msg: "Usuario ".concat(fu2.name, " no cumple con la edad necesaria para participar."),
                            })];
                    }
                    else if (age_max && new Date(fu2.birth) < age_max) {
                        return [2 /*return*/, res.status(403).json({
                                msg: "Usuario ".concat(fu2.name, " excede la edad necesaria para participar."),
                            })];
                    }
                }
                else {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ msg: "Usuario con C.I: ".concat(card_2, " no encontrado.") })];
                }
                _r.label = 3;
            case 3:
                if (!card_3) return [3 /*break*/, 5];
                return [4 /*yield*/, userSchema_1.default.findOne({ card_id: card_2 })];
            case 4:
                fu3 = _r.sent();
                if (fu3) {
                    users_id.push(fu3._id.toString());
                    if (((_h = category.filter) === null || _h === void 0 ? void 0 : _h.male) || ((_j = category.filter) === null || _j === void 0 ? void 0 : _j.female)) {
                        if (fu3.genre === "Masculino")
                            auxMal += 1;
                        else
                            auxFem += 1;
                    }
                    if (age_min && new Date(fu3.birth) > age_min) {
                        return [2 /*return*/, res.status(403).json({
                                msg: "Usuario ".concat(fu3.name, " no cumple con la edad necesaria para participar."),
                            })];
                    }
                    else if (age_max && new Date(fu3.birth) < age_max) {
                        return [2 /*return*/, res.status(403).json({
                                msg: "Usuario ".concat(fu3.name, " excede la edad necesaria para participar."),
                            })];
                    }
                }
                else {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ msg: "Usuario con C.I: ".concat(card_3, " no encontrado.") })];
                }
                _r.label = 5;
            case 5:
                if (!card_4) return [3 /*break*/, 7];
                return [4 /*yield*/, userSchema_1.default.findOne({ card_id: card_2 })];
            case 6:
                fu4 = _r.sent();
                if (fu4) {
                    users_id.push(fu4._id.toString());
                    if (((_k = category.filter) === null || _k === void 0 ? void 0 : _k.male) || ((_l = category.filter) === null || _l === void 0 ? void 0 : _l.female)) {
                        if (fu4.genre === "Masculino")
                            auxMal += 1;
                        else
                            auxFem += 1;
                    }
                    if (age_min && new Date(fu4.birth) > age_min) {
                        return [2 /*return*/, res.status(403).json({
                                msg: "Usuario ".concat(fu4.name, " no cumple con la edad necesaria para participar."),
                            })];
                    }
                    else if (age_max && new Date(fu4.birth) < age_max) {
                        return [2 /*return*/, res.status(403).json({
                                msg: "Usuario ".concat(fu4.name, " excede la edad necesaria para participar."),
                            })];
                    }
                }
                else {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ msg: "Usuario con C.I: ".concat(card_4, " no encontrado.") })];
                }
                _r.label = 7;
            case 7:
                if (((_m = category.filter) === null || _m === void 0 ? void 0 : _m.male) && auxMal > ((_o = category.filter) === null || _o === void 0 ? void 0 : _o.male)) {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ msg: "Exceso de participantes masculinos en el equipo." })];
                }
                else if (((_p = category.filter) === null || _p === void 0 ? void 0 : _p.female) && auxFem > ((_q = category.filter) === null || _q === void 0 ? void 0 : _q.female)) {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ msg: "Exceso de participantes femeninos en el equipo." })];
                }
                else {
                    res.send(users_id);
                }
                return [3 /*break*/, 9];
            case 8:
                error_7 = _r.sent();
                res.status(400).json({ msg: error_7.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.checkUsers = checkUsers;
var getTickets = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (debug)
                    console.log("#getTickets");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ticketSchema_1.default.find().populate("users", "name")];
            case 2:
                results = _a.sent();
                res.send(results);
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                res.status(400).json({ msg: error_8.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTickets = getTickets;
var pushTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, captain_id, transf, payDues, img, ticket, _b, secure_url, public_id, error_9;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (debug)
                    console.log("#pushTicket");
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                _a = req.body, captain_id = _a.captain_id, transf = _a.transf, payDues = _a.payDues, img = _a.img;
                return [4 /*yield*/, ticketSchema_1.default.findOne({ users: captain_id })];
            case 2:
                ticket = _c.sent();
                if (!ticket) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, uploadImages_1.uploadImage)({ secure_url: img, public_id: '_' })];
            case 3:
                _b = _c.sent(), secure_url = _b.secure_url, public_id = _b.public_id;
                console.log(secure_url, public_id);
                ticket.dues.push({
                    secure_url: secure_url,
                    public_id: public_id,
                    transf: transf,
                    payDues: payDues,
                });
                return [4 /*yield*/, ticket.save()];
            case 4:
                _c.sent();
                res.send("ok");
                return [3 /*break*/, 6];
            case 5:
                res.status(404).json({ msg: 'No se ha encontrado un pago anterior.' });
                _c.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_9 = _c.sent();
                res.status(400).json({ msg: error_9.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.pushTicket = pushTicket;
// var transporter = nodemailer.createTransport({
//   service: "yahoo",
//   auth: {
//     user: "norep.code@yahoo.com",
//     pass: "Crossfit2024",
//   },
// });
// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
var approveTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticket, event_1, results, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (debug)
                    console.log("#approveTicket");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                ticket = req.body.ticket;
                return [4 /*yield*/, eventSchema_1.default.findOneAndUpdate({ "categories._id": ticket.category_id }, {
                        $push: {
                            "categories.$.teams": {
                                users: ticket.users,
                                captain: ticket.users[0],
                                name: ticket.name,
                            },
                        },
                    })];
            case 2:
                event_1 = _a.sent();
                if (!event_1) return [3 /*break*/, 5];
                // await deleteImage(ticket.public_id);
                return [4 /*yield*/, ticketSchema_1.default.findOneAndDelete({ _id: ticket._id })];
            case 3:
                // await deleteImage(ticket.public_id);
                _a.sent();
                return [4 /*yield*/, ticketSchema_1.default.find()];
            case 4:
                results = _a.sent();
                res.send(results);
                return [3 /*break*/, 6];
            case 5:
                res.status(404).json({ msg: "Evento no encontrado." });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_10 = _a.sent();
                res.status(400).json({ msg: error_10.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.approveTicket = approveTicket;
var rejectTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticket, result, results, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (debug)
                    console.log("#rejectTicket");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                ticket = req.body.ticket;
                return [4 /*yield*/, ticketSchema_1.default.findOneAndDelete({ _id: ticket._id })];
            case 2:
                result = _a.sent();
                if (!result) return [3 /*break*/, 4];
                return [4 /*yield*/, ticketSchema_1.default.find()];
            case 3:
                results = _a.sent();
                res.send(results);
                return [3 /*break*/, 5];
            case 4:
                res.status(404).json({ msg: "Ticket no encontrado." });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_11 = _a.sent();
                res.status(400).json({ msg: error_11.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.rejectTicket = rejectTicket;
// export const namehere:RequestHandler = async (req,res)=>{
//     if(debug) console.log('#namehere')
//     try {
//         res.send('ok')
//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
//
// }
