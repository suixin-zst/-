"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { GigType } from "@/lib/types";

const GIG_TYPES: GigType[] = ["年会", "发布会", "路演", "展会", "婚礼", "直播", "其他"];

/**
 * 发布商单表单 —— 客户端组件
 *
 * 直接调 supabase client 插入 gigs；提交成功后跳回工作台
 */
export function NewGigForm({ merchantId }: { merchantId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<GigType>("年会");
  const [city, setCity] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [duration, setDuration] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!title.trim() || !city.trim() || !eventDate || !duration.trim()) {
      setError("请填写必填字段：标题、城市、日期、时长");
      setSubmitting(false);
      return;
    }

    const client = createClient();
    const { error: insertError } = await client.from("gigs").insert({
      merchant_id: merchantId,
      title: title.trim(),
      type,
      city: city.trim(),
      event_date: eventDate,
      duration: duration.trim(),
      budget_min: budgetMin ? parseInt(budgetMin) : null,
      budget_max: budgetMax ? parseInt(budgetMax) : null,
      description: description.trim() || null,
      requirements: requirements.trim() || null,
      status: "open",
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.push("/merchant/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <Label htmlFor="title">商单标题 *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="如：2026 春季新品发布会主持人"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">类型 *</Label>
          <Select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as GigType)}
          >
            {GIG_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="city">城市 *</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="如：上海"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="eventDate">活动日期 *</Label>
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="duration">时长 *</Label>
          <Input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="如：2小时 / 半天 / 全天"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="budgetMin">预算下限（元）</Label>
          <Input
            id="budgetMin"
            type="number"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            placeholder="5000"
          />
        </div>
        <div>
          <Label htmlFor="budgetMax">预算上限（元）</Label>
          <Input
            id="budgetMax"
            type="number"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            placeholder="10000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">详细描述</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="活动背景、流程、主持人需要做什么…"
          rows={5}
        />
      </div>

      <div>
        <Label htmlFor="requirements">要求</Label>
        <Textarea
          id="requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="经验、风格、语言能力等要求…"
          rows={3}
        />
      </div>

      {error ? (
        <p className="rounded-card bg-spotlight-tint px-4 py-3 text-sm text-spotlight-deep">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "发布中…" : "发布商单"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
