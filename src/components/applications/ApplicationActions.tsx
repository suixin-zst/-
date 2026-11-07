"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ApplicationActions({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function update(status: "accepted" | "rejected") {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: { message?: string };
      };
      if (!response.ok || !data.ok) {
        throw new Error(data?.error?.message || "操作失败。");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败。");
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="app-actions">
        <Button
          size="sm"
          variant="jade"
          onClick={() => update("accepted")}
          disabled={busy}
        >
          接受
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => update("rejected")}
          disabled={busy}
        >
          拒绝
        </Button>
      </div>
      {error ? <div className="error-text">{error}</div> : null}
    </div>
  );
}
