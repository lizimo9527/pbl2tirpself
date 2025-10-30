export declare function storeIndexKt(kotlinFile: string, pluginRelativeDir: string, cacheDir: string): void;
export declare function restoreDebuggerFiles(pluginRelativeDir: string, cacheDir: string, outputDir: string, is_uni_modules: boolean, inputDir: string, rewriteConsoleExpr?: (fileName: string, content: string) => string): string | undefined;
export declare function restoreDex(pluginRelativeDir: string, cacheDir: string, outputDir: string, is_uni_modules: boolean): string | undefined;
export declare function resolveDexCacheFile(pluginRelativeDir: string, cacheDir: string): string;
