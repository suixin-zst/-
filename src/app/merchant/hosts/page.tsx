import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { HostDirectory } from "@/components/hosts/HostDirectory";
import { getHosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "找主持人 · 台前 TAIQIAN",
  description: "按城市、风格、预算筛选主持人，先看作品和评价，再直接开聊。",
};

export const dynamic = "force-dynamic";

export default async function HostsPage() {
  const hosts = await getHosts();

  return (
    <main>
      <section className="page-head">
        <div className="container page-head-row">
          <div>
            <span className="eyebrow">Find a host</span>
            <h1 className="display-lg page-title">找到对的主持人。</h1>
            <p className="page-sub">
              不靠一张嘴介绍，先看现场作品、真实评价和透明报价。选中了，直接开聊。
            </p>
          </div>
          <Button href="/merchant/gig/new" variant="jade" icon="wallet">
            直接发布商单
          </Button>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 72 }}>
        <HostDirectory hosts={hosts} />
      </section>
    </main>
  );
}
