import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NewGigForm } from "@/components/forms/NewGigForm";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "发布商单 · 台前 TAIQIAN",
  description: "两分钟写清需求，让对的主持人来报名。",
};

export default async function NewGigPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth?next=/merchant/gig/new");
  if (user.role !== "merchant") redirect("/host/dashboard");

  return (
    <main>
      <section className="page-head">
        <div className="container page-head-row">
          <div>
            <span className="eyebrow">Post a call</span>
            <h1 className="display-lg page-title">发布一张商单。</h1>
            <p className="page-sub">
              城市、日期、预算、要求，写清楚就行。发布后主持人可以直接报名，
              你也可以主动去主持人列表邀约。
            </p>
          </div>
          <div className="hidden items-center gap-2 text-[11px] text-[var(--muted)] md:flex">
            <span className="tag tag-gold">平均 2 分钟完成</span>
            <span className="tag">发布免费</span>
          </div>
        </div>
      </section>

      <section className="container">
        <NewGigForm />
      </section>
    </main>
  );
}
