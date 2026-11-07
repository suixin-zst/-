import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "台前 TAIQIAN · 主持人 × 商家直聘平台",
  description:
    "商家发单、主持人接单、双方直接聊。作品说话，透明报价，砍掉中介抽成。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
