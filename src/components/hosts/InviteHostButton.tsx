"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function InviteHostButton({
  hostId,
  hostName,
  variant = "gold",
  size = "lg",
}: {
  hostId: string;
  hostName: string;
  variant?: "gold" | "stage" | "primary";
  size?: "sm" | "md" | "lg";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit() {
    setError("");
    setSending(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostId, message }),
      });

      if (response.status === 401) {
        router.push(`/auth?next=/host/${hostId}`);
        return;
      }

      const data = (await response.json()) as {
        ok: boolean;
        conversationId?: string;
        error?: { message?: string };
      };

      if (!response.ok || !data.ok || !data.conversationId) {
        throw new Error(data?.error?.message || "邀约发送失败，请重试。");
      }

      router.push(`/chat?c=${data.conversationId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "邀约发送失败，请重试。");
      setSending(false);
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        icon="message"
        onClick={() => {
          setMessage("");
          setError("");
          setOpen(true);
        }}
      >
        发起邀约
      </Button>

      {open ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`向 ${hostName} 发起邀约`}
            onClick={(event) => event.stopPropagation()}
          >
            <h3>向 {hostName} 发起邀约</h3>
            <p>
              邀约会写入报名表，并直接打开你和 {hostName} 的站内会话。
              未成交前不交换手机号。
            </p>
            <div className="field">
              <label>邀约留言</label>
              <textarea
                className="textarea"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="例：11月18日新车发布会，想邀请您担任主会场主持……"
              />
            </div>
            {error ? <div className="error-text">{error}</div> : null}
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button variant="stage" onClick={submit} disabled={sending}>
                {sending ? "发送中…" : "发送邀约"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
