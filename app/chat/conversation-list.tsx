"use client";

/**
 * 会话列表（左栏）—— 客户端组件
 *
 * 之所以是客户端：当前选中项要高亮，且切会话时整块列表不应重新请求。
 * 数据由服务端 loadConversations 传入；本组件只负责渲染与跳转。
 */

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { formatListTime } from "@/lib/format";
import type { ConversationListItem } from "@/lib/chat";

interface Props {
  items: ConversationListItem[];
  /** 当前登录用户 id，用来判断最后一条消息是不是「我」发的 */
  currentUserId: string;
  /** 当前打开会话的 id；首页为 null */
  activeId: string | null;
}

export function ConversationList({ items, currentUserId, activeId }: Props) {
  // 时间文案依赖「现在」，只在客户端算，避免服务端/客户端渲染不一致
  const now = new Date();

  if (items.length === 0) {
    return (
      <EmptyState
        title="还没有会话"
        hint="报名商单或被商家邀约后，会话会出现在这里"
        className="md:min-h-[28rem]"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-line bg-card">
      {items.map((c, i) => {
        const active = c.id === activeId;
        const last = c.lastMessage;
        // 「我：」前缀——和微信一致，扫一眼就知道该谁回
        const preview = last
          ? `${last.senderId === currentUserId ? "我：" : ""}${last.content}`
          : "还没有消息，打个招呼吧";

        return (
          <Link
            key={c.id}
            href={`/chat/${c.id}`}
            className={cn(
              "flex gap-3 px-4 py-3 transition-colors",
              i > 0 && "border-t border-line",
              active ? "bg-spotlight-tint" : "hover:bg-paper"
            )}
          >
            <Avatar src={c.peer.avatarUrl} name={c.peer.name} size="md" />

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate font-medium text-ink">{c.peer.name}</span>
                <span className="shrink-0 text-xs text-ink-soft">
                  {formatListTime(c.updatedAt, now)}
                </span>
              </div>

              <div className="mt-0.5 flex items-center gap-1.5">
                <Badge tone={c.peer.role === "host" ? "spotlight" : "outline"} className="shrink-0">
                  {c.peer.role === "host" ? "主持人" : "商家"}
                </Badge>
                <span className="truncate text-xs text-ink-soft">
                  {c.gigTitle ?? "直接沟通"}
                </span>
              </div>

              <p
                className={cn(
                  "mt-1 truncate text-sm",
                  last ? "text-ink-soft" : "text-ink-soft/60"
                )}
              >
                {preview}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
