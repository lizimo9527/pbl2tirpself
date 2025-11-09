// 地图定位准确性测试工具
// 用于验证create.vue页面地图定位功能的准确性

const testLocationService = require('./services/location.service.js');
const mapConfig = require('./config/map.config.js');

// 测试地点名称列表
const testLocations = [
    '故宫博物院',
    '天安门广场', 
    '颐和园',
    '长城',
    '前门大街',
    '国家体育场',
    '南锣鼓巷',
    '什刹海',
    '798艺术区'
];

/**
 * 测试单个地点的定位准确性
 * @param {string} locationName - 地点名称
 * @returns {Promise<Object>} 测试结果
 */
async function testLocationAccuracy(locationName) {
    console.log(`\n=== 测试地点: ${locationName} ===`);
    
    try {
        const startTime = Date.now();
        
        // 调用地点服务获取坐标
        const result = await testLocationService.getCoordinatesByName(locationName);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`定位耗时: ${duration}ms`);
        console.log(`坐标精度: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`经度: ${result.longitude.toFixed(6)}`);
        console.log(`纬度: ${result.latitude.toFixed(6)}`);
        console.log(`地址: ${result.address}`);
        console.log(`数据来源: ${result.source}`);
        
        // 验证坐标精度
        const isHighPrecision = result.confidence > 0.7;
        console.log(`定位精度: ${isHighPrecision ? '高精度' : '普通精度'}`);
        
        return {
            location: locationName,
            success: true,
            accuracy: result.confidence,
            precision: isHighPrecision ? 'high' : 'normal',
            coordinates: {
                longitude: result.longitude,
                latitude: result.latitude
            },
            duration: duration,
            source: result.source
        };
        
    } catch (error) {
        console.error(`定位失败: ${error.message}`);
        
        return {
            location: locationName,
            success: false,
            error: error.message,
            accuracy: 0
        };
    }
}

/**
 * 批量测试地点定位准确性
 */
async function runBatchTests() {
    console.log('=== 开始地图定位准确性测试 ===');
    console.log(`测试地点数量: ${testLocations.length}`);
    console.log('================================');
    
    const results = [];
    let successCount = 0;
    let highPrecisionCount = 0;
    let totalDuration = 0;
    
    // 顺序测试每个地点
    for (const location of testLocations) {
        const result = await testLocationAccuracy(location);
        results.push(result);
        
        if (result.success) {
            successCount++;
            totalDuration += result.duration;
            
            if (result.precision === 'high') {
                highPrecisionCount++;
            }
        }
        
        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 输出测试总结
    console.log('\n=== 测试总结 ===');
    console.log(`总测试地点数: ${testLocations.length}`);
    console.log(`成功定位数: ${successCount}`);
    console.log(`定位成功率: ${((successCount / testLocations.length) * 100).toFixed(1)}%`);
    console.log(`高精度定位数: ${highPrecisionCount}`);
    console.log(`高精度比例: ${((highPrecisionCount / successCount) * 100).toFixed(1)}%`);
    
    if (successCount > 0) {
        console.log(`平均定位耗时: ${(totalDuration / successCount).toFixed(0)}ms`);
    }
    
    // 显示API密钥状态
    console.log(`地图API密钥: ${mapConfig.key ? '已配置' : '未配置'}`);
    
    return results;
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    runBatchTests().catch(error => {
        console.error('测试执行失败:', error);
        process.exit(1);
    });
}

module.exports = {
    testLocationAccuracy,
    runBatchTests,
    testLocations
};