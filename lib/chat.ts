/**
 * 聊天数据层（页面只调这里的函数，不自己拼查询）
 *
 * 为什么要隔离：会话列表和聊天窗都需要「对方是谁」这一个信息，
 * 而它要靠两次查询拼出来（conversations → profiles）。写在两处会漂。
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, MessageRow, Role } from "@/lib/types";

type Client = SupabaseClient<Database>;

export interface ConversationListItem {
  id: string;
  /** 对方（相对当前用户而言）的展示信息 */
  peer: { id: string; name: string; avatarUrl: string | null; role: Role };
  /** 附带商单标题；直聊会话为 null */
  gigTitle: string | null;
  lastMessage: { content: string; createdAt: string; senderId: string } | null;
  updatedAt: string;
}

export interface ConversationDetail extends ConversationListItem {
  hostId: string;
  merchantId: string;
  messages: MessageRow[];
}

/** 我参与的会话列表，按最后活动时间倒序 */
export async function loadConversations(
  client: Client,
  userId: string
): Promise<ConversationListItem[]> {
  const { data: rows, error } = await client
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !rows || rows.length === 0) return [];

  const convIds = rows.map((c) => c.id);

  // 每条会话的对方 id：我是 host 就对 merchant，反之亦然
  const peerIds = Array.from(
    new Set(rows.map((c) => (c.host_id === userId ? c.merchant_id : c.host_id)))
  );
  const gigIds = Array.from(
    new Set(rows.map((c) => c.gig_id).filter((v): v is string => v !== null))
  );

  // 三次查询并发拉，避免串行等待
  const [peersRes, gigsRes, msgsRes] = await Promise.all([
    client.from("profiles").select("id, name, avatar_url, role").in("id", peerIds),
    gigIds.length
      ? client.from("gigs").select("id, title").in("id", gigIds)
      : Promise.resolve({ data: [] as { id: string; title: string }[], error: null }),
    client
      .from("messages")
      .select("*")
      .in("conversation_id", convIds)
      .order("created_at", { ascending: false }),
  ]);

  const peerMap = new Map((peersRes.data ?? []).map((p) => [p.id, p]));
  const gigMap = new Map((gigsRes.data ?? []).map((g) => [g.id, g.title]));

  // 取每条会话的最后一条消息（已按时间倒序，首次出现即最新）
  const lastMsg = new Map<string, MessageRow>();
  for (const m of msgsRes.data ?? []) {
    if (!lastMsg.has(m.conversation_id)) lastMsg.set(m.conversation_id, m);
  }

  const items = rows.map((c): ConversationListItem => {
    const peerId = c.host_id === userId ? c.merchant_id : c.host_id;
    const peer = peerMap.get(peerId);
    const last = lastMsg.get(c.id) ?? null;
    return {
      id: c.id,
      peer: {
        id: peerId,
        name: peer?.name ?? "未知用户",
        avatarUrl: peer?.avatar_url ?? null,
        role: (peer?.role ?? "host") as Role,
      },
      gigTitle: c.gig_id ? gigMap.get(c.gig_id) ?? null : null,
      lastMessage: last
        ? { content: last.content, createdAt: last.created_at, senderId: last.sender_id }
        : null,
      // 没有消息时退化为会话创建时间，保证排序稳定
      updatedAt: last?.created_at ?? c.created_at,
    };
  });

  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/**
 * 单个会话详情（含全部消息）。
 *
 * 当前用户不是参与方时返回 null —— RLS 已经会挡掉数据，
 * 这里再判一次是为了给出「找不到会话」而不是空白页。
 */
export async function loadConversation(
  client: Client,
  conversationId: string,
  userId: string
): Promise<ConversationDetail | null> {
  const { data: c, error } = await client
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .maybeSingle();

  if (error || !c) return null;
  if (c.host_id !== userId && c.merchant_id !== userId) return null;

  const peerId = c.host_id === userId ? c.merchant_id : c.host_id;

  const [peerRes, gigRes, msgsRes] = await Promise.all([
    client.from("profiles").select("id, name, avatar_url, role").eq("id", peerId).maybeSingle(),
    c.gig_id
      ? client.from("gigs").select("id, title").eq("id", c.gig_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    client
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true }),
  ]);

  const peer = peerRes.data;
  const messages = msgsRes.data ?? [];
  const last = messages.length ? messages[messages.length - 1] : null;

  return {
    id: c.id,
    hostId: c.host_id,
    merchantId: c.merchant_id,
    peer: {
      id: peerId,
      name: peer?.name ?? "未知用户",
      avatarUrl: peer?.avatar_url ?? null,
      role: (peer?.role ?? "host") as Role,
    },
    gigTitle: gigRes.data?.title ?? null,
    messages,
    lastMessage: last
      ? { content: last.content, createdAt: last.created_at, senderId: last.sender_id }
      : null,
    updatedAt: last?.created_at ?? c.created_at,
  };
}
