"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { applyToGig } from "@/lib/api";
import { Button } from "@/components/ui/button";

/**
 * 报名按钮 —— 主持人在商单详情页点击报名
 *
 * 走 lib/api.ts 的 applyToGig；成功后 router.refresh 刷新页面
 */
export function ApplyGigButton({ gigId }: { gigId: string }) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const router = useRouter();

  async function handleApply() {
    if (loading || applied) return;
    setLoading(true);

    const client = createClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const res = await applyToGig(client, gigId, "我对这个商单感兴趣，期待合作！");

    if (res.data) {
      setApplied(true);
      router.refresh();
    } else if (res.error) {
      alert(res.error);
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleApply} disabled={loading || applied}>
      {applied ? "已报名" : loading ? "报名中..." : "立即报名"}
    </Button>
  );
}
