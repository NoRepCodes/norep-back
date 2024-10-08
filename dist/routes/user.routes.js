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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const usr = __importStar(require("../controllers/user"));
router.post('/login', usr.login);
router.post('/registerUser', usr.registerUser);
router.post('/registerTeam', usr.registerTeam);
router.post('/registerTicket', usr.registerTicket);
router.post('/checkUsers', usr.checkUsers);
router.get('/getTickets', usr.getTickets);
router.post('/approveTicket', usr.approveTicket);
router.post('/rejectTicket', usr.rejectTicket);
router.post('/pushTicket', usr.pushTicket);
router.post('/createAdmin', usr.createAdmin);
router.post('/deleteAdmin', usr.deleteAdmin);
router.get('/getUserRedcords', usr.getUserRedcords);
router.get('/sendEmail', usr.sendEmail);
router.get('/getUsers', usr.getUsers);
router.get('/getUsers2', usr.getUsers2);
exports.default = router;
//# sourceMappingURL=user.routes.js.map