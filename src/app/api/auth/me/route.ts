import { NextResponse } from "next/server";
import { getHostProfile, getMerchantProfile } from "@/lib/server/db";
import { jsonError, publicUser } from "@/lib/server/http";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return jsonError("未登录。", 401, "UNAUTHORIZED");

  const hostProfile =
    user.role === "host" ? await getHostProfile(user.id) : null;
  const merchantProfile =
    user.role === "merchant" ? await getMerchantProfile(user.id) : null;

  return NextResponse.json({
    ok: true,
    user: publicUser(user),
    hostProfile,
    merchantProfile,
  });
}
