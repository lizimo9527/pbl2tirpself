"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModule = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
function isModule(pluginDir) {
    return fs_extra_1.default.existsSync(path_1.default.resolve(pluginDir, 'index.module.uts'));
}
exports.isModule = isModule;
