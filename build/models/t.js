"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var objId = mongoose_1.SchemaTypes.ObjectId;
// const wodRes = new Schema({
//     amount_type: { type: String, required: true },
//     time: Number,
//     tiebrake: Number,
//     penalty: Number,
//     amount: {
//         type: SchemaTypes.Decimal128,
//         defautl: 0,
//         get: getDec
//     },
//     id: false,
// }, { toJSON: { getters: true } })
var TeamSchema = new mongoose_1.Schema({
    name: String,
    category_id: String,
    event_id: String,
    box: String,
    wods: []
}, {
    toJSON: { getters: true },
    timestamps: true,
});
function getDec(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString());
    }
    return value;
}
;
exports.default = (0, mongoose_1.model)('Team', TeamSchema);
