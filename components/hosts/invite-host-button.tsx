"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { startConversation } from "@/lib/api";

/**
 * 商家邀约按钮 —— 商家在主持人详情页发起直聊
 *
 * 走 lib/api.ts 的 startConversation（gigId 传 null 表示脱离商单的直聊）
 */
export function InviteHostButton({
  hostId,
  hostName,
}: {
  hostId: string;
  hostName: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleInvite() {
    if (loading) return;
    setLoading(true);

    const client = createClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const res = await startConversation(client, {
      gigId: null,
      hostId,
      merchantId: user.id,
    });

    if (res.id) {
      router.push(`/chat/${res.id}`);
    } else {
      alert(res.error ?? "发起会话失败");
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleInvite} disabled={loading}>
      {loading ? "发起中..." : `联系 ${hostName}`}
    </Button>
  );
}
