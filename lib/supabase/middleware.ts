import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import type { Database } from "@/lib/types";

/** 会话刷新 + 路由守卫（被根 middleware.ts 调用） */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 重要：不要在 auth.getUser() 前后插入其他逻辑（Supabase 官方要求）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // 游客可浏览的公开页面：商单大厅 / 主持人列表 / 商单详情 / 主持人主页（demo 数据兜底）
  const isPublicBrowse =
    path === "/host/gigs" ||
    path.startsWith("/host/gigs/") ||
    path.startsWith("/merchant/hosts") ||
    path === "/gig" ||
    path.startsWith("/gig/") ||
    (path.startsWith("/host/") &&
      !path.startsWith("/host/dashboard") &&
      !path.startsWith("/host/profile") &&
      !path.startsWith("/host/gigs"));

  // 需要登录的：工作台、聊天、资料编辑等（排除公开浏览页）
  const isProtected =
    !isPublicBrowse &&
    (path.startsWith("/host") ||
      path.startsWith("/merchant") ||
      path.startsWith("/chat") ||
      path.startsWith("/gig"));
  const isAuthPage = path.startsWith("/auth");

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 角色守卫：host 不能进 /merchant/**，merchant 不能进 /host/**
  if (user && (path.startsWith("/host") || path.startsWith("/merchant"))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile) {
      if (profile.role === "host" && path.startsWith("/merchant")) {
        const url = request.nextUrl.clone();
        url.pathname = "/host/dashboard";
        return NextResponse.redirect(url);
      }
      if (profile.role === "merchant" && path.startsWith("/host")) {
        const url = request.nextUrl.clone();
        url.pathname = "/merchant/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
