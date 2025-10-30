import { type GenerateRuntimeCodeFrameOptions } from './utils';
export interface GenerateJavaScriptRuntimeCodeFrameOptions extends GenerateRuntimeCodeFrameOptions {
    platform: 'app-ios' | 'app-harmony';
    language: 'javascript';
}
export interface GenerateAppIOSJavaScriptRuntimeCodeFrameOptions extends GenerateJavaScriptRuntimeCodeFrameOptions {
    platform: 'app-ios';
}
export interface GenerateAppHarmonyJavaScriptRuntimeCodeFrameOptions extends GenerateJavaScriptRuntimeCodeFrameOptions {
    platform: 'app-harmony';
}
export declare function parseUTSJavaScriptRuntimeStacktrace(stacktrace: string, options: GenerateJavaScriptRuntimeCodeFrameOptions): string;
export declare function processErrorLines(error: string, sourceMapFile: string, line: number, lines: string[], withSourceContent?: boolean): void;
