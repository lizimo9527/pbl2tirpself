import { checkAndroidVersionTips, runKotlinDev, runKotlinProd } from './kotlin';
import { checkIOSVersionTips, runSwiftDev, runSwiftProd } from './swift';
export declare function getCompiler(type: 'kotlin' | 'swift'): {
    runProd: typeof runSwiftProd;
    runDev: typeof runSwiftDev;
    checkVersionTips: typeof checkIOSVersionTips;
} | {
    runProd: typeof runKotlinProd;
    runDev: typeof runKotlinDev;
    checkVersionTips: typeof checkAndroidVersionTips;
};
