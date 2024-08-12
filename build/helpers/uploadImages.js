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
exports.deleteImages = exports.deleteImage = exports.uploadImages = exports.uploadImage = void 0;
var cloudinary_1 = require("cloudinary");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
//   secure: true,
// });
cloudinary_1.v2.config({
    cloud_name: 'dtdgl3ajp',
    api_key: '331735467981966',
    api_secret: '4iq8RwNvVUkxRGJzVe7YAqiZvjA',
    secure: true,
});
var regx = /data:image/;
// const regx = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var uploadImage = function (img) { return __awaiter(void 0, void 0, void 0, function () {
    var isBase64, _a, secure_url, public_id;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                isBase64 = regx.test(img.secure_url);
                if (!isBase64) return [3 /*break*/, 4];
                return [4 /*yield*/, cloudinary_1.v2.uploader.upload(img.secure_url, {})];
            case 1:
                _a = _b.sent(), secure_url = _a.secure_url, public_id = _a.public_id;
                if (!(img.public_id && img.public_id.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, exports.deleteImage)(img.public_id)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [2 /*return*/, { secure_url: secure_url, public_id: public_id }];
            case 4: return [2 /*return*/, img];
        }
    });
}); };
exports.uploadImage = uploadImage;
var uploadImages = function (arrImages) { return __awaiter(void 0, void 0, void 0, function () {
    var sendImg, images;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sendImg = function (img) {
                    return new Promise(function (res, rej) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = res;
                                    return [4 /*yield*/, (0, exports.uploadImage)(img)];
                                case 1:
                                    _a.apply(void 0, [_b.sent()]);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                };
                return [4 /*yield*/, Promise.all(arrImages.map(function (img) { return sendImg(img); }))];
            case 1:
                images = _a.sent();
                return [2 /*return*/, images];
        }
    });
}); };
exports.uploadImages = uploadImages;
var deleteImage = function (public_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cloudinary_1.v2.uploader.destroy(public_id)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteImage = deleteImage;
var deleteImages = function (arrImages) { return __awaiter(void 0, void 0, void 0, function () {
    var sendImg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sendImg = function (public_id) {
                    return new Promise(function (res, rej) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = res;
                                    return [4 /*yield*/, (0, exports.deleteImage)(public_id)];
                                case 1:
                                    _a.apply(void 0, [_b.sent()]);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                };
                return [4 /*yield*/, Promise.all(arrImages.map(function (img) { return sendImg(img.public_id); }))];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
exports.deleteImages = deleteImages;
/**
 * NOREP 2.0 (en desarrollo)
 *
 * Novedades:
 * -- Inicio de sesion:
 * -- -- Los usuarios y administradores iniciarán sesión desde su respectiva pantalla
 * -- -- Los administradores ahora inician sus usuarios con "@" (para diferenciarlos de los correos de los usuarios normales)
 *
 * -- Registro:
 * -- -- Formulario de registro con sus campos correspondientes
 *
 * -- Creacion de evento:
 * -- -- Filtros para las categorias, asi como campos para el precio en $ y las fechas de inscripcion y cierre de inscripciones
 * -- -- Equipos Manuales: una vez seleccionada la casilla no se puede modificar!!! Esta opcion es para habilitar la tabla vieja (subir los equipos a mano), en caso de estar deshabilitada, las categorias tendran las opciones de filtro y los usuarios podran inscribirse una vez iniciada su sesion.
 *
 * -- Solicitudes:
 * -- -- Una vez iniciada la sesion como administrador se podran ver todos los "Tickets" que hayan creado los usuarios para solicitar unirse a las categorias. En estos tickets esta la fecha del mismo, el nombre de los integrantes, el numero de tlf del capitan, el nro de transferencia y el comprobante del pago. Nota: Una vez aceptada o rechazada la solicitud, la informacion se elimina por completo, aún estoy cuestionando si guardarla como respaldo o no, ya que en caso de hacer un respaldo, mucha informacion se va a guardar en la base de datos y eso es $$$
 *
 * -- -- Tabla
 * -- SI DIOS QUEIRE Y LA VIRGEN YA NO SE DUPLICAN LOS EQUIPOS
 * -- La tabla no fue actualizada mas allá del nuevo esquema para los equipos con multiples integrantes
 *
 * -- Registro al Evento
 * -- -- Escuchar audio
 */
