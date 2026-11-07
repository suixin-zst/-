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
import type { HostProfileRow } from "@/lib/types";

interface Props {
  hostId: string;
  profile: HostProfileRow;
}

/**
 * 主持人资料编辑表单 —— 客户端组件
 *
 * 直接调 supabase client 更新 host_profiles；提交成功后跳回工作台
 */
export function HostProfileForm({ hostId, profile }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [city, setCity] = useState(profile.city ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [stylesStr, setStylesStr] = useState(profile.styles.join(", "));
  const [priceHourly, setPriceHourly] = useState(profile.price_hourly?.toString() ?? "");
  const [priceHalfDay, setPriceHalfDay] = useState(profile.price_half_day?.toString() ?? "");
  const [priceFullDay, setPriceFullDay] = useState(profile.price_full_day?.toString() ?? "");
  const [experienceYears, setExperienceYears] = useState(
    profile.experience_years?.toString() ?? ""
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const client = createClient();
    const { error: updateError } = await client
      .from("host_profiles")
      .update({
        city: city.trim() || null,
        bio: bio.trim() || null,
        styles: stylesStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        price_hourly: priceHourly ? parseInt(priceHourly) : null,
        price_half_day: priceHalfDay ? parseInt(priceHalfDay) : null,
        price_full_day: priceFullDay ? parseInt(priceFullDay) : null,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
      })
      .eq("user_id", hostId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push("/host/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <Label htmlFor="city">城市</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="如：上海"
        />
      </div>

      <div>
        <Label htmlFor="styles">风格标签（逗号分隔）</Label>
        <Input
          id="styles"
          value={stylesStr}
          onChange={(e) => setStylesStr(e.target.value)}
          placeholder="婚礼, 年会, 发布会"
        />
      </div>

      <div>
        <Label htmlFor="bio">关于我</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="介绍你的主持风格和从业经历…"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="priceHourly">时薪（元）</Label>
          <Input
            id="priceHourly"
            type="number"
            value={priceHourly}
            onChange={(e) => setPriceHourly(e.target.value)}
            placeholder="1500"
          />
        </div>
        <div>
          <Label htmlFor="priceHalfDay">半天（元）</Label>
          <Input
            id="priceHalfDay"
            type="number"
            value={priceHalfDay}
            onChange={(e) => setPriceHalfDay(e.target.value)}
            placeholder="5000"
          />
        </div>
        <div>
          <Label htmlFor="priceFullDay">全天（元）</Label>
          <Input
            id="priceFullDay"
            type="number"
            value={priceFullDay}
            onChange={(e) => setPriceFullDay(e.target.value)}
            placeholder="8000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="experienceYears">从业年限</Label>
        <Input
          id="experienceYears"
          type="number"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          placeholder="5"
        />
      </div>

      {error ? (
        <p className="rounded-card bg-spotlight-tint px-4 py-3 text-sm text-spotlight-deep">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "保存中…" : "保存资料"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
