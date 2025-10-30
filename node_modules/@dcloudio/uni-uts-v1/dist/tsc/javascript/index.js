"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uts2js = void 0;
const shared_1 = require("@vue/shared");
const options_1 = require("../utils/options");
const uts2js = (options) => {
    (0, shared_1.extend)(options, (0, options_1.createBasicUtsOptions)(options.inputDir, !!options.sourceMap));
    (0, shared_1.extend)(options.tsconfigOverride.compilerOptions, {
        downlevelIteration: true,
    });
    if ((0, shared_1.isFunction)(globalThis.uts2js)) {
        return globalThis.uts2js(options);
    }
    return require('../../../lib/javascript').uts2js(options);
};
exports.uts2js = uts2js;
