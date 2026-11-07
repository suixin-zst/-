/**
 * Demo 兜底数据 —— 数据库为空时页面仍有真实内容可看
 *
 * 为什么：黑客松 demo 不能空页面出场。种子数据需要手动在 SQL Editor 执行，
 * 万一没跑或环境不对，页面用这份数据兜底，保证评委看到完整产品。
 */

export const DEMO_HOST_ID = "demo-host-lin";

export interface DemoHost {
  id: string;
  name: string;
  avatarUrl: string | null;
  city: string;
  styles: string[];
  bio: string;
  priceHourly: number;
  priceHalfDay: number;
  priceFullDay: number;
  experienceYears: number;
  isVerified: boolean;
  rating: number;
  ratingCount: number;
  works: { id: string; type: string; url: string; title: string }[];
}

export interface DemoGig {
  id: string;
  merchant_id: string;
  merchantName: string;
  title: string;
  type: string;
  city: string;
  event_date: string;
  duration: string;
  budget_min: number;
  budget_max: number;
  requirements: string;
  description: string;
  status: "open";
  created_at: string;
}

export interface DemoConversation {
  id: string;
  peer: { id: string; name: string; role: "host" | "merchant" };
  gigTitle: string | null;
  messages: { sender: "me" | "peer"; content: string; time: string }[];
  updatedAt: string;
  lastPreview: string;
}

// ========== 6 位 demo 主持人 ==========

export const demoHosts: DemoHost[] = [
  {
    id: DEMO_HOST_ID,
    name: "林晚秋",
    avatarUrl: null,
    city: "上海",
    styles: ["发布会", "路演"],
    bio: "六年财经频道出镜经验，主持过 30+ 场车企发布会与城市路演。台风稳、临场反应快，擅长把技术参数讲成消费者听得懂的故事。",
    priceHourly: 1500,
    priceHalfDay: 4000,
    priceFullDay: 6500,
    experienceYears: 6,
    isVerified: true,
    rating: 4.9,
    ratingCount: 12,
    works: [
      { id: "w1", type: "video", url: "", title: "某车企新车发布会开场（45s）" },
      { id: "w2", type: "video", url: "", title: "科技园区招商路演片段（60s）" },
      { id: "w3", type: "image", url: "", title: "财经论坛圆桌主持" },
    ],
  },
  {
    id: "demo-host-chen",
    name: "陈亦航",
    avatarUrl: null,
    city: "北京",
    styles: ["年会", "婚礼", "展会"],
    bio: "普通话一级甲等，八年商演主持。风格幽默不油腻，控场能力强，年会节目串场和暖场互动是强项。曾主持过 200+ 场企业年会。",
    priceHourly: 1200,
    priceHalfDay: 3200,
    priceFullDay: 5000,
    experienceYears: 8,
    isVerified: true,
    rating: 4.8,
    ratingCount: 21,
    works: [
      { id: "w4", type: "video", url: "", title: "某互联网公司年会开场秀" },
      { id: "w5", type: "video", url: "", title: "户外草坪婚礼仪式全程" },
    ],
  },
  {
    id: "demo-host-su",
    name: "苏清漪",
    avatarUrl: null,
    city: "深圳",
    styles: ["发布会", "直播", "路演"],
    bio: "双语主持（中/英），三年科技发布会经验。同时是抖音科技区主播，擅长把产品卖点讲出高级感。直播场均在线 5000+。",
    priceHourly: 2000,
    priceHalfDay: 5500,
    priceFullDay: 9000,
    experienceYears: 3,
    isVerified: true,
    rating: 4.7,
    ratingCount: 8,
    works: [
      { id: "w6", type: "video", url: "", title: "某手机品牌全球发布会（双语）" },
      { id: "w7", type: "video", url: "", title: "直播带货专场回放" },
    ],
  },
  {
    id: "demo-host-xu",
    name: "徐北川",
    avatarUrl: null,
    city: "杭州",
    styles: ["年会", "发布会", "展会"],
    bio: "前广播电台主持人转型商演，声音辨识度高。擅长正式场合，发言稿润色和串词撰写是附加价值。服务过阿里、网易等大厂年会。",
    priceHourly: 1800,
    priceHalfDay: 4800,
    priceFullDay: 7500,
    experienceYears: 5,
    isVerified: false,
    rating: 4.6,
    ratingCount: 15,
    works: [
      { id: "w8", type: "video", url: "", title: "某大厂年度盛典主持" },
      { id: "w9", type: "audio", url: "", title: "广播节目主持片段" },
    ],
  },
  {
    id: "demo-host-zhao",
    name: "赵朗宁",
    avatarUrl: null,
    city: "广州",
    styles: ["婚礼", "年会", "路演"],
    bio: "温暖系主持，善于调动气氛、捕捉现场感动瞬间。婚礼主持满意度 99%，回头客推荐率 60%。粤语/普通话双语无缝切换。",
    priceHourly: 1000,
    priceHalfDay: 2800,
    priceFullDay: 4500,
    experienceYears: 4,
    isVerified: true,
    rating: 4.9,
    ratingCount: 34,
    works: [
      { id: "w10", type: "video", url: "", title: "五星级酒店婚礼全程" },
      { id: "w11", type: "video", url: "", title: "商业地产开盘活动" },
    ],
  },
  {
    id: "demo-host-ye",
    name: "叶知微",
    avatarUrl: null,
    city: "上海",
    styles: ["直播", "展会", "发布会"],
    bio: "新媒体主持+内容策划一体。不只是台上那 4 小时——前期脚本、现场互动设计、后期短视频剪辑都能包。适合需要全案的品牌方。",
    priceHourly: 2200,
    priceHalfDay: 6000,
    priceFullDay: 10000,
    experienceYears: 7,
    isVerified: true,
    rating: 4.8,
    ratingCount: 19,
    works: [
      { id: "w12", type: "video", url: "", title: "某美妆品牌发布会+直播" },
      { id: "w13", type: "image", url: "", title: "展会互动环节策划" },
    ],
  },
];

