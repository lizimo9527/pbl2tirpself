"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePath = exports.isWindows = void 0;
const os_1 = __importDefault(require("os"));
exports.isWindows = os_1.default.platform() === 'win32';
function normalizePath(id) {
    return exports.isWindows ? id.replace(/\\/g, '/') : id;
}
exports.normalizePath = normalizePath;
