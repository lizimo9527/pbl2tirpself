import type * as tsTypes from 'typescript';
export interface UTS2JavaScriptBaseOptions {
    cwd: string;
    check: boolean;
    noCache: boolean;
    tsconfig: string;
    typescript: typeof tsTypes;
    tsconfigOverride: any;
}
export declare function createBasicUtsOptions(inputDir: string, sourceMap: boolean): UTS2JavaScriptBaseOptions;
