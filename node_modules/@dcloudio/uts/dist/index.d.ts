import { type UTSBundleOptions, type UTSResult, UTSTarget } from './types';
export { UTSTarget, UTSResult, UTSBundleOptions, UTSInputOptions, UTSOutputOptions, UTSParseOptions, } from './types';
export type UTSMode = 'dev' | 'build';
export declare const UTSTargetExtNames: {
    readonly kotlin: "kt";
    readonly swift: "swift";
    readonly arkts: "ets";
};
export interface ToOptions {
    /**
     * 为 true 时，禁用日志输出，默认为 false
     */
    silent?: boolean;
    input: {
        /**
         * 插件根目录
         */
        dir: string;
        /**
         * 文件后缀，默认 .uts
         */
        extname?: string;
    };
    output: {
        /**
         * 输出目录
         */
        dir: string;
        /**
         * 包名
         */
        package?: string;
        /**
         * 自动导入的包
         */
        imports?: string[];
        /**
         * 是否生成 sourceMap，为 string 时，表示生成的 sourceMap 目标目录
         */
        sourceMap?: boolean | string;
        /**
         * sourceMap 中是否包含源码
         */
        inlineSourcesContent?: boolean;
        extname?: string;
    };
}
export { parse, toArkTS, toKotlin, toSwift, bundleArkTS, bundleKotlin, bundleSwift, } from './api';
export declare function bundle(target: UTSTarget, opts: UTSBundleOptions): Promise<UTSResult>;
