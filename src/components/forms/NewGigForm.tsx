"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import { formatBudget, formatEventDate } from "@/lib/format";
import type { GigType } from "@/lib/types";

const TYPES: GigType[] = ["婚礼", "年会", "发布会", "路演", "展会", "直播"];
const DURATIONS = ["2 小时", "半天", "全天"];

interface FormState {
  title: string;
  type: GigType;
  city: string;
  eventDate: string;
  duration: string;
  budgetMin: string;
  budgetMax: string;
  requirements: string;
  description: string;
}

const INITIAL: FormState = {
  title: "",
  type: "发布会",
  city: "上海",
  eventDate: "2026-11-18",
  duration: "半天",
  budgetMin: "4000",
  budgetMax: "6000",
  requirements: "",
  description: "",
};

const DEMO: FormState = {
  title: "新能源新车发布会 · 主会场主持",
  type: "发布会",
  city: "上海",
  eventDate: "2026-11-18",
  duration: "半天",
  budgetMin: "4000",
  budgetMax: "6000",
  requirements: "中英双语，发布会经验，可彩排",
  description:
    "新车上市发布会，主会场约 300 人，含媒体与经销商。需要主持人完成开场、产品讲解串场、价格公布和媒体问答环节。11 月 17 日下午彩排一次。",
};

