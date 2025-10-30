import { type GenerateRuntimeCodeFrameOptions } from './utils';
export interface GenerateMiniProgramRuntimeCodeFrameOptions extends GenerateRuntimeCodeFrameOptions {
    outputDir: string;
    platform: 'mp-weixin' | 'mp-baidu' | 'mp-alipay' | 'mp-toutiao';
    language: 'javascript';
}
interface SourceMapPlatformOptions {
    parseFileNameAndLine(lineStr: string): {
        fileName: string;
        line: number;
    } | undefined;
    sourceMapType: 'base64' | 'url' | 'json';
    sourceMapFileNameRe: RegExp;
    fetchHeaders?: Record<string, string>;
    needsSecondaryMapping?: boolean;
    resolveAtSourceFileName?: (sourceFileName: string, sourceMapDir: string, stacktraceFileName: string) => string;
    resolveUrl?: (url: string) => string;
}
export declare const MP_PLATFORMS: Record<string, SourceMapPlatformOptions>;
export declare function parseMiniProgramRuntimeStacktrace(stacktrace: string, options: GenerateMiniProgramRuntimeCodeFrameOptions): Promise<string>;
export declare function parseMiniProgramRuntimeStacktraceLine(options: SourceMapPlatformOptions, error: string, lineStr: string, sourceMapDir: string): Promise<string[]>;
export {};
