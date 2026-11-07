import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { hashPassword } from "./auth";
import { hosts as seedHosts, gigs as seedGigs } from "@/lib/mock-data";
import type {
  AvailabilityDay,
  GigStatus,
  GigType,
  HostStyle,
  Tone,
} from "@/lib/types";

export type Role = "host" | "merchant";
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  role: Role;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface DbHostProfile {
  user_id: string;
  city: string;
  gender: string;
  styles: HostStyle[];
  bio: string;
  tagline: string;
  price_hourly: number;
  price_half_day: number;
  price_full_day: number;
  experience_years: number;
  is_verified: boolean;
  rating: number;
  rating_count: number;
  response_minutes: number;
  tone: Tone;
  availability: AvailabilityDay[];
}

export interface DbMerchantProfile {
  user_id: string;
  company: string;
  industry: string;
  intro: string;
  verified: boolean;
}

export interface DbWork {
  id: string;
  host_id: string;
  type: "video" | "image" | "audio";
  url: string;
  title: string;
  duration: string;
  tone: Tone;
  created_at: string;
}

export interface DbReview {
  id: string;
  gig_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  content: string;
  merchant: string;
  date: string;
}

export interface DbGig {
  id: string;
  merchant_id: string;
  company: string;
  title: string;
  type: GigType;
  city: string;
  event_date: string;
  duration: string;
  budget_min: number;
  budget_max: number;
  requirements: string[];
  description: string;
  status: GigStatus;
  applicants: number;
  posted_at: string;
  tone: Tone;
}

export interface DbApplication {
  id: string;
  gig_id: string | null;
  host_id: string;
  merchant_id: string;
  initiator: "host" | "merchant";
  status: ApplicationStatus;
  message: string;
  created_at: string;
}

