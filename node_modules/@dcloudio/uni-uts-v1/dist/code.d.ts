import type { Param, TsInterfaceDeclaration } from '../types/types';
import type { SyncUniModulesFilePreprocessor } from './uni_modules';
export declare const enum FORMATS {
    ES = "es",
    CJS = "cjs"
}
export interface ClassMeta {
    typeParams?: boolean;
    interfaces: string[];
    keepAliveMethods: string[];
}
type Types = {
    interface: Record<string, {
        returned: boolean;
        decl: TsInterfaceDeclaration;
    }>;
    class: Record<string, ClassMeta>;
    fn: Record<string, Param[]>;
    alias: Record<string, {}>;
    uni?: string[];
};
interface Meta {
    typeParams: string[];
    exports: Record<string, {
        type: 'var' | 'function' | 'class' | 'interface';
        params?: Parameter[];
    }>;
    types: Record<string, 'function' | 'class' | 'interface' | 'typealias' | string[]>;
    components: string[];
    customElements: string[];
    android?: {
        typeParams: string[];
        types: Record<string, 'function' | 'class' | 'interface' | 'typealias' | string[]>;
    };
    ios?: {
        typeParams: string[];
        types: Record<string, 'function' | 'class' | 'interface' | 'typealias' | string[]>;
    };
}
export interface GenProxyCodeOptions {
    is_uni_modules: boolean;
    id: string;
    name: string;
    extname: string;
    namespace: string;
    androidComponents?: Record<string, string>;
    iosComponents?: Record<string, string>;
    customElements?: Record<string, string>;
    format?: FORMATS;
    inputDir?: string;
    pluginRelativeDir?: string;
    moduleName?: string;
    moduleType?: string;
    types?: Types;
    meta?: Meta;
    isExtApi?: boolean;
    androidHookClass?: string;
    iOSHookClass?: string;
    androidPreprocessor?: SyncUniModulesFilePreprocessor;
    iosPreprocessor?: SyncUniModulesFilePreprocessor;
}
export declare function genProxyCode(module: string, options: GenProxyCodeOptions): Promise<string>;
export declare function resolveRootIndex(module: string, options: GenProxyCodeOptions): string;
export declare function resolveRootInterface(module: string, options: GenProxyCodeOptions): string;
export declare function resolvePlatformIndexFilename(platform: 'app-android' | 'app-ios', module: string, options: GenProxyCodeOptions): string;
export declare function resolvePlatformIndex(platform: 'app-android' | 'app-ios', module: string, options: GenProxyCodeOptions): string;
/**
 * 解析接口文件中定义的类型信息
 * @param module
 * @param options
 * @returns
 */
export declare function parseInterfaceTypes(module: string, options: GenProxyCodeOptions, preprocessor?: SyncUniModulesFilePreprocessor): Promise<Types>;
interface Parameter {
    name: string;
    type: string;
    default?: string | number | boolean;
}
export declare function parseExportIdentifiers(fileName: string): Promise<string[]>;
export {};
