"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import type { Gig, GigType } from "@/lib/types";
import { GigCard } from "./GigCard";

const TYPES: Array<"全部" | GigType> = [
  "全部",
  "婚礼",
  "年会",
  "发布会",
  "路演",
  "展会",
  "直播",
];

const BUDGETS = [
  { label: "预算不限", value: 0 },
  { label: "¥3,000 以下", value: 1 },
  { label: "¥3,000–8,000", value: 2 },
  { label: "¥8,000 以上", value: 3 },
];

const SORTS = [
  { label: "最新发布", value: "latest" },
  { label: "预算从高到低", value: "budget" },
  { label: "活动日期最近", value: "date" },
];

function matchBudget(gig: Gig, bucket: number): boolean {
  if (bucket === 0) return true;
  if (bucket === 1) return gig.budgetMax <= 3000;
  if (bucket === 2) return gig.budgetMax >= 3000 && gig.budgetMin <= 8000;
  return gig.budgetMax >= 8000;
}

export function GigDirectory({ gigs }: { gigs: Gig[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("全部");
  const [type, setType] = useState<"全部" | GigType>("全部");
  const [budget, setBudget] = useState(0);
  const [openOnly, setOpenOnly] = useState(true);
  const [sort, setSort] = useState("latest");

  const cities = useMemo(
    () => ["全部", ...Array.from(new Set(gigs.map((gig) => gig.city)))],
    [gigs],
  );

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const list = gigs.filter((gig) => {
      if (openOnly && gig.status !== "open") return false;
      if (city !== "全部" && gig.city !== city) return false;
      if (type !== "全部" && gig.type !== type) return false;
      if (!matchBudget(gig, budget)) return false;
      if (keyword) {
        const haystack =
          `${gig.title}${gig.company}${gig.city}${gig.type}${gig.description}`.toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }
      return true;
    });

    if (sort === "budget") {
      list.sort((a, b) => b.budgetMax - a.budgetMax);
    } else if (sort === "date") {
      list.sort((a, b) => (a.eventDate < b.eventDate ? -1 : 1));
    } else {
      list.sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1));
    }

    return list;
  }, [gigs, query, city, type, budget, openOnly, sort]);

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
              placeholder="搜商单、公司或城市"
              aria-label="搜索商单"
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
            value={budget}
            onChange={(event) => setBudget(Number(event.target.value))}
            aria-label="预算"
          >
            {BUDGETS.map((item) => (
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
            {SORTS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="chip-row">
          {TYPES.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${type === item ? "on" : ""}`}
              onClick={() => setType(item)}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            className={`chip ${openOnly ? "on" : ""}`}
            onClick={() => setOpenOnly((value) => !value)}
          >
            只看招募中
          </button>
        </div>
      </div>

      <div className="filter-meta">
        <span>
          共 <b style={{ color: "var(--ink)" }}>{filtered.length}</b> 张商单
        </span>
        <span>预算为商家填写的区间 · 以最终沟通为准</span>
      </div>

      {filtered.length ? (
        <div className="gig-grid">
          {filtered.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="calendar"
          title="暂时没有匹配的商单"
          description="换个城市或类型试试，或者完善主页，让商家主动来邀约你。"
          action={
            <Button href="/host/lin-zhiyao" variant="stage" size="sm">
              看看主页示例
            </Button>
          }
        />
      )}
    </div>
  );
}
