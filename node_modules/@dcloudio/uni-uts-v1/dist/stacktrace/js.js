"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processErrorLines = exports.parseUTSJavaScriptRuntimeStacktrace = void 0;
const sourceMap_1 = require("../sourceMap");
const utils_1 = require("./utils");
// app-ios app-service.js(4:56) ReferenceError:Can't find variable: a @app-service.js:4:56
const APP_IOS_JS_ERROR_RE = /\(\d+:\d+\)\s(.*)\s@([^\s]+\.js)\:(\d+)\:(\d+)/;
// onLoad@app-service.js:9:64
const APP_IOS_VUE_ERROR_RE = /@([^\s]+\.js)\:(\d+)\:(\d+)/;
// app-harmony aaa\n    at testArr (entry/src/main/resources/resfile/uni-app-x/apps/HBuilder/www/app-service.js:530:15)
const APP_HARMONY_JS_ERROR_RE = /(.*?)\s*at\s+(?:.*?)\s+\(.*?\/www\/(.*?\.js):(\d+):(\d+)\)/;
function parseUTSJavaScriptRuntimeStacktrace(stacktrace, options) {
    // 兼容旧版本
    if (!options.platform) {
        options.platform = 'app-ios';
    }
    const res = [];
    const lines = stacktrace.split(utils_1.splitRE);
    const sourceMapDir = (0, utils_1.resolveSourceMapDirByCacheDir)(options.cacheDir);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let codes = parseUTSJavaScriptRuntimeStacktraceJsErrorLine(options.platform === 'app-harmony'
            ? APP_HARMONY_JS_ERROR_RE
            : APP_IOS_JS_ERROR_RE, line, sourceMapDir);
        if (codes.length) {
            const color = options.logType
                ? utils_1.COLORS[options.logType] || ''
                : '';
            const [errorCode, ...other] = options.platform === 'app-harmony' ? res.concat(codes) : codes;
            const mark = options.platform === 'app-ios'
                ? errorCode.includes('[EXCEPTION] ')
                    ? ''
                    : '[EXCEPTION] '
                : '';
            let error = `error: ${mark}` + errorCode;
            if (color) {
                error = color + error + color;
            }
            return [error, ...other].join('\n');
        }
        if (options.platform === 'app-ios') {
            codes = parseUTSJavaScriptRuntimeStacktraceVueErrorLine(line, sourceMapDir);
        }
        if (codes.length && res.length) {
            const color = options.logType
                ? utils_1.COLORS[options.logType] || ''
                : '';
            let error = `error: ${res[0].includes('[EXCEPTION] ') ? '' : '[EXCEPTION] '}` +
                res[0];
            if (color) {
                error = color + error + color;
            }
            const [, ...other] = res;
            const otherCodes = other.map((item) => {
                if (color) {
                    return color + item + color;
                }
                return item;
            });
            return [error, ...otherCodes, ...codes].join('\n');
        }
        res.push(line);
    }
    return '';
}
exports.parseUTSJavaScriptRuntimeStacktrace = parseUTSJavaScriptRuntimeStacktrace;
// at <Index __pageId=1 __pagePath="pages/index/index" __pageQuery=  ... >
// Can't find variable: a
// onLoad@app-service.js:9:64
// callWithErrorHandling@uni-app-x-framework.js:2279:23
function parseUTSJavaScriptRuntimeStacktraceVueErrorLine(lineStr, sourceMapDir) {
    const lines = [];
    const matches = lineStr.match(APP_IOS_VUE_ERROR_RE);
    if (!matches) {
        return lines;
    }
    const [, filename, line] = matches;
    const sourceMapFile = (0, utils_1.resolveSourceMapFileBySourceFile)(filename, sourceMapDir);
    if (!sourceMapFile) {
        return lines;
    }
    const originalPosition = (0, sourceMap_1.originalPositionForSync)({
        sourceMapFile,
        line: parseInt(line),
        column: 0,
        withSourceContent: true,
    });
    if (originalPosition.source && originalPosition.sourceContent) {
        lines.push(`at ${(0, utils_1.parseRelativeSourceFile)(originalPosition.source.split('?')[0], originalPosition.sourceRoot)}:${originalPosition.line}:${originalPosition.column}`);
        if (originalPosition.line !== null && originalPosition.column !== null) {
            const { start, end } = (0, utils_1.lineColumnToStartEnd)(originalPosition.sourceContent, originalPosition.line, originalPosition.column);
            lines.push((0, utils_1.generateCodeFrame)(originalPosition.sourceContent, start, end).replace(/\t/g, ' '));
        }
    }
    return lines;
}
function parseUTSJavaScriptRuntimeStacktraceJsErrorLine(re, lineStr, sourceMapDir) {
    const lines = [];
    const matches = lineStr.match(re);
    if (!matches) {
        return lines;
    }
    const [, error, filename, line] = matches;
    const sourceMapFile = (0, utils_1.resolveSourceMapFileBySourceFile)(filename, sourceMapDir);
    if (!sourceMapFile) {
        return lines;
    }
    processErrorLines(error, sourceMapFile, parseInt(line), lines);
    return lines;
}
function processErrorLines(error, sourceMapFile, line, lines, withSourceContent = true) {
    const originalPosition = (0, sourceMap_1.originalPositionForSync)({
        sourceMapFile,
        line,
        column: 0,
        withSourceContent,
    });
    if (originalPosition.source) {
        if (error) {
            lines.push(error);
        }
        lines.push(`at ${(0, utils_1.parseRelativeSourceFile)(originalPosition.source.split('?')[0], originalPosition.sourceRoot)}:${originalPosition.line}:${originalPosition.column}`);
        if (originalPosition.sourceContent &&
            originalPosition.line !== null &&
            originalPosition.column !== null) {
            const { start, end } = (0, utils_1.lineColumnToStartEnd)(originalPosition.sourceContent, originalPosition.line, originalPosition.column);
            lines.push((0, utils_1.generateCodeFrame)(originalPosition.sourceContent, start, end).replace(/\t/g, ' '));
        }
    }
}
exports.processErrorLines = processErrorLines;
