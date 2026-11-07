import Link from "next/link";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { Icon } from "@/components/ui/Icon";
import { formatNumber } from "@/lib/format";
import type { Host } from "@/lib/types";

export function HostCard({ host }: { host: Host }) {
  return (
    <Link href={`/host/${host.id}`} className="host-card">
      <div className={`host-portrait tone-${host.tone}`}>
        <div className="host-portrait-top">
          <span className="tag tag-ink">{host.city}</span>
          {host.verified ? <span className="badge-verified">已认证</span> : null}
        </div>
        <span className="initial">{host.name.slice(0, 1)}</span>
        <div className="host-portrait-bottom">
          <Rating rating={host.rating} count={host.ratingCount} />
          <span>{host.experienceYears} 年经验</span>
        </div>
      </div>

      <div className="host-body">
        <div className="host-name">{host.name}</div>
        <div className="host-city">
          <Icon name="map-pin" size={11} />
          {host.city}
        </div>

        <div className="host-tags">
          {host.styles.map((style) => (
            <Tag key={style}>{style}</Tag>
          ))}
        </div>

        <div className="host-foot">
          <div className="host-price">
            <b>¥{formatNumber(host.priceHalfDay)}</b>
            <span>半天起</span>
          </div>
          <span className="host-arrow">
            <Icon name="arrow-up-right" size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
