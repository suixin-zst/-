-- ============================================================
-- 台前 · 种子数据（副手负责，demo 的脸）
--
-- 流程（README「种子数据」一节有完整说明）：
--  1. 先在网站上用账号清单注册（关邮箱验证后每号 30 秒）
--  2. 再执行本文件（按 email 匹配，可重复执行，不会重复插入）
--  3. 补满到 8 主持人 / 6 商单；作品视频用 30–60 秒外链
--  4. avatar_url 换成统一风格的职业感真人照（Unsplash 搜 presenter）
-- ============================================================

-- ========== 主持人 1：林晚秋（上海 · 发布会/路演） ==========
update public.profiles set name = '林晚秋'
  , avatar_url = null -- TODO 副手：换成真人形象照链接
  where id = (select id from auth.users where email = 'lin@taiqian.dev');

update public.host_profiles set
  city = '上海', gender = '女', styles = array['发布会', '路演'],
  bio = '六年财经频道出镜经验，主持过 30+ 场车企发布会与城市路演。台风稳、临场反应快，擅长把技术参数讲成消费者听得懂的故事。',
  price_hourly = 1500, price_half_day = 4000, price_full_day = 6500,
  experience_years = 6, is_verified = true, rating = 4.9, rating_count = 12
  where user_id = (select id from auth.users where email = 'lin@taiqian.dev');

insert into public.works (host_id, type, url, title)
select u.id, 'video', 'https://example.com/lin-reel.mp4', '某车企新车发布会开场（45s）'
  from auth.users u where u.email = 'lin@taiqian.dev'
  and not exists (select 1 from public.works w where w.host_id = u.id and w.title = '某车企新车发布会开场（45s）');

insert into public.works (host_id, type, url, title)
select u.id, 'video', 'https://example.com/lin-roadshow.mp4', '科技园区招商路演片段（60s）'
  from auth.users u where u.email = 'lin@taiqian.dev'
  and not exists (select 1 from public.works w where w.host_id = u.id and w.title = '科技园区招商路演片段（60s）');

-- ========== 主持人 2：陈亦航（北京 · 年会/婚礼） ==========
update public.profiles set name = '陈亦航'
  , avatar_url = null -- TODO 副手
  where id = (select id from auth.users where email = 'chen@taiqian.dev');

update public.host_profiles set
  city = '北京', gender = '男', styles = array['年会', '婚礼', '展会'],
  bio = '普通话一级甲等，八年商演主持。风格幽默不油腻，控场能力强，年会节目串场和暖场互动是强项。',
  price_hourly = 1200, price_half_day = 3200, price_full_day = 5000,
  experience_years = 8, is_verified = true, rating = 4.8, rating_count = 21
  where user_id = (select id from auth.users where email = 'chen@taiqian.dev');

-- TODO 副手：照上面格式补到 8 位主持人（画像覆盖：发布会/路演/年会/婚礼/展会/直播，
-- 城市：上海/北京/广深/杭州，价位高中低搭配，资料要像真人）

-- ========== 商家档案 ==========
update public.profiles set name = '星驰汽车市场部'
  , avatar_url = null -- TODO 副手：换成品牌 logo 图
  where id = (select id from auth.users where email = 'auto@taiqian.dev');

update public.merchant_profiles set
  company = '星驰汽车', industry = '汽车',
  intro = '新势力车企，每季度有多场新车发布与城市巡展，长期需要专业商务主持。'
  where user_id = (select id from auth.users where email = 'auto@taiqian.dev');

update public.profiles set name = '申城会展'
  , avatar_url = null
  where id = (select id from auth.users where email = 'expo@taiqian.dev');

update public.merchant_profiles set
  company = '申城会展服务有限公司', industry = '会展',
  intro = '沪上会展承办方，年均 40+ 场展会，需要大量驻场讲解与开幕主持。'
  where user_id = (select id from auth.users where email = 'expo@taiqian.dev');

-- ========== 商单 1：新车发布会（星驰汽车） ==========
insert into public.gigs (merchant_id, title, type, city, event_date, duration, budget_min, budget_max, requirements, description)
select u.id, '星驰 E5 新车发布会主持', '发布会', '上海', current_date + 14, '半天',
  3000, 5000, '女，有车企发布会经验优先，普通话一级甲等',
  '面向媒体与首批车主的发布会，含开场、串场、高管访谈三个环节。需要提前一天彩排。'
  from auth.users u where u.email = 'auto@taiqian.dev'
  and not exists (select 1 from public.gigs g where g.title = '星驰 E5 新车发布会主持');

-- ========== 商单 2：展会驻场讲解（申城会展） ==========
insert into public.gigs (merchant_id, title, type, city, event_date, duration, budget_min, budget_max, requirements, description)
select u.id, '国际消费电子展驻场主持', '展会', '上海', current_date + 30, '全天',
  2000, 3500, '不限性别，英语口语流利加分',
  '三天展期，每天 6 小时。负责展台产品讲解与互动抽奖环节，需要背产品资料。'
  from auth.users u where u.email = 'expo@taiqian.dev'
  and not exists (select 1 from public.gigs g where g.title = '国际消费电子展驻场主持');

-- TODO 副手：照上面格式补到 6 张商单（覆盖：年会/路演/婚礼/直播，预算高低搭配）
