"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBasicUtsOptions = void 0;
const path = __importStar(require("path"));
const shared_1 = require("@vue/shared");
const shared_2 = require("../../shared");
function createTsConfigPaths(pluginPath, cliVitePath, virtualModulesMap) {
    const virtualPaths = {};
    if (Array.isArray(virtualModulesMap)) {
        virtualModulesMap.forEach((module) => {
            virtualPaths['@dcloudio/virtual-modules/' + module] = [
                path.resolve(pluginPath, module),
            ];
        });
    }
    else {
        Object.keys(virtualModulesMap).forEach((module) => {
            virtualPaths['@dcloudio/virtual-modules/' + module] = [
                path.resolve(pluginPath, virtualModulesMap[module]),
            ];
        });
    }
    return {
        '@dcloudio/uni-app': [
            path.resolve(__dirname, '../../../lib/tsconfig/types/dcloudio__uni-app'),
        ],
        '@vue/runtime-core': [
            path.resolve(cliVitePath, 'node_modules/@vue/runtime-core'),
        ],
        vue: [path.resolve(cliVitePath, 'node_modules/@vue/runtime-core')],
        vuex: [path.resolve(cliVitePath, 'node_modules/vuex')],
        ...virtualPaths,
    };
}
function createBasicUtsOptions(inputDir, sourceMap) {
    const isWeb = process.env.UNI_UTS_PLATFORM === 'web';
    const isInHBuilderXBool = (0, shared_2.isInHBuilderX)();
    const isUTSCloudCompilerBool = (0, shared_2.isUTSCloudCompiler)();
    const isBuildExtApi = process.env.UNI_COMPILE_TARGET === 'ext-api' &&
        process.env.UNI_APP_NEXT_WORKSPACE;
    const options = {
        cwd: inputDir,
        check: isWeb,
        noCache: 
        // modules 模式不使用缓存
        process.env.UNI_COMPILE_TARGET === 'uni_modules' ||
            process.env.UNI_COMPILE_TARGET === 'ext-api' ||
            process.env.NODE_ENV === 'production' ||
            isWeb,
        tsconfigOverride: {
            compilerOptions: {
                rootDir: inputDir,
                sourceMap,
                ignoreDeprecations: '5.0',
                preserveValueImports: true,
                importsNotUsedAsValues: 'preserve',
                verbatimModuleSyntax: false,
            },
        },
    };
    if (!options.tsconfig) {
        if (isInHBuilderXBool || isUTSCloudCompilerBool || isBuildExtApi) {
            options.tsconfig = path.resolve(__dirname, '../../../lib/tsconfig/tsconfig.json');
        }
        else {
            options.tsconfig = path.resolve(process.cwd(), 'tsconfig.json');
        }
    }
    if (!options.typescript) {
        options.typescript = require('../../../lib/typescript');
    }
    if (isBuildExtApi) {
        const pluginPath = path.resolve(process.env.UNI_APP_NEXT_WORKSPACE, '../');
        const cliVitePath = path.resolve(pluginPath, 'uniapp-cli-vite/macosx/uniapp-cli-vite');
        const virtualModules = {
            'uniapp-cli-vite/node_modules/vite/client': path.resolve(cliVitePath, 'node_modules/vite/client.d.ts'),
            'hbuilderx-language-services/builtin-dts/uts-types/common/index.d.ts': 'syntaxdoc/uts/common/index.d.ts',
            'hbuilderx-language-services/builtin-dts/common/HBuilderX.d.ts': 'syntaxdoc/specialString/specialString.d.ts',
            'hbuilderx-language-services/builtin-dts/uniappx/node_modules/@dcloudio/uni-app-x/types/index.d.ts': 'syntaxdoc/uni-app-x/types/index.d.ts',
        };
        (0, shared_1.extend)(options.tsconfigOverride.compilerOptions, {
            paths: createTsConfigPaths(pluginPath, cliVitePath, virtualModules),
            typeRoots: [path.resolve(__dirname, '../../../lib/tsconfig/types')],
        });
    }
    else if (isInHBuilderXBool || isUTSCloudCompilerBool) {
        const pluginPath = isInHBuilderXBool
            ? process.env.UNI_HBUILDERX_PLUGINS
            : path.resolve(process.cwd(), '../');
        const cliVitePath = path.resolve(pluginPath, 'uniapp-cli-vite');
        const virtualModules = [
            'uniapp-cli-vite/node_modules/vite/client',
            'hbuilderx-language-services/builtin-dts/uts-types/common/index.d.ts',
            'hbuilderx-language-services/builtin-dts/common/HBuilderX.d.ts',
            'hbuilderx-language-services/builtin-dts/uniappx/node_modules/@dcloudio/uni-app-x/types/index.d.ts',
        ];
        (0, shared_1.extend)(options.tsconfigOverride.compilerOptions, {
            paths: createTsConfigPaths(pluginPath, cliVitePath, virtualModules),
            typeRoots: [path.resolve(__dirname, '../../../lib/tsconfig/types')],
        });
    }
    else {
        (0, shared_1.extend)(options.tsconfigOverride.compilerOptions, {
            paths: {
                vue: [path.resolve(inputDir, '../node_modules/@vue/runtime-core')],
            },
            typeRoots: [path.resolve(__dirname, '../../../lib/tsconfig/types')],
        });
    }
    return options;
}
exports.createBasicUtsOptions = createBasicUtsOptions;
