"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var AdminSchema = new mongoose_1.Schema({
    username: String,
    password: String,
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Admin', AdminSchema);
