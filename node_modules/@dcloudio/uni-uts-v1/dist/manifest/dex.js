"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDexCacheFile = exports.restoreDex = exports.restoreDebuggerFiles = exports.storeIndexKt = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const utils_1 = require("../utils");
function dexName() {
    return 'classes.dex';
}
function storeIndexKt(kotlinFile, pluginRelativeDir, cacheDir) {
    const cacheFile = resolveIndexKtCacheFilename(pluginRelativeDir, cacheDir);
    if (cacheFile) {
        (0, fs_extra_1.copySync)(kotlinFile, cacheFile);
    }
}
exports.storeIndexKt = storeIndexKt;
function restoreDebuggerFiles(pluginRelativeDir, cacheDir, outputDir, is_uni_modules, inputDir, rewriteConsoleExpr) {
    const cacheFile = resolveIndexKtCacheFile(pluginRelativeDir, cacheDir);
    if (cacheFile) {
        let filename = (0, path_1.join)(outputDir, pluginRelativeDir, is_uni_modules ? 'utssdk' : '', 'app-android', 'index.kt');
        (0, fs_extra_1.copySync)(cacheFile, filename);
        if (rewriteConsoleExpr) {
            (0, utils_1.copyPlatformNativeLanguageFiles)((0, path_1.resolve)(inputDir, pluginRelativeDir, 'utssdk', 'app-android'), (0, path_1.resolve)(outputDir, pluginRelativeDir, 'utssdk', 'app-android'), ['.kt', '.java'], rewriteConsoleExpr);
        }
        return filename;
    }
}
exports.restoreDebuggerFiles = restoreDebuggerFiles;
function restoreDex(pluginRelativeDir, cacheDir, outputDir, is_uni_modules) {
    const cacheFile = resolveDexCacheFile(pluginRelativeDir, cacheDir);
    if (cacheFile) {
        let filename = (0, path_1.join)(outputDir, pluginRelativeDir, is_uni_modules ? 'utssdk' : '', 'app-android', dexName());
        (0, fs_extra_1.copySync)(cacheFile, filename);
        return filename;
    }
}
exports.restoreDex = restoreDex;
function resolveCacheFilename(pluginRelativeDir, cacheDir, filename) {
    return (0, path_1.join)(cacheDir, 'app-android', 'uts', pluginRelativeDir, filename);
}
function resolveDexCacheFilename(pluginRelativeDir, cacheDir) {
    return resolveCacheFilename(pluginRelativeDir, cacheDir, dexName());
}
function resolveIndexKtCacheFilename(pluginRelativeDir, cacheDir) {
    return resolveCacheFilename(pluginRelativeDir, cacheDir, 'index.kt');
}
function resolveDexCacheFile(pluginRelativeDir, cacheDir) {
    if (cacheDir) {
        const file = resolveDexCacheFilename(pluginRelativeDir, cacheDir);
        return ((0, fs_extra_1.existsSync)(file) && file) || '';
    }
    return '';
}
exports.resolveDexCacheFile = resolveDexCacheFile;
function resolveIndexKtCacheFile(pluginRelativeDir, cacheDir) {
    if (cacheDir) {
        const file = resolveIndexKtCacheFilename(pluginRelativeDir, cacheDir);
        return ((0, fs_extra_1.existsSync)(file) && file) || '';
    }
    return '';
}
