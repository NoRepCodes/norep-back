"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyBody = (body, validation) => {
    const keys = Object.keys(body);
    let isWrong = false;
    // console.log(keys);
    keys.forEach((k) => {
        if (!validation.includes(k))
            isWrong = k;
    });
    if (isWrong)
        throw new Error(`Campos Invalidos ${isWrong}`);
};
exports.default = verifyBody;
//# sourceMappingURL=verifyBody.js.map