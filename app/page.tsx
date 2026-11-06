import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 首页占位版 —— 主力在 h9–14 重做为「双面板 hover 展开」签名交互
 * 契约（改样式随便，这两条不许动）：
 *  1. 两个入口的跳转目标固定为 /auth/signup?role=host | ?role=merchant
 *  2. 未登录状态下的门面，不出现任何业务数据
 */
export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 text-center">
      <p className="font-display text-sm tracking-[0.3em] text-spotlight">台前 TAIQIAN</p>
      <h1 className="mt-6 font-display text-5xl font-semibold leading-tight">
        让专业主持人
        <br />
        被看见、被雇佣
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-ink-soft">
        商家发单、主持人接单、双方直接聊。砍掉微信群和中介抽成。
      </p>
      <div className="mt-12 flex justify-center gap-4">
        <Link href="/auth/signup?role=host">
          <Button size="lg">我是主持人</Button>
        </Link>
        <Link href="/auth/signup?role=merchant">
          <Button size="lg" variant="outline">
            我是商家
          </Button>
        </Link>
      </div>
      <p className="mt-8 text-sm text-ink-soft">
        已有账号？{" "}
        <Link href="/auth/login" className="text-spotlight underline-offset-4 hover:underline">
          登录
        </Link>
      </p>
    </div>
  );
}