// ========== 6 张 demo 商单 ==========

export const demoGigs: DemoGig[] = [
  {
    id: "demo-gig-1",
    merchant_id: "demo-merchant-auto",
    merchantName: "星驰汽车市场部",
    title: "星驰 E5 新车发布会主持",
    type: "发布会",
    city: "上海",
    event_date: "2026-11-21",
    duration: "半天",
    budget_min: 3000,
    budget_max: 5000,
    requirements: "女，有车企发布会经验优先，普通话一级甲等",
    description:
      "面向媒体与首批车主的发布会，含开场、串场、高管访谈三个环节。需要提前一天彩排。场地在上海展览中心，预计到场 200 人。",
    status: "open",
    created_at: "2026-11-05T10:00:00Z",
  },
  {
    id: "demo-gig-2",
    merchant_id: "demo-merchant-expo",
    merchantName: "申城会展",
    title: "国际消费电子展驻场主持",
    type: "展会",
    city: "上海",
    event_date: "2026-12-07",
    duration: "全天",
    budget_min: 2000,
    budget_max: 3500,
    requirements: "不限性别，英语口语流利加分",
    description:
      "三天展期，每天 6 小时。负责展台产品讲解与互动抽奖环节，需要背产品资料。展位面积约 200 平，预计日均人流 3000+。",
    status: "open",
    created_at: "2026-11-04T14:00:00Z",
  },
  {
    id: "demo-gig-3",
    merchant_id: "demo-merchant-keji",
    merchantName: "云启科技",
    title: "2026 年度盛典暨颁奖典礼",
    type: "年会",
    city: "北京",
    event_date: "2027-01-18",
    duration: "全天",
    budget_min: 5000,
    budget_max: 8000,
    requirements: "男，有大型年会经验，能带动气氛",
    description:
      "公司 500 人年会，含开场视频配音、颁奖环节 12 轮、抽奖互动、晚宴串场。需要全天在岗，上午彩排 + 下午正式。场地在国家会议中心。",
    status: "open",
    created_at: "2026-11-03T09:00:00Z",
  },
  {
    id: "demo-gig-4",
    merchant_id: "demo-merchant-hotel",
    merchantName: "璞悦酒店集团",
    title: "春季草坪婚礼主持",
    type: "婚礼",
    city: "杭州",
    event_date: "2027-03-22",
    duration: "半天",
    budget_min: 2500,
    budget_max: 4000,
    requirements: "女，有户外婚礼经验，粤语/普通话双语",
    description:
      "户外草坪婚礼，约 150 人。含迎宾、仪式、敬酒三轮串场。新人希望温馨浪漫风格，不要太综艺化。含一次提前沟通 + 当天提前 2 小时到场。",
    status: "open",
    created_at: "2026-11-02T16:00:00Z",
  },
  {
    id: "demo-gig-5",
    merchant_id: "demo-merchant-mall",
    merchantName: "万象城商业",
    title: "周末路演活动主持",
    type: "路演",
    city: "深圳",
    event_date: "2026-11-29",
    duration: "2小时",
    budget_min: 1500,
    budget_max: 2500,
    requirements: "不限，有商场活动互动经验优先",
    description:
      "商场中庭品牌快闪活动，含产品体验引导、互动游戏、抽奖环节。气氛要活泼，能吸引路人驻足参与。每场约 2 小时，当天上下午各一场。",
    status: "open",
    created_at: "2026-11-01T11:00:00Z",
  },
  {
    id: "demo-gig-6",
    merchant_id: "demo-merchant-brand",
    merchantName: "花西子品牌部",
    title: "双十二专场直播主持",
    type: "直播",
    city: "杭州",
    event_date: "2026-12-12",
    duration: "全天",
    budget_min: 4000,
    budget_max: 6000,
    requirements: "有直播带货经验，了解美妆品类优先",
    description:
      "品牌官方直播间全天 8 小时主持（分两个时段各 4 小时）。配合主播介绍产品、引导下单、互动答疑。需要熟悉直播节奏和话术。",
    status: "open",
    created_at: "2026-10-30T08:00:00Z",
  },
];

