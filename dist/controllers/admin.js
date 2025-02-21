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
exports.getUserInfo = exports.rejectTicket = exports.approveTicket = exports.getTickets = exports.getAllEventUsers = exports.loginAdmin = exports.updateTeamInfo = exports.getTeamInfo = void 0;
const eventSchema_1 = __importDefault(require("../models/eventSchema"));
//@ts-ignore
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminSchema_1 = __importDefault(require("../models/adminSchema"));
const ticketSchema_1 = __importDefault(require("../models/ticketSchema"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
//@ts-ignore
const nodemailer_1 = __importDefault(require("nodemailer"));
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
const getTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#getTickets");
    try {
        const { categories_id } = req.body;
        const results = yield ticketSchema_1.default.find(categories_id ? { category_id: { $in: categories_id } } : undefined).populate("users", "name card_id");
        res.send(results);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getTickets = getTickets;
const approveTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#approveTicket");
    try {
        const { ticket } = req.body;
        const event = yield eventSchema_1.default.findOneAndUpdate({ "categories._id": ticket.category_id }, {
            $push: {
                "categories.$.teams": {
                    users: ticket.users,
                    captain: ticket.users[0],
                    name: ticket.name,
                },
            },
        });
        if (event) {
            // await deleteImage(ticket.public_id);
            yield ticketSchema_1.default.findOneAndDelete({ _id: ticket._id });
            const results = yield ticketSchema_1.default.find();
            let transporter = nodemailer_1.default.createTransport({
                service: "yahoo",
                auth: {
                    user: "norep.code@yahoo.com",
                    pass: "lgippxsozkcbrovy",
                },
            });
            const users = yield userSchema_1.default.find({ _id: { $in: ticket.users } }, { email: 1 });
            users.forEach((user) => {
                let mailOptions = {
                    from: "norep.code@yahoo.com",
                    to: user.email,
                    subject: `Haz sido admitido en el evento ${ticket.event.toUpperCase()}!`,
                    html: emailMsg(ticket.name, ticket.event, ticket.category, event._id.toString()),
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log("Email sent: " + info.response);
                    }
                });
            });
            res.send(results);
        }
        else
            res.status(404).json({ msg: "Evento no encontrado." });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.approveTicket = approveTicket;
const rejectTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#rejectTicket");
    try {
        const { ticket } = req.body;
        const result = yield ticketSchema_1.default.findOneAndDelete({ _id: ticket._id });
        if (result) {
            // await deleteImage(ticket.public_id);
            const results = yield ticketSchema_1.default.find();
            res.send(results);
        }
        else
            res.status(404).json({ msg: "Ticket no encontrado." });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.rejectTicket = rejectTicket;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (debug)
        console.log("#getUserInfo");
    try {
        const { _id } = req.query;
        const findUser = yield userSchema_1.default.findById(_id, { password: 0 });
        if (!findUser)
            res.status(404).json({ msg: "Usuario no encontrado." });
        res.send(findUser);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
exports.getUserInfo = getUserInfo;
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
//# sourceMappingURL=admin.js.map