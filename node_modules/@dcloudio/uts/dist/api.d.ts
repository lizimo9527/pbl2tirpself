import type { UTSBundleOptions, UTSOptions, UTSParseOptions, UTSResult } from './types';
export declare function parse(source: string, options?: UTSParseOptions): Promise<any>;
export declare function toKotlin(options: UTSOptions): Promise<UTSResult>;
export declare function bundleKotlin(options: UTSBundleOptions): Promise<UTSResult>;
export declare function toSwift(options: UTSOptions): Promise<UTSResult>;
export declare function bundleSwift(options: UTSBundleOptions): Promise<UTSResult>;
export declare function toArkTS(options: UTSOptions): Promise<UTSResult>;
export declare function bundleArkTS(options: UTSBundleOptions): Promise<UTSResult>;