// ========== demo 会话（聊天页兜底） ==========

export const demoConversations: DemoConversation[] = [
  {
    id: "demo-conv-1",
    peer: { id: "demo-merchant-auto", name: "星驰汽车市场部", role: "merchant" },
    gigTitle: "星驰 E5 新车发布会主持",
    messages: [
      { sender: "peer", content: "你好，看了你的主页，觉得你风格很适合我们的新车发布会。", time: "11/05 10:30" },
      { sender: "me", content: "谢谢！我看了商单详情，这个活动形式我很熟悉。之前主持过几场车企发布会。", time: "11/05 10:35" },
      { sender: "peer", content: "太好了。想确认一下 11/21 全天有空吗？需要提前一天来彩排。", time: "11/05 10:38" },
      { sender: "me", content: "11/21 有空的，彩排没问题。发布会流程方便发我看看吗？", time: "11/05 10:42" },
      { sender: "peer", content: "流程初稿明天发你。预算 4000 半天，含彩排一共算一天。可以接受吗？", time: "11/05 10:45" },
      { sender: "me", content: "可以的，这个预算合理。那我们约个时间线下对一下？", time: "11/05 10:48" },
    ],
    updatedAt: "2026-11-05T10:48:00Z",
    lastPreview: "可以的，这个预算合理。",
  },
  {
    id: "demo-conv-2",
    peer: { id: "demo-merchant-expo", name: "申城会展", role: "merchant" },
    gigTitle: "国际消费电子展驻场主持",
    messages: [
      { sender: "peer", content: "你好，消费电子展的驻场主持还在招人，你有兴趣吗？", time: "11/04 14:20" },
      { sender: "me", content: "有兴趣的。三天全程都需要吗？", time: "11/04 14:35" },
      { sender: "peer", content: "是的，12/7-12/9 三天，每天 6 小时。产品资料我们会提前发你背。", time: "11/04 14:40" },
      { sender: "me", content: "明白，我英语口语还行，接待海外观众应该没问题。", time: "11/04 14:50" },
    ],
    updatedAt: "2026-11-04T14:50:00Z",
    lastPreview: "明白，我英语口语还行。",
  },
  {
    id: "demo-conv-3",
    peer: { id: "demo-merchant-keji", name: "云启科技", role: "merchant" },
    gigTitle: null,
    messages: [
      { sender: "peer", content: "林老师你好，朋友推荐的，说你在科技发布会很专业。", time: "11/03 09:10" },
      { sender: "me", content: "过奖了！你们是有什么活动需要主持吗？", time: "11/03 09:25" },
      { sender: "peer", content: "我们 1 月份有个 500 人年会，想找一个能 hold 住全场的主持。你有档期吗？", time: "11/03 09:30" },
      { sender: "me", content: "1 月中旬有空。500 人规模我做过不少，可以聊聊具体需求。", time: "11/03 09:45" },
    ],
    updatedAt: "2026-11-03T09:45:00Z",
    lastPreview: "1 月中旬有空，可以聊聊具体需求。",
  },
];
