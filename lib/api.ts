/**
 * 跨领地共享函数（冻结契约的一部分）
 *
 * 这三个函数是两侧业务唯一的逻辑接缝：报名/开聊的动作发生在
 * 两边的页面上，但语义必须完全一致，所以收在 lib 由契约锁定。
 * 签名不许改；要加参数 = 群里喊 + 地基执笔人执行。
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

type Client = SupabaseClient<Database>;

/** 当前登录用户的 profile（注册时触发器已自动建档） */
export async function getMyProfile(client: Client) {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { profile: null };

  const { data } = await client
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { profile: data };
}

/** 主持人报名一张商单（幂等：重复报名直接返回原记录） */
export async function applyToGig(client: Client, gigId: string, message?: string) {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { error: "未登录" };

  const { data: existing } = await client
    .from("applications")
    .select("id, status")
    .eq("gig_id", gigId)
    .eq("host_id", user.id)
    .maybeSingle();
  if (existing) return { data: existing };

  const { data, error } = await client
    .from("applications")
    .insert({ gig_id: gigId, host_id: user.id, initiator: "host", message: message ?? null } as any)
    .select("id, status")
    .single();
  if (error) return { error: error.message };
  return { data };
}

/** 开启（或复用）一段会话：报名后商家发起、商家详情页主动联系，都走这里 */
export async function startConversation(
  client: Client,
  params: { gigId: string | null; hostId: string; merchantId: string }
) {
  const { gigId, hostId, merchantId } = params;

  // 同一商单下同一对人只保留一段会话；脱离商单的直聊以 gig_id 为空区分
  const { data: existing } = await (
    gigId !== null
      ? client
          .from("conversations")
          .select("id")
          .eq("gig_id", gigId)
          .eq("host_id", hostId)
          .eq("merchant_id", merchantId)
      : client
          .from("conversations")
          .select("id")
          .is("gig_id", null)
          .eq("host_id", hostId)
          .eq("merchant_id", merchantId)
  ).maybeSingle();
  if (existing) return { id: (existing as any).id };

  const { data, error } = await client
    .from("conversations")
    .insert({ gig_id: gigId, host_id: hostId, merchant_id: merchantId } as any)
    .select("id")
    .single();
  if (error) return { error: error.message };
  return { id: (data as any).id };
}
