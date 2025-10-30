-- TripSelf 数据库初始化脚本 - 可直接在Supabase SQL编辑器中执行
-- 此脚本包含完整的数据库表结构和示例数据

-- 1. 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建攻略表
CREATE TABLE IF NOT EXISTS travel_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    destination VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2) DEFAULT 0,
    travel_style VARCHAR(50), -- 旅行风格：特种兵式、拍照打卡式、细品慢游式、文化探索式
    cover_image VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, completed
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建行程天表
CREATE TABLE IF NOT EXISTS plan_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES travel_plans(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date DATE,
    title VARCHAR(200),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建行程项表
CREATE TABLE IF NOT EXISTS plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID REFERENCES plan_days(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 景点、餐饮、住宿、交通、购物、娱乐
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    start_time TIME,
    end_time TIME,
    cost DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建预算项表
CREATE TABLE IF NOT EXISTS budget_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES travel_plans(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 交通、住宿、餐饮、门票、购物、其他
    item_name VARCHAR(200) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建攻略模板表
CREATE TABLE IF NOT EXISTS plan_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    destination VARCHAR(100),
    travel_style VARCHAR(50),
    duration_days INTEGER DEFAULT 1,
    cover_image VARCHAR(500),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 创建模板行程项表
CREATE TABLE IF NOT EXISTS template_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES plan_templates(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    start_time TIME,
    end_time TIME,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_travel_plans_user_id ON travel_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_plans_status ON travel_plans(status);
CREATE INDEX IF NOT EXISTS idx_plan_days_plan_id ON plan_days(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_items_day_id ON plan_items(day_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_plan_id ON budget_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_template_items_template_id ON template_items(template_id);

-- 9. 插入示例模板数据
INSERT INTO plan_templates (title, description, destination, travel_style, duration_days, is_public) VALUES
('北京三日文化游', '深度体验北京历史文化，适合文化探索式旅行', '北京', '文化探索式', 3, true),
('上海都市休闲游', '现代都市休闲体验，适合细品慢游式旅行', '上海', '细品慢游式', 2, true),
('成都美食之旅', '品尝地道川菜美食，适合拍照打卡式旅行', '成都', '拍照打卡式', 3, true),
('西安历史探索', '探索古都历史文化，适合特种兵式旅行', '西安', '特种兵式', 4, true),
('河北文化深度游', '探索燕赵文化，感受千年历史底蕴', '河北', '文化探索式', 5, true),
('长城精华之旅', '从山海关到金山岭，领略长城雄伟', '河北', '特种兵式', 4, true),
('坝上草原风光游', '驰骋草原，感受塞外风情', '河北', '细品慢游式', 3, true),
('皇家园林休闲游', '承德避暑山庄，体验皇家园林艺术', '河北', '拍照打卡式', 2, true);

-- 10. 插入模板行程项示例
INSERT INTO template_items (template_id, day_number, item_type, title, description, location, start_time, end_time, order_index) VALUES
((SELECT id FROM plan_templates WHERE title = '北京三日文化游'), 1, '景点', '故宫博物院', '参观明清皇宫建筑群', '北京市东城区景山前街4号', '09:00', '12:00', 1),
((SELECT id FROM plan_templates WHERE title = '北京三日文化游'), 1, '餐饮', '全聚德烤鸭', '品尝北京特色烤鸭', '北京市东城区前门大街30号', '12:30', '14:00', 2),
((SELECT id FROM plan_templates WHERE title = '北京三日文化游'), 1, '景点', '天坛公园', '参观古代祭天建筑', '北京市东城区天坛东里甲1号', '14:30', '17:00', 3),
((SELECT id FROM plan_templates WHERE title = '北京三日文化游'), 2, '景点', '八达岭长城', '登长城做好汉', '北京市延庆区八达岭镇', '08:00', '12:00', 1),
((SELECT id FROM plan_templates WHERE title = '北京三日文化游'), 2, '景点', '颐和园', '游览皇家园林', '北京市海淀区新建宫门路19号', '14:00', '17:00', 2),
((SELECT id FROM plan_templates WHERE title = '河北文化深度游'), 1, '景点', '承德避暑山庄', '参观世界文化遗产', '河北省承德市双桥区丽正门大街', '09:00', '17:00', 1),
((SELECT id FROM plan_templates WHERE title = '河北文化深度游'), 2, '景点', '山海关', '天下第一关', '河北省秦皇岛市山海关区', '08:00', '12:00', 1),
((SELECT id FROM plan_templates WHERE title = '河北文化深度游'), 2, '景点', '老龙头', '长城入海处', '河北省秦皇岛市山海关区', '14:00', '17:00', 2);

-- 11. 创建测试用户
INSERT INTO users (email, username, created_at) VALUES
('test@tripself.com', '测试用户', NOW()),
('admin@tripself.com', '管理员', NOW());

-- 12. 创建示例攻略数据
INSERT INTO travel_plans (user_id, title, description, destination, start_date, end_date, budget, travel_style, status, is_public) VALUES
((SELECT id FROM users WHERE email = 'test@tripself.com'), '我的北京之旅', '第一次去北京，想去看看故宫和长城', '北京', '2024-11-01', '2024-11-03', 2000.00, '文化探索式', 'draft', false),
((SELECT id FROM users WHERE email = 'test@tripself.com'), '河北周末游', '周末去河北放松一下', '河北', '2024-11-10', '2024-11-12', 800.00, '细品慢游式', 'published', true);

-- 13. 显示创建结果
SELECT '数据库初始化完成！' as message;
SELECT '已创建表：' as tables_created;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'travel_plans', 'plan_days', 'plan_items', 'budget_items', 'plan_templates', 'template_items');

SELECT '示例数据统计：' as data_stats;
SELECT 'users: ' || COUNT(*) FROM users
UNION ALL
SELECT 'travel_plans: ' || COUNT(*) FROM travel_plans
UNION ALL
SELECT 'plan_templates: ' || COUNT(*) FROM plan_templates
UNION ALL
SELECT 'template_items: ' || COUNT(*) FROM template_items;