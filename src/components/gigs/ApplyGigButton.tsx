"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ApplyGigButton({
  gigId,
  gigTitle,
  disabled,
}: {
  gigId: string;
  gigTitle: string;
  disabled?: boolean;
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
        body: JSON.stringify({ gigId, message }),
      });

      if (response.status === 401) {
        router.push(`/auth?next=/gig/${gigId}`);
        return;
      }

      const data = (await response.json()) as {
        ok: boolean;
        conversationId?: string;
        error?: { message?: string };
      };

      if (!response.ok || !data.ok || !data.conversationId) {
        throw new Error(data?.error?.message || "报名失败，请重试。");
      }

      router.push(`/chat?c=${data.conversationId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "报名失败，请重试。");
      setSending(false);
    }
  }

  return (
    <>
      <Button
        variant="gold"
        size="md"
        icon="arrow-right"
        iconRight
        block
        disabled={disabled}
        onClick={() => {
          setMessage("");
          setError("");
          setOpen(true);
        }}
      >
        {disabled ? "该商单已达成" : "报名并开聊"}
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
            aria-label={`报名 ${gigTitle}`}
            onClick={(event) => event.stopPropagation()}
          >
            <h3>报名「{gigTitle}」</h3>
            <p>附一段自我介绍，商家会先看你的主页和作品。报名后会直接打开站内会话。</p>
            <div className="field">
              <label>报名附言</label>
              <textarea
                className="textarea"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="例：有 6 年发布会主持经验，可中英双语，11月17日可彩排……"
              />
            </div>
            {error ? <div className="error-text">{error}</div> : null}
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button
                variant="stage"
                onClick={submit}
                disabled={sending}
              >
                {sending ? "提交中…" : "提交报名"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
