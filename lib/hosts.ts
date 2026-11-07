/**
 * 主持人数据层 —— 页面只调这里的函数，不自己拼查询
 *
 * 和 lib/chat.ts 同一思路：数据访问收在一处，调用方不关心 Supabase API 细节
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, HostProfileRow, WorkRow, ProfileRow, GigRow, ReviewRow } from "@/lib/types";

type Client = SupabaseClient<Database>;

/** 主持人公开档案（profile + host_profile + works） */
export interface HostDetail {
  id: string;
  name: string;
  avatarUrl: string | null;
  city: string | null;
  styles: string[];
  bio: string | null;
  priceHourly: number | null;
  priceHalfDay: number | null;
  priceFullDay: number | null;
  experienceYears: number | null;
  isVerified: boolean;
  rating: number;
  ratingCount: number;
  works: WorkRow[];
}

/** 商单列表项（附带商家名） */
export interface GigWithMerchant extends GigRow {
  merchantName: string;
}

/** 主持人卡片（列表用，不含作品） */
export interface HostListItem {
  id: string;
  name: string;
  avatarUrl: string | null;
  city: string | null;
  styles: string[];
  priceHourly: number | null;
  priceHalfDay: number | null;
  rating: number;
  ratingCount: number;
  isVerified: boolean;
}

/** 查单个主持人详情 */
export async function loadHost(
  client: Client,
  hostId: string
): Promise<HostDetail | null> {
  const [profileRes, hostProfileRes, worksRes] = await Promise.all([
    client.from("profiles").select("*").eq("id", hostId).maybeSingle(),
    client.from("host_profiles").select("*").eq("user_id", hostId).maybeSingle(),
    client
      .from("works")
      .select("*")
      .eq("host_id", hostId)
      .order("sort", { ascending: true }),
  ]);

  const profile = profileRes.data;
  const hp = hostProfileRes.data;
  if (!profile) return null;

  return {
    id: profile.id,
    name: profile.name,
    avatarUrl: profile.avatar_url,
    city: hp?.city ?? null,
    styles: hp?.styles ?? [],
    bio: hp?.bio ?? null,
    priceHourly: hp?.price_hourly ?? null,
    priceHalfDay: hp?.price_half_day ?? null,
    priceFullDay: hp?.price_full_day ?? null,
    experienceYears: hp?.experience_years ?? null,
    isVerified: hp?.is_verified ?? false,
    rating: Number(hp?.rating ?? 0),
    ratingCount: hp?.rating_count ?? 0,
    works: worksRes.data ?? [],
  };
}

/** 查主持人列表（带 host_profiles） */
export async function loadHosts(client: Client): Promise<HostListItem[]> {
  const { data: profiles } = await client
    .from("profiles")
    .select("id, name, avatar_url")
    .eq("role", "host");

  if (!profiles || profiles.length === 0) return [];

  const hostIds = profiles.map((p) => p.id);
  const { data: hostProfiles } = await client
    .from("host_profiles")
    .select("*")
    .in("user_id", hostIds);

  const hpMap = new Map((hostProfiles ?? []).map((hp) => [hp.user_id, hp]));

  return profiles.map((p) => {
    const hp = hpMap.get(p.id);
    return {
      id: p.id,
      name: p.name,
      avatarUrl: p.avatar_url,
      city: hp?.city ?? null,
      styles: hp?.styles ?? [],
      priceHourly: hp?.price_hourly ?? null,
      priceHalfDay: hp?.price_half_day ?? null,
      rating: Number(hp?.rating ?? 0),
      ratingCount: hp?.rating_count ?? 0,
      isVerified: hp?.is_verified ?? false,
    };
  });
}

/** 查开放商单列表（附带商家名） */
export async function loadOpenGigs(client: Client): Promise<GigWithMerchant[]> {
  const { data: gigs } = await client
    .from("gigs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (!gigs || gigs.length === 0) return [];

  const merchantIds = Array.from(new Set(gigs.map((g) => g.merchant_id)));
  const { data: merchants } = await client
    .from("profiles")
    .select("id, name")
    .in("id", merchantIds);

  const nameMap = new Map((merchants ?? []).map((m) => [m.id, m.name]));

  return gigs.map((g) => ({
    ...g,
    merchantName: nameMap.get(g.merchant_id) ?? "商家",
  }));
}

/** 查主持人的报名列表（工作台用） */
export async function loadHostApplications(client: Client, hostId: string) {
  const { data: apps } = await client
    .from("applications")
    .select("*, gigs(title, city, type, event_date, status)")
    .eq("host_id", hostId)
    .order("created_at", { ascending: false });

  return apps ?? [];
}

/** 查当前主持人的 host_profile（编辑页用） */
export async function loadHostProfile(
  client: Client,
  hostId: string
): Promise<HostProfileRow | null> {
  const { data } = await client
    .from("host_profiles")
    .select("*")
    .eq("user_id", hostId)
    .maybeSingle();
  return data;
}

/** 查主持人的作品列表 */
export async function loadWorks(client: Client, hostId: string): Promise<WorkRow[]> {
  const { data } = await client
    .from("works")
    .select("*")
    .eq("host_id", hostId)
    .order("sort", { ascending: true });
  return data ?? [];
}

/** 查主持人的评价 */
export async function loadHostReviews(
  client: Client,
  hostId: string
): Promise<(ReviewRow & { reviewerName: string })[]> {
  const { data: reviews } = await client
    .from("reviews")
    .select("*")
    .eq("reviewee_id", hostId)
    .order("created_at", { ascending: false });

  if (!reviews || reviews.length === 0) return [];

  const reviewerIds = Array.from(new Set(reviews.map((r) => r.reviewer_id)));
  const { data: reviewers } = await client
    .from("profiles")
    .select("id, name")
    .in("id", reviewerIds);

  const nameMap = new Map((reviewers ?? []).map((p) => [p.id, p.name]));
  return reviews.map((r) => ({
    ...r,
    reviewerName: nameMap.get(r.reviewer_id) ?? "合作商家",
  }));
}
