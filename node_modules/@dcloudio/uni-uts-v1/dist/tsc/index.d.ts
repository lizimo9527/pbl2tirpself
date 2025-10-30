import type { CompilerOptions, EmitResult } from 'typescript';
export { uts2js } from './javascript';
export { createUniXCompiler, type UniXCompiler } from './compiler';
export interface UTSEmitDeclarationOptions {
    typescript?: typeof import('typescript');
    inputDir: string;
    rootFiles: string[];
    compilerOptions?: CompilerOptions;
}
export declare function emitDeclaration(options: UTSEmitDeclarationOptions): EmitResult;
export declare function getTypeScript(): any;
