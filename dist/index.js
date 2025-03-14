"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const guest_routes_1 = __importDefault(require("./routes/guest.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
//@ts-ignore
const cors_1 = __importDefault(require("cors"));
require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use(express_1.default.json({ limit: '50mb' }));
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(event_routes_1.default);
app.use(user_routes_1.default);
app.use(guest_routes_1.default);
app.use(admin_routes_1.default);
app.listen(process.env.PORT || 4000, () => {
    console.log('Server listen on port', 4000);
});
// TO DO ✅ ❌ ⏳ ❓
/**
{
  "name": "name",
  "email": "youarelazy@empty.com",
  "shirt": "S",
  "birth": "1990-01-01",
  "password": "_",
  "card_id": "00000000",
  "phone": "00000000000",
  "genre": "Femenino",
  "location": {
    "country": "_",
    "state": "_",
    "city": "_ "
  },
  "box": "_"
}

 */ 
//# sourceMappingURL=index.js.map