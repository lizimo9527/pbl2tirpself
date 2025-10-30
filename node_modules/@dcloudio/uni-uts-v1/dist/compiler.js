"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompiler = void 0;
const kotlin_1 = require("./kotlin");
const swift_1 = require("./swift");
function getCompiler(type) {
    if (type === 'swift') {
        return {
            runProd: swift_1.runSwiftProd,
            runDev: swift_1.runSwiftDev,
            checkVersionTips: swift_1.checkIOSVersionTips,
        };
    }
    return {
        runProd: kotlin_1.runKotlinProd,
        runDev: kotlin_1.runKotlinDev,
        checkVersionTips: kotlin_1.checkAndroidVersionTips,
    };
}
exports.getCompiler = getCompiler;
