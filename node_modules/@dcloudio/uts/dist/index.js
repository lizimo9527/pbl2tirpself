"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundle = exports.bundleSwift = exports.bundleKotlin = exports.bundleArkTS = exports.toSwift = exports.toKotlin = exports.toArkTS = exports.parse = exports.UTSTargetExtNames = exports.UTSTarget = void 0;
const api_1 = require("./api");
const types_1 = require("./types");
var types_2 = require("./types");
Object.defineProperty(exports, "UTSTarget", { enumerable: true, get: function () { return types_2.UTSTarget; } });
exports.UTSTargetExtNames = {
    [types_1.UTSTarget.KOTLIN]: 'kt',
    [types_1.UTSTarget.SWIFT]: 'swift',
    [types_1.UTSTarget.ARKTS]: 'ets',
};
var api_2 = require("./api");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return api_2.parse; } });
Object.defineProperty(exports, "toArkTS", { enumerable: true, get: function () { return api_2.toArkTS; } });
Object.defineProperty(exports, "toKotlin", { enumerable: true, get: function () { return api_2.toKotlin; } });
Object.defineProperty(exports, "toSwift", { enumerable: true, get: function () { return api_2.toSwift; } });
Object.defineProperty(exports, "bundleArkTS", { enumerable: true, get: function () { return api_2.bundleArkTS; } });
Object.defineProperty(exports, "bundleKotlin", { enumerable: true, get: function () { return api_2.bundleKotlin; } });
Object.defineProperty(exports, "bundleSwift", { enumerable: true, get: function () { return api_2.bundleSwift; } });
function bundle(target, opts) {
    if (target === types_1.UTSTarget.KOTLIN) {
        return (0, api_1.bundleKotlin)(opts);
    }
    else if (target === types_1.UTSTarget.SWIFT) {
        return (0, api_1.bundleSwift)(opts);
    }
    else if (target === types_1.UTSTarget.ARKTS) {
        return (0, api_1.bundleArkTS)(opts);
    }
    return Promise.resolve({});
}
exports.bundle = bundle;
