import { NextResponse } from "next/server";
import {
  createGig,
  getMerchantProfile,
} from "@/lib/server/db";
import { jsonError, num, str } from "@/lib/server/http";
import { getSessionUser } from "@/lib/session";
import type { GigType } from "@/lib/types";

const TYPES: GigType[] = ["婚礼", "年会", "发布会", "路演", "展会", "直播"];

function parseRequirements(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => str(item)).filter(Boolean).slice(0, 8);
  }
  return str(value)
    .split(/[,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("请先登录。", 401, "UNAUTHORIZED");
  if (user.role !== "merchant") {
    return jsonError("只有商家可以发布商单。", 403, "FORBIDDEN");
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = str(body.title);
    const type = str(body.type);
    const city = str(body.city);
    const eventDate = str(body.eventDate);
    const duration = str(body.duration);
    const budgetMin = Math.round(num(body.budgetMin));
    const budgetMax = Math.round(num(body.budgetMax));
    const description = str(body.description);

    if (!title) return jsonError("请填写活动名称。");
    if (!TYPES.includes(type as GigType)) return jsonError("活动类型不正确。");
    if (!city) return jsonError("请填写活动城市。");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      return jsonError("请选择活动日期。");
    }
    if (!duration) return jsonError("请选择活动时长。");
    if (budgetMin <= 0 || budgetMax <= 0) return jsonError("请填写预算区间。");
    if (budgetMin > budgetMax) return jsonError("预算上限不能低于下限。");

    const merchantProfile = await getMerchantProfile(user.id);

    const gig = await createGig({
      merchant_id: user.id,
      company: merchantProfile?.company || user.name,
      title,
      type: type as GigType,
      city,
      event_date: eventDate,
      duration,
      budget_min: budgetMin,
      budget_max: budgetMax,
      requirements: parseRequirements(body.requirements),
      description,
    });

    return NextResponse.json({ ok: true, gig });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "发布失败。",
      500,
      "INTERNAL",
    );
  }
}
