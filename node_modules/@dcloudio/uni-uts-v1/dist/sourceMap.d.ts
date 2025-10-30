import { type NullableMappedPosition, type NullablePosition } from 'source-map';
import { type MappedPosition } from 'source-map-js';
export declare function resolveUTSSourceMapFile(target: 'kotlin', // | 'swift',
filename: string, inputDir: string, outputDir: string, cacheDir?: string): string;
export declare function resolveUTSPluginSourceMapFile(target: 'kotlin' | 'swift' | 'arkts', filename: string, inputDir: string, outputDir: string): string;
export declare const resolveUtsPluginSourceMapFile: typeof resolveUTSPluginSourceMapFile;
interface PositionFor {
    sourceMapFile: string;
    filename: string;
    line: number;
    column: number;
    withSourceContent?: boolean;
}
/**
 * 根据源码文件名、行号、列号，返回生成后文件、行号、列号（根据 uts 文件返回 kt|swift 文件）
 * @param originalPosition
 * @returns
 */
export declare function generatedPositionFor({ sourceMapFile, filename, line, column, outputDir, platform, }: PositionFor & {
    outputDir?: string;
    platform?: 'app-harmony' | 'app' | 'app-android' | 'app-ios';
}): Promise<NullablePosition & {
    source: string | null;
    relativeSource: string | null;
}>;
/**
 * 根据生成后的文件名、行号、列号，返回源码文件、行号、列号（根据 kt|swift 文件返回 uts 文件）
 * @param generatedPosition
 * @returns
 */
export declare function originalPositionFor(generatedPosition: Omit<PositionFor, 'filename'> & {
    inputDir?: string;
}): Promise<NullableMappedPosition & {
    sourceContent?: string;
}>;
/**
 * 根据生成后的文件名、行号、列号，返回源码文件、行号、列号（根据 kt|swift 文件返回 uts 文件）
 * 同步API
 * @param generatedPosition
 * @returns
 */
export declare function originalPositionForSync(generatedPosition: Omit<PositionFor, 'filename'> & {
    inputDir?: string;
}): MappedPosition & {
    sourceContent?: string;
    sourceRoot?: string | null;
};
export {};
