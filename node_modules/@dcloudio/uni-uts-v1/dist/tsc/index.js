"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeScript = exports.emitDeclaration = exports.createUniXCompiler = exports.uts2js = void 0;
var javascript_1 = require("./javascript");
Object.defineProperty(exports, "uts2js", { enumerable: true, get: function () { return javascript_1.uts2js; } });
var compiler_1 = require("./compiler");
Object.defineProperty(exports, "createUniXCompiler", { enumerable: true, get: function () { return compiler_1.createUniXCompiler; } });
function emitDeclaration(options) {
    return require('../../lib/uts').emitDeclaration({
        typescript: require('../../lib/typescript'),
        ...options,
    });
}
exports.emitDeclaration = emitDeclaration;
function getTypeScript() {
    return require('../../lib/typescript');
}
exports.getTypeScript = getTypeScript;
