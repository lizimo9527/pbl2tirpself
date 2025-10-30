import { type RunDevOptions, type RunProdOptions, type ToSwiftOptions } from './utils';
import type { UTSResult } from '@dcloudio/uts';
export declare function runSwiftProd(filename: string, { components, customElements, uniModuleId, isPlugin, isModule, isX, isSingleThread, isExtApi, extApis, transform, sourceMap, hookClass, uniModules, }: RunProdOptions): Promise<void>;
export type RunSwiftDevResult = UTSResult & {
    type: 'swift';
    code: number;
    msg: string;
    changed: string[];
};
export declare function runSwiftDev(filename: string, { components, customElements, isX, isSingleThread, isPlugin, isExtApi, extApis, transform, sourceMap, uniModules, rewriteConsoleExpr, }: RunDevOptions): Promise<RunSwiftDevResult | undefined>;
export declare function compile(filename: string, { inputDir, outputDir, sourceMap, components, customElements, isX, isSingleThread, isPlugin, isExtApi, extApis, transform, uniModules, }: ToSwiftOptions): Promise<UTSResult | undefined>;
export declare function resolveIOSDepFiles(filename: string): string[];
export declare function checkIOSVersionTips(pluginId: string, pluginDir: string, is_uni_modules: boolean): string | undefined;