export interface DbConversation {
  id: string;
  gig_id: string | null;
  host_id: string;
  merchant_id: string;
  created_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Db {
  users: DbUser[];
  host_profiles: DbHostProfile[];
  merchant_profiles: DbMerchantProfile[];
  works: DbWork[];
  reviews: DbReview[];
  gigs: DbGig[];
  applications: DbApplication[];
  conversations: DbConversation[];
  messages: DbMessage[];
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function now(): string {
  return new Date().toISOString();
}

function defaultAvailability(): AvailabilityDay[] {
  return [
    { date: "11/08", weekday: "周六", open: true },
    { date: "11/09", weekday: "周日", open: true },
    { date: "11/15", weekday: "周六", open: false },
    { date: "11/16", weekday: "周日", open: true },
    { date: "11/22", weekday: "周六", open: true },
    { date: "11/29", weekday: "周六", open: true },
  ];
}

function buildSeed(): Db {
  const created = now();
  const password_hash = hashPassword("demo1234");

  const users: DbUser[] = [];
  const host_profiles: DbHostProfile[] = [];
  const works: DbWork[] = [];
  const reviews: DbReview[] = [];
  const merchant_profiles: DbMerchantProfile[] = [];

  for (const host of seedHosts) {
    users.push({
      id: host.id,
      email: `${host.id}@taiqian.demo`,
      password_hash,
      role: "host",
      name: host.name,
      avatar_url: null,
      created_at: created,
    });

    host_profiles.push({
      user_id: host.id,
      city: host.city,
      gender: "",
      styles: host.styles,
      bio: host.bio,
      tagline: host.tagline,
      price_hourly: host.priceHourly,
      price_half_day: host.priceHalfDay,
      price_full_day: host.priceFullDay,
      experience_years: host.experienceYears,
      is_verified: host.verified,
      rating: host.rating,
      rating_count: host.ratingCount,
      response_minutes: host.responseMinutes,
      tone: host.tone,
      availability: host.availability,
    });

    host.works.forEach((work, index) => {
      works.push({
        id: `${host.id}-w${index + 1}`,
        host_id: host.id,
        type: work.type,
        url: "",
        title: work.title,
        duration: work.duration,
        tone: work.tone,
        created_at: created,
      });
    });

    host.reviews.forEach((review, index) => {
      reviews.push({
        id: `${host.id}-r${index + 1}`,
        gig_id: "",
        reviewer_id: "merchant-saiche",
        reviewee_id: host.id,
        rating: review.rating,
        content: review.content,
        merchant: review.merchant,
        date: review.date,
      });
    });
  }

  const merchants = [
    {
      id: "merchant-saiche",
      email: "merchant@taiqian.demo",
      name: "上海某汽车品牌",
      company: "上海某汽车品牌",
      industry: "汽车 / 新能源",
      intro: "负责新车发布、试驾会和品牌活动，今年还有 3 场发布会。",
      verified: true,
    },
    {
      id: "merchant-xingye",
      email: "event@taiqian.demo",
      name: "星野活动",
      company: "星野活动",
      industry: "活动策划",
      intro: "一年 40+ 场品牌活动，长期寻找靠谱主持人。",
      verified: true,
    },
  ];

  for (const merchant of merchants) {
    users.push({
      id: merchant.id,
      email: merchant.email,
      password_hash,
      role: "merchant",
      name: merchant.name,
      avatar_url: null,
      created_at: created,
    });
    merchant_profiles.push({
      user_id: merchant.id,
      company: merchant.company,
      industry: merchant.industry,
      intro: merchant.intro,
      verified: merchant.verified,
    });
  }

  const merchantByGig: Record<string, string> = {
    "new-car-launch": "merchant-saiche",
    "wedding-dinner": "merchant-saiche",
    "4s-weekend": "merchant-saiche",
    "group-annual-gala": "merchant-xingye",
    "mall-christmas": "merchant-xingye",
    "summit-roundtable": "merchant-xingye",
  };

  const gigs: DbGig[] = seedGigs.map((gig) => ({
    id: gig.id,
    merchant_id: merchantByGig[gig.id] ?? "merchant-xingye",
    company: gig.company,
    title: gig.title,
    type: gig.type,
    city: gig.city,
    event_date: gig.eventDate,
    duration: gig.duration,
    budget_min: gig.budgetMin,
    budget_max: gig.budgetMax,
    requirements: gig.requirements,
    description: gig.description,
    status: gig.status,
    applicants: gig.applicants,
    posted_at: gig.postedAt,
    tone: gig.tone,
  }));

  const applications: DbApplication[] = [
    {
      id: "seed-app-1",
      gig_id: "new-car-launch",
      host_id: "lin-zhiyao",
      merchant_id: "merchant-saiche",
      initiator: "host",
      status: "pending",
      message: "您好，我主持过 8 场新能源发布会，11 月 17 日可以彩排。",
      created_at: "2026-11-04T09:20:00.000Z",
    },
    {
      id: "seed-app-2",
      gig_id: "group-annual-gala",
      host_id: "su-wan",
      merchant_id: "merchant-xingye",
      initiator: "merchant",
      status: "pending",
      message: "想邀请您主持集团年会，双语环节比较多。",
      created_at: "2026-11-05T10:00:00.000Z",
    },
    {
      id: "seed-app-3",
      gig_id: "summit-roundtable",
      host_id: "shen-xinghe",
      merchant_id: "merchant-xingye",
      initiator: "host",
      status: "accepted",
      message: "圆桌主持经验丰富，可提前一天到北京。",
      created_at: "2026-11-02T14:30:00.000Z",
    },
  ];

  const conversations: DbConversation[] = [
    {
      id: "seed-conv-1",
      gig_id: "new-car-launch",
      host_id: "lin-zhiyao",
      merchant_id: "merchant-saiche",
      created_at: "2026-11-04T09:25:00.000Z",
    },
    {
      id: "seed-conv-2",
      gig_id: "group-annual-gala",
      host_id: "su-wan",
      merchant_id: "merchant-xingye",
      created_at: "2026-11-05T10:05:00.000Z",
    },
    {
      id: "seed-conv-3",
      gig_id: "summit-roundtable",
      host_id: "shen-xinghe",
      merchant_id: "merchant-xingye",
      created_at: "2026-11-02T14:40:00.000Z",
    },
  ];

  const messages: DbMessage[] = [
    {
      id: "seed-msg-1",
      conversation_id: "seed-conv-1",
      sender_id: "merchant-saiche",
      content: "你好，看到你的报名了。11 月 17 日下午彩排可以吗？",
      created_at: "2026-11-04T09:31:00.000Z",
    },
    {
      id: "seed-msg-2",
      conversation_id: "seed-conv-1",
      sender_id: "lin-zhiyao",
      content: "可以，我提前一天到上海。产品讲解部分需要提前对稿吗？",
      created_at: "2026-11-04T09:36:00.000Z",
    },
    {
      id: "seed-msg-3",
      conversation_id: "seed-conv-1",
      sender_id: "merchant-saiche",
      content: "需要，我明天把资料发你。",
      created_at: "2026-11-04T09:40:00.000Z",
    },
    {
      id: "seed-msg-4",
      conversation_id: "seed-conv-2",
      sender_id: "merchant-xingye",
      content: "苏老师您好，想邀请您主持 12 月 20 日的集团年会。",
      created_at: "2026-11-05T10:06:00.000Z",
    },
    {
      id: "seed-msg-5",
      conversation_id: "seed-conv-2",
      sender_id: "su-wan",
      content: "可以的，先发我一份流程，我看看双语串场怎么排。",
      created_at: "2026-11-05T10:12:00.000Z",
    },
    {
      id: "seed-msg-6",
      conversation_id: "seed-conv-3",
      sender_id: "merchant-xingye",
      content: "沈老师，北京峰会的圆桌就定您了，合同和流程我明天发。",
      created_at: "2026-11-02T14:45:00.000Z",
    },
  ];

  return {
    users,
    host_profiles,
    merchant_profiles,
    works,
    reviews,
    gigs,
    applications,
    conversations,
    messages,
  };
}

let cached: { mtimeMs: number; db: Db } | null = null;

async function writeDb(db: Db): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  const temp = `${DB_PATH}.${process.pid}.tmp`;
  await fs.writeFile(temp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(temp, DB_PATH);
  const stat = await fs.stat(DB_PATH);
  cached = { mtimeMs: stat.mtimeMs, db };
}

async function ensureDbFile(): Promise<void> {
  try {
    await fs.access(DB_PATH);
  } catch {
    await writeDb(buildSeed());
  }
}

async function readDb(): Promise<Db> {
  await ensureDbFile();
  const stat = await fs.stat(DB_PATH);
  if (cached && cached.mtimeMs === stat.mtimeMs) {
    return cached.db;
  }
  const raw = await fs.readFile(DB_PATH, "utf8");
  const db = JSON.parse(raw) as Db;
  cached = { mtimeMs: stat.mtimeMs, db };
  return db;
}

let queue: Promise<unknown> = Promise.resolve();

export async function mutate<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDb();
    const result = await fn(db);
    await writeDb(db);
    return result;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/* ---------------- Users ---------------- */

export async function getUserById(id: string): Promise<DbUser | undefined> {
  const db = await readDb();
  return db.users.find((user) => user.id === id);
}

export async function getUserByEmail(email: string): Promise<DbUser | undefined> {
  const db = await readDb();
  return db.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

export async function createUser(input: {
  email: string;
  password: string;
  role: Role;
  name: string;
}): Promise<DbUser> {
  return mutate((db) => {
    if (
      db.users.some(
        (user) => user.email.toLowerCase() === input.email.toLowerCase(),
      )
    ) {
      throw new Error("该邮箱已注册。");
    }

    const user: DbUser = {
      id: crypto.randomUUID(),
      email: input.email.toLowerCase(),
      password_hash: hashPassword(input.password),
      role: input.role,
      name: input.name,
      avatar_url: null,
      created_at: now(),
    };
    db.users.push(user);

    if (input.role === "host") {
      db.host_profiles.push({
        user_id: user.id,
        city: "",
        gender: "",
        styles: [],
        bio: "",
        tagline: "新入驻主持人",
        price_hourly: 0,
        price_half_day: 0,
        price_full_day: 0,
        experience_years: 0,
        is_verified: false,
        rating: 0,
        rating_count: 0,
        response_minutes: 30,
        tone: "sand",
        availability: defaultAvailability(),
      });
    } else {
      db.merchant_profiles.push({
        user_id: user.id,
        company: input.name,
        industry: "",
        intro: "",
        verified: false,
      });
    }

    return user;
  });
}

export async function updateUserName(id: string, name: string): Promise<void> {
  await mutate((db) => {
    const user = db.users.find((item) => item.id === id);
    if (user) user.name = name;
  });
}

/* ---------------- Host profiles / works / reviews ---------------- */

export interface HostRow {
  user: DbUser;
  profile: DbHostProfile;
  works: DbWork[];
  reviews: DbReview[];
}

export async function listHostUsers(): Promise<HostRow[]> {
  const db = await readDb();
  return db.users
    .filter((user) => user.role === "host")
    .map((user) => {
      const profile = db.host_profiles.find((item) => item.user_id === user.id);
      if (!profile) return null;
      return {
        user,
        profile,
        works: db.works.filter((work) => work.host_id === user.id),
        reviews: db.reviews.filter((review) => review.reviewee_id === user.id),
      };
    })
    .filter((row): row is HostRow => Boolean(row));
}

export async function getHostRow(id: string): Promise<HostRow | undefined> {
  const db = await readDb();
  const user = db.users.find(
    (item) => item.id === id && item.role === "host",
  );
  if (!user) return undefined;
  const profile = db.host_profiles.find((item) => item.user_id === user.id);
  if (!profile) return undefined;
  return {
    user,
    profile,
    works: db.works.filter((work) => work.host_id === user.id),
    reviews: db.reviews.filter((review) => review.reviewee_id === user.id),
  };
}

export async function getHostProfile(
  userId: string,
): Promise<DbHostProfile | undefined> {
  const db = await readDb();
  return db.host_profiles.find((item) => item.user_id === userId);
}

export async function upsertHostProfile(
  userId: string,
  patch: Partial<DbHostProfile>,
): Promise<DbHostProfile> {
  return mutate((db) => {
    const profile = db.host_profiles.find((item) => item.user_id === userId);
    if (!profile) throw new Error("主持人资料不存在。");
    Object.assign(profile, patch, { user_id: userId });
    return profile;
  });
}

export async function addWork(
  hostId: string,
  input: { title: string; type: DbWork["type"]; url: string; duration?: string },
): Promise<DbWork> {
  return mutate((db) => {
    const work: DbWork = {
      id: crypto.randomUUID(),
      host_id: hostId,
      type: input.type,
      url: input.url,
      title: input.title,
      duration: input.duration || "新上传",
      tone: "ink",
      created_at: now(),
    };
    db.works.push(work);
    return work;
  });
}

export async function listWorks(hostId: string): Promise<DbWork[]> {
  const db = await readDb();
  return db.works.filter((work) => work.host_id === hostId);
}

/* ---------------- Merchant profiles ---------------- */

export async function getMerchantProfile(
  userId: string,
): Promise<DbMerchantProfile | undefined> {
  const db = await readDb();
  return db.merchant_profiles.find((item) => item.user_id === userId);
}

export async function upsertMerchantProfile(
  userId: string,
  patch: Partial<DbMerchantProfile>,
): Promise<DbMerchantProfile> {
  return mutate((db) => {
    const profile = db.merchant_profiles.find(
      (item) => item.user_id === userId,
    );
    if (!profile) throw new Error("商家资料不存在。");
    Object.assign(profile, patch, { user_id: userId });
    return profile;
  });
}

/* ---------------- Gigs ---------------- */

export async function listGigs(): Promise<DbGig[]> {
  const db = await readDb();
  return [...db.gigs].sort((a, b) =>
    a.posted_at < b.posted_at ? 1 : -1,
  );
}

export async function getGig(id: string): Promise<DbGig | undefined> {
  const db = await readDb();
  return db.gigs.find((gig) => gig.id === id);
}

export async function createGig(input: {
  merchant_id: string;
  company: string;
  title: string;
  type: GigType;
  city: string;
  event_date: string;
  duration: string;
  budget_min: number;
  budget_max: number;
  requirements: string[];
  description: string;
}): Promise<DbGig> {
  return mutate((db) => {
    const gig: DbGig = {
      ...input,
      id: crypto.randomUUID(),
      status: "open",
      applicants: 0,
      posted_at: now().slice(0, 10),
      tone: "gold",
    };
    db.gigs.unshift(gig);
    return gig;
  });
}

export async function updateGigStatus(
  id: string,
  status: GigStatus,
): Promise<DbGig | undefined> {
  return mutate((db) => {
    const gig = db.gigs.find((item) => item.id === id);
    if (gig) gig.status = status;
    return gig;
  });
}

/* ---------------- Applications ---------------- */

export interface ApplicationRow {
  application: DbApplication;
  host?: DbUser;
  gig?: DbGig;
}

export async function createApplication(input: {
  gig_id: string | null;
  host_id: string;
  merchant_id: string;
  initiator: "host" | "merchant";
  message: string;
}): Promise<{ application: DbApplication; conversation: DbConversation }> {
  return mutate((db) => {
    let application = db.applications.find(
      (item) =>
        item.gig_id === input.gig_id &&
        item.host_id === input.host_id &&
        item.status !== "rejected",
    );

    if (!application) {
      application = {
        id: crypto.randomUUID(),
        gig_id: input.gig_id,
        host_id: input.host_id,
        merchant_id: input.merchant_id,
        initiator: input.initiator,
        status: "pending",
        message: input.message,
        created_at: now(),
      };
      db.applications.push(application);

      if (input.gig_id) {
        const gig = db.gigs.find((item) => item.id === input.gig_id);
        if (gig) gig.applicants += 1;
      }
    }

    let conversation = db.conversations.find(
      (item) =>
        item.host_id === input.host_id &&
        item.merchant_id === input.merchant_id &&
        (input.gig_id ? item.gig_id === input.gig_id : !item.gig_id),
    );

    if (!conversation) {
      conversation = {
        id: crypto.randomUUID(),
        gig_id: input.gig_id,
        host_id: input.host_id,
        merchant_id: input.merchant_id,
        created_at: now(),
      };
      db.conversations.push(conversation);
    }

    return { application, conversation };
  });
}

export async function listApplications(
  where: { hostId?: string; merchantId?: string },
): Promise<ApplicationRow[]> {
  const db = await readDb();
  return db.applications
    .filter((application) => {
      if (where.hostId && application.host_id !== where.hostId) return false;
      if (where.merchantId && application.merchant_id !== where.merchantId) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .map((application) => ({
      application,
      host: db.users.find((user) => user.id === application.host_id),
      gig: application.gig_id
        ? db.gigs.find((gig) => gig.id === application.gig_id)
        : undefined,
    }));
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<DbApplication | undefined> {
  return mutate((db) => {
    const application = db.applications.find((item) => item.id === id);
    if (!application) return undefined;

    application.status = status;

    if (status === "accepted" && application.gig_id) {
      const gig = db.gigs.find((item) => item.id === application.gig_id);
      if (gig) gig.status = "matched";

      for (const other of db.applications) {
        if (
          other.gig_id === application.gig_id &&
          other.id !== application.id &&
          other.status === "pending"
        ) {
          other.status = "rejected";
        }
      }

      const exists = db.conversations.some(
        (item) =>
          item.gig_id === application.gig_id &&
          item.host_id === application.host_id &&
          item.merchant_id === application.merchant_id,
      );
      if (!exists) {
        db.conversations.push({
          id: crypto.randomUUID(),
          gig_id: application.gig_id,
          host_id: application.host_id,
          merchant_id: application.merchant_id,
          created_at: now(),
        });
      }
    }

    return application;
  });
}

export async function getApplication(
  id: string,
): Promise<DbApplication | undefined> {
  const db = await readDb();
  return db.applications.find((item) => item.id === id);
}

/* ---------------- Conversations / messages ---------------- */

export interface ConversationRow {
  conversation: DbConversation;
  host: DbUser;
  merchant: DbUser;
  gig?: DbGig;
  lastMessage?: DbMessage;
}

export async function listConversationsForUser(
  userId: string,
): Promise<ConversationRow[]> {
  const db = await readDb();

  const rows = db.conversations
    .filter(
      (conversation) =>
        conversation.host_id === userId ||
        conversation.merchant_id === userId,
    )
    .map((conversation): ConversationRow | null => {
      const host = db.users.find(
        (user) => user.id === conversation.host_id,
      );
      const merchant = db.users.find(
        (user) => user.id === conversation.merchant_id,
      );
      if (!host || !merchant) return null;
      const messages = db.messages
        .filter((message) => message.conversation_id === conversation.id)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

      return {
        conversation,
        host,
        merchant,
        gig: conversation.gig_id
          ? db.gigs.find((gig) => gig.id === conversation.gig_id)
          : undefined,
        lastMessage: messages[0],
      };
    })
    .filter((row): row is ConversationRow => row !== null);

  rows.sort((a, b) =>
    (a.lastMessage?.created_at ?? a.conversation.created_at) <
    (b.lastMessage?.created_at ?? b.conversation.created_at)
      ? 1
      : -1,
  );

  return rows;
}

export async function getConversationRow(
  id: string,
  userId: string,
): Promise<ConversationRow | undefined> {
  const db = await readDb();
  const conversation = db.conversations.find(
    (item) =>
      item.id === id &&
      (item.host_id === userId || item.merchant_id === userId),
  );
  if (!conversation) return undefined;

  const host = db.users.find((user) => user.id === conversation.host_id);
  const merchant = db.users.find(
    (user) => user.id === conversation.merchant_id,
  );
  if (!host || !merchant) return undefined;

  return {
    conversation,
    host,
    merchant,
    gig: conversation.gig_id
      ? db.gigs.find((gig) => gig.id === conversation.gig_id)
      : undefined,
    lastMessage: db.messages
      .filter((message) => message.conversation_id === conversation.id)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))[0],
  };
}

export async function listMessages(
  conversationId: string,
  after?: string,
): Promise<DbMessage[]> {
  const db = await readDb();
  return db.messages
    .filter(
      (message) =>
        message.conversation_id === conversationId &&
        (!after || message.created_at > after),
    )
    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
}

export async function addMessage(input: {
  conversation_id: string;
  sender_id: string;
  content: string;
}): Promise<DbMessage> {
  return mutate((db) => {
    const message: DbMessage = {
      id: crypto.randomUUID(),
      conversation_id: input.conversation_id,
      sender_id: input.sender_id,
      content: input.content.slice(0, 2000),
      created_at: now(),
    };
    db.messages.push(message);
    return message;
  });
}

export async function getConversation(
  id: string,
): Promise<DbConversation | undefined> {
  const db = await readDb();
  return db.conversations.find((conversation) => conversation.id === id);
}
