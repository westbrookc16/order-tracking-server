"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json = void 0;
const json = (param) => {
    return JSON.stringify(param, (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    );
};
exports.json = json;
