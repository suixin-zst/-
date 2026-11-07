"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import type { Host, HostStyle } from "@/lib/types";
import { HostCard } from "./HostCard";

const STYLES: Array<"全部" | HostStyle> = [
  "全部",
  "婚礼",
  "年会",
  "发布会",
  "路演",
  "展会",
  "直播",
];

const PRICE_OPTIONS = [
  { label: "价格不限", value: 0 },
  { label: "半天 ≤ ¥3,000", value: 3000 },
  { label: "半天 ≤ ¥5,000", value: 5000 },
  { label: "半天 ≤ ¥8,000", value: 8000 },
];

const SORT_OPTIONS = [
  { label: "综合推荐", value: "recommended" },
  { label: "价格从低到高", value: "price" },
  { label: "经验从多到少", value: "experience" },
];

export function HostDirectory({ hosts }: { hosts: Host[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("全部");
  const [style, setStyle] = useState<"全部" | HostStyle>("全部");
  const [maxPrice, setMaxPrice] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState("recommended");

  const cities = useMemo(
    () => ["全部", ...Array.from(new Set(hosts.map((host) => host.city)))],
    [hosts],
  );

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const list = hosts.filter((host) => {
      if (city !== "全部" && host.city !== city) return false;
      if (style !== "全部" && !host.styles.includes(style)) return false;
      if (maxPrice > 0 && host.priceHalfDay > maxPrice) return false;
      if (verifiedOnly && !host.verified) return false;
      if (keyword) {
        const haystack =
          `${host.name}${host.city}${host.styles.join("")}${host.tagline}`.toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }
      return true;
    });

    if (sort === "price") {
      list.sort((a, b) => a.priceHalfDay - b.priceHalfDay);
    } else if (sort === "experience") {
      list.sort((a, b) => b.experienceYears - a.experienceYears);
    } else {
      list.sort((a, b) => b.rating * b.ratingCount - a.rating * a.ratingCount);
    }

    return list;
  }, [hosts, query, city, style, maxPrice, verifiedOnly, sort]);

  return (
    <div>
      <div className="filter-card">
        <div className="filter-row">
          <div className="search-box">
            <Icon name="search" size={15} />
            <input
              className="input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜名字、城市或风格"
              aria-label="搜索主持人"
            />
          </div>

          <select
            className="select"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            aria-label="城市"
          >
            {cities.map((item) => (
              <option key={item} value={item}>
                {item === "全部" ? "全部城市" : item}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            aria-label="价格"
          >
            {PRICE_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="排序"
          >
            {SORT_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="chip-row">
          {STYLES.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${style === item ? "on" : ""}`}
              onClick={() => setStyle(item)}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            className={`chip ${verifiedOnly ? "on" : ""}`}
            onClick={() => setVerifiedOnly((value) => !value)}
          >
            只看已认证
          </button>
        </div>
      </div>

      <div className="filter-meta">
        <span>
          共 <b style={{ color: "var(--ink)" }}>{filtered.length}</b> 位主持人
        </span>
        <span>报价为半天起价 · 可接档期以主页为准</span>
      </div>

      {filtered.length ? (
        <div className="host-grid">
          {filtered.map((host) => (
            <HostCard key={host.id} host={host} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="search"
          title="没有找到匹配的主持人"
          description="试试放宽城市或价格区间，或者直接发布一张商单，让主持人来报名。"
          action={
            <Button href="/merchant/gig/new" variant="stage" size="sm">
              发布商单
            </Button>
          }
        />
      )}
    </div>
  );
}
