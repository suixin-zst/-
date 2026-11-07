import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import { formatBudget, formatEventDate, gigStatusLabel } from "@/lib/format";
import type { Gig } from "@/lib/types";

export function GigCard({ gig }: { gig: Gig }) {
  return (
    <Link href={`/gig/${gig.id}`} className="gig-card">
      <div className="gig-top">
        <Tag tone="gold">{gig.type}</Tag>
        <span className={`tag ${gig.status === "open" ? "tag-jade" : ""}`}>
          {gig.status === "open" ? <span className="status-dot" /> : null}
          {gigStatusLabel(gig.status)}
        </span>
      </div>

      <h3 className="gig-title">{gig.title}</h3>
      <div className="gig-company">{gig.company}</div>

      <div className="gig-meta">
        <span>
          <Icon name="map-pin" size={11} />
          {gig.city}
        </span>
        <span>
          <Icon name="calendar" size={11} />
          {formatEventDate(gig.eventDate)}
        </span>
        <span>
          <Icon name="clock" size={11} />
          {gig.duration}
        </span>
        <span>
          <Icon name="users" size={11} />
          {gig.applicants} 人已报名
        </span>
      </div>

      <div className="gig-foot">
        <div className="gig-budget">
          <b>{formatBudget(gig.budgetMin, gig.budgetMax)}</b>
          <span>预算区间</span>
        </div>
        <span className="gig-applicants">
          查看详情
          <Icon name="arrow-right" size={12} />
        </span>
      </div>
    </Link>
  );
}