export function NewGigForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const min = Number(form.budgetMin) || 0;
  const max = Number(form.budgetMax) || 0;
  const requirementTags = form.requirements
    .split(/[,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};

    if (!form.title.trim()) next.title = "请填写活动名称";
    if (!form.city.trim()) next.city = "请填写活动城市";
    if (!form.eventDate) next.eventDate = "请选择活动日期";
    if (!min) next.budgetMin = "请填写预算下限";
    if (!max) next.budgetMax = "请填写预算上限";
    if (min && max && min > max) next.budgetMax = "上限不能低于下限";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budgetMin: min,
          budgetMax: max,
          requirements: requirementTags,
        }),
      });

      if (response.status === 401) {
        router.push("/auth?next=/merchant/gig/new");
        return;
      }

      const data = (await response.json()) as {
        ok: boolean;
        gig?: { id: string };
        error?: { message?: string };
      };

      if (!response.ok || !data.ok || !data.gig) {
        throw new Error(data?.error?.message || "发布失败，请重试。");
      }

      setCreatedId(data.gig.id);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "发布失败，请重试。",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="form-card" style={{ textAlign: "center", padding: "54px 32px" }}>
        <div className="empty-mark">
          <Icon name="check" size={20} />
        </div>
        <h2 className="display-md">商单已发布</h2>
        <p className="section-sub" style={{ margin: "8px auto 0", maxWidth: 420 }}>
          演示环境：正式版会写入 gigs 表，并进入主持人端的商单大厅。现在可以去大厅看看这条商单的展示效果。
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginTop: 22,
            flexWrap: "wrap",
          }}
        >
          <Button
            href={createdId ? `/gig/${createdId}` : "/host/gigs"}
            variant="gold"
          >
            查看刚发布的商单
          </Button>
          <Button href="/host/gigs" variant="ghost">
            去商单大厅
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSubmitted(false);
              setCreatedId(null);
              setForm(INITIAL);
            }}
          >
            再发一张
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-layout">
      <div className="form-card">
        <div className="form-steps">
          <span className="form-step active">
            <b>01</b> 基本信息
          </span>
          <span className="form-step">
            <b>02</b> 需求细节
          </span>
          <span className="form-step">
            <b>03</b> 预算与发布
          </span>
          <button
            type="button"
            className="chip"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              setForm(DEMO);
              setErrors({});
            }}
          >
            填入示例
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <section className="form-section">
            <h3>先说清楚这是一场什么活动。</h3>
            <p className="hint">标题里带上城市和活动类型，更容易被搜到。</p>

            <div className="field">
              <label htmlFor="gig-title">
                活动名称 <em>必填</em>
              </label>
              <input
                id="gig-title"
                className="input"
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="例：新能源新车发布会 · 主会场主持"
              />
              {errors.title ? <div className="error-text">{errors.title}</div> : null}
            </div>

            <div className="field">
              <label>活动类型</label>
              <div className="chip-row" style={{ marginTop: 0 }}>
                {TYPES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`chip ${form.type === item ? "on" : ""}`}
                    onClick={() => update("type", item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="gig-city">
                  活动城市 <em>必填</em>
                </label>
                <input
                  id="gig-city"
                  className="input"
                  value={form.city}
                  onChange={(event) => update("city", event.target.value)}
                  placeholder="上海"
                />
                {errors.city ? <div className="error-text">{errors.city}</div> : null}
              </div>
              <div className="field">
                <label htmlFor="gig-date">
                  活动日期 <em>必填</em>
                </label>
                <input
                  id="gig-date"
                  type="date"
                  className="input"
                  value={form.eventDate}
                  onChange={(event) => update("eventDate", event.target.value)}
                />
                {errors.eventDate ? (
                  <div className="error-text">{errors.eventDate}</div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>再说清楚你要什么样的人。</h3>
            <p className="hint">写清流程、场地和特殊要求，能少聊很多来回。</p>

            <div className="field">
              <label>时长</label>
              <div className="chip-row" style={{ marginTop: 0 }}>
                {DURATIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`chip ${form.duration === item ? "on" : ""}`}
                    onClick={() => update("duration", item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="gig-req">
                主持人要求 <em>用逗号分隔</em>
              </label>
              <input
                id="gig-req"
                className="input"
                value={form.requirements}
                onChange={(event) => update("requirements", event.target.value)}
                placeholder="中英双语，发布会经验，可彩排"
              />
              {requirementTags.length ? (
                <div className="chip-row" style={{ marginTop: 8 }}>
                  {requirementTags.map((item) => (
                    <Tag key={item} tone="stage">
                      {item}
                    </Tag>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="gig-desc">活动说明</label>
              <textarea
                id="gig-desc"
                className="textarea"
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="活动流程、场地情况、嘉宾构成、彩排时间……"
              />
            </div>
          </section>

          <section className="form-section">
            <h3>最后，把预算写明白。</h3>
            <p className="hint">透明预算能显著提高报名质量。</p>

            <div className="field-row">
              <div className="field">
                <label htmlFor="gig-min">
                  预算下限 <em>必填</em>
                </label>
                <input
                  id="gig-min"
                  type="number"
                  className="input"
                  value={form.budgetMin}
                  onChange={(event) => update("budgetMin", event.target.value)}
                  placeholder="4000"
                />
                {errors.budgetMin ? (
                  <div className="error-text">{errors.budgetMin}</div>
                ) : null}
              </div>
              <div className="field">
                <label htmlFor="gig-max">
                  预算上限 <em>必填</em>
                </label>
                <input
                  id="gig-max"
                  type="number"
                  className="input"
                  value={form.budgetMax}
                  onChange={(event) => update("budgetMax", event.target.value)}
                  placeholder="6000"
                />
                {errors.budgetMax ? (
                  <div className="error-text">{errors.budgetMax}</div>
                ) : null}
              </div>
            </div>
          </section>

          <div className="form-actions">
            {submitError ? (
              <div className="error-text" style={{ marginRight: "auto" }}>
                {submitError}
              </div>
            ) : null}
            <Button href="/merchant/hosts" variant="ghost">
              取消
            </Button>
            <Button
              type="submit"
              variant="jade"
              icon="arrow-right"
              iconRight
              disabled={submitting}
            >
              {submitting ? "发布中…" : "发布商单"}
            </Button>
          </div>
        </form>
      </div>

      <aside className="preview-wrap">
        <div className="preview-label">实时预览 · 主持人看到的样子</div>
        <div className="gig-card" style={{ cursor: "default" }}>
          <div className="gig-top">
            <Tag tone="gold">{form.type}</Tag>
            <span className="tag tag-jade">
              <span className="status-dot" />
              招募中
            </span>
          </div>
          <h3 className="gig-title">{form.title || "未命名商单"}</h3>
          <div className="gig-company">
            你的公司 · {form.city || "城市待填"}
          </div>
          <div className="gig-meta">
            <span>
              <Icon name="map-pin" size={11} />
              {form.city || "—"}
            </span>
            <span>
              <Icon name="calendar" size={11} />
              {form.eventDate ? formatEventDate(form.eventDate) : "日期待定"}
            </span>
            <span>
              <Icon name="clock" size={11} />
              {form.duration}
            </span>
            <span>
              <Icon name="users" size={11} />0 人已报名
            </span>
          </div>
          <div className="gig-foot">
            <div className="gig-budget">
              <b>{formatBudget(min, max)}</b>
              <span>预算区间</span>
            </div>
            <span className="gig-applicants">
              预览
              <Icon name="arrow-right" size={12} />
            </span>
          </div>
        </div>

        <div className="side-card" style={{ marginTop: 14 }}>
          <h3>发布建议</h3>
          <ul className="side-list">
            <li>
              <span>标题带城市 + 类型</span>
              <b>更易被搜到</b>
            </li>
            <li>
              <span>写清彩排时间</span>
              <b>减少来回</b>
            </li>
            <li>
              <span>预算区间别太宽</span>
              <b>提高匹配</b>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
