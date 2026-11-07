import { NextResponse } from "next/server";
import {
  getHostProfile,
  updateUserName,
  upsertHostProfile,
  type DbHostProfile,
} from "@/lib/server/db";
import { jsonError, num, publicUser, str } from "@/lib/server/http";
import { getSessionUser } from "@/lib/session";
import type { HostStyle } from "@/lib/types";

const STYLES: HostStyle[] = [
  "婚礼",
  "年会",
  "发布会",
  "路演",
  "展会",
  "直播",
];

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("未登录。", 401, "UNAUTHORIZED");
  if (user.role !== "host") return jsonError("只有主持人可以编辑资料。", 403);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const patch: Partial<DbHostProfile> = {};

    const name = str(body.name);
    if (name && name !== user.name) {
      await updateUserName(user.id, name);
    }

    if (typeof body.city === "string") patch.city = str(body.city);
    if (typeof body.tagline === "string") patch.tagline = str(body.tagline);
    if (typeof body.bio === "string") patch.bio = str(body.bio);
    if (Array.isArray(body.styles)) {
      patch.styles = body.styles
        .map((item) => str(item))
        .filter((item): item is HostStyle =>
          STYLES.includes(item as HostStyle),
        );
    }
    if (body.priceHourly !== undefined) {
      patch.price_hourly = Math.max(0, Math.round(num(body.priceHourly)));
    }
    if (body.priceHalfDay !== undefined) {
      patch.price_half_day = Math.max(0, Math.round(num(body.priceHalfDay)));
    }
    if (body.priceFullDay !== undefined) {
      patch.price_full_day = Math.max(0, Math.round(num(body.priceFullDay)));
    }
    if (body.experienceYears !== undefined) {
      patch.experience_years = Math.max(
        0,
        Math.round(num(body.experienceYears)),
      );
    }

    const profile = await upsertHostProfile(user.id, patch);
    const refreshed = await getHostProfile(user.id);

    return NextResponse.json({
      ok: true,
      user: publicUser({ ...user, name: name || user.name }),
      profile: refreshed ?? profile,
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "保存失败。",
      500,
      "INTERNAL",
    );
  }
}
