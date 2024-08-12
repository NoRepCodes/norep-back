"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var guest_routes_1 = __importDefault(require("./routes/guest.routes"));
var event_routes_1 = __importDefault(require("./routes/event.routes"));
var user_routes_1 = __importDefault(require("./routes/user.routes"));
//@ts-ignore
var cors_1 = __importDefault(require("cors"));
require("./db");
var app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use(express_1.default.json({ limit: '50mb' }));
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(event_routes_1.default);
app.use(user_routes_1.default);
app.use(guest_routes_1.default);
app.listen(process.env.PORT || 4000, function () {
    console.log('Server listen on port', 4000);
});
// TO DO ✅ ❌ ⏳ ❓
/**
 * Migrate everything to Ts: ⏳
 * - Event controller + router ✅
 * - - Create Event ✅
 * - - Update Event ✅
 * - - Delete Event ✅
 * -
 * - - Create Category ➰ Update Event
 * - - Update Category ➰ Update Event
 * - - Delete Category ➰ Update Event
 *
 * - - Create Wod ✅
 * - - Update Wod ✅
 * - - Delete Wod ⏳
 *
 * - - Create Team -- Evaluate if there is captain|gt > 1 user, to see if name? captain?
 * - - - - Check if there is users in other teams
 *
 * - - Update Team ❓
 * - - Delete Team ❓
 *
 * - - Create Result ✅
 * - - Update Result ✅
 * - - Delete Result
 *
 * - - Get User Records ⏳
 *
 *
 * - Guest controller + router ⏳
 * - User controller + router ✅
 *
 * - Event Types ✅
 * - User Types ✅
 *
 * -- SEE VERCEL USAGE AND TAKE ACTIONS
 * - REDUCE BANDWITH COMPRESSING IMAGES
 *
 * // {
//     "version": 2,
//     "builds": [
//       {
//         "src": "./index.js",
//         "use": "@vercel/node"
//       }
//     ],
//     "routes": [
//       {
//         "src": "/(.*)",
//         "dest": "/"
//       }
//     ]
// }
 */ 
