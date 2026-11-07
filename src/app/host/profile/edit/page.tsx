import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HostProfileForm } from "@/components/hosts/HostProfileForm";
import { Button } from "@/components/ui/Button";
import { getHostProfile, listWorks } from "@/lib/server/db";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "编辑主页 · 台前 TAIQIAN",
  description: "补全你的作品、报价和档期。",
};

export default async function HostProfileEditPage() {
  const user = await requireRole("host");
  const profile = await getHostProfile(user.id);

  if (!profile) redirect("/host/dashboard");

  const works = await listWorks(user.id);

  return (
    <main>
      <section className="container dashboard-head">
        <div>
          <span className="eyebrow">Host profile</span>
          <h1 className="display-lg dashboard-title">把你的主页，补完整。</h1>
          <p className="page-sub">
            作品、报价、一句话定位。商家先看这些，再决定要不要聊。
          </p>
        </div>
        <div className="action-row">
          <Button href="/host/dashboard" variant="ghost">
            返回工作台
          </Button>
          <Button href={`/host/${user.id}`} variant="ghost">
            查看公开主页
          </Button>
        </div>
      </section>

      <section className="container">
        <HostProfileForm
          user={{ id: user.id, name: user.name, email: user.email }}
          profile={{
            city: profile.city,
            tagline: profile.tagline,
            bio: profile.bio,
            styles: profile.styles,
            priceHourly: profile.price_hourly,
            priceHalfDay: profile.price_half_day,
            priceFullDay: profile.price_full_day,
            experienceYears: profile.experience_years,
          }}
          works={works.map((work) => ({
            id: work.id,
            title: work.title,
            type: work.type,
            duration: work.duration,
            url: work.url,
          }))}
          tone={profile.tone}
        />
      </section>
    </main>
  );
}
