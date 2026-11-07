"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import type { HostStyle, Tone } from "@/lib/types";

const STYLES: HostStyle[] = ["婚礼", "年会", "发布会", "路演", "展会", "直播"];

interface ProfileValues {
  city: string;
  tagline: string;
  bio: string;
  styles: HostStyle[];
  priceHourly: number;
  priceHalfDay: number;
  priceFullDay: number;
  experienceYears: number;
}

interface WorkItem {
  id: string;
  title: string;
  type: "video" | "image" | "audio";
  duration: string;
  url: string;
}

export function HostProfileForm({
  user,
  profile,
  works,
  tone,
}: {
  user: { id: string; name: string; email: string };
  profile: ProfileValues;
  works: WorkItem[];
  tone: Tone;
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [values, setValues] = useState<ProfileValues>(profile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [workTitle, setWorkTitle] = useState("");
  const [workType, setWorkType] = useState<"video" | "image" | "audio">(
    "video",
  );
  const [workUrl, setWorkUrl] = useState("");
  const [workFile, setWorkFile] = useState<File | null>(null);
  const [addingWork, setAddingWork] = useState(false);
  const [workError, setWorkError] = useState("");

  function update<K extends keyof ProfileValues>(
    key: K,
    value: ProfileValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleStyle(style: HostStyle) {
    setValues((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((item) => item !== style)
        : [...prev.styles, style],
    }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("请填写姓名。");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/host/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city: values.city,
          tagline: values.tagline,
          bio: values.bio,
          styles: values.styles,
          priceHourly: values.priceHourly,
          priceHalfDay: values.priceHalfDay,
          priceFullDay: values.priceFullDay,
          experienceYears: values.experienceYears,
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: { message?: string };
      };
      if (!response.ok || !data.ok) {
        throw new Error(data?.error?.message || "保存失败。");
      }
      setMessage("资料已保存。");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败。");
    } finally {
      setSaving(false);
    }
  }

  async function addWork() {
    setWorkError("");
    if (!workTitle.trim()) {
      setWorkError("请填写作品标题。");
      return;
    }

    setAddingWork(true);
    try {
      let url = workUrl.trim();

      if (workFile) {
        const formData = new FormData();
        formData.append("file", workFile);
        const upload = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploaded = (await upload.json()) as {
          ok: boolean;
          url?: string;
          error?: { message?: string };
        };
        if (!upload.ok || !uploaded.ok || !uploaded.url) {
          throw new Error(uploaded?.error?.message || "上传失败。");
        }
        url = uploaded.url;
      }

      if (!url) {
        throw new Error("请上传文件或填写作品链接。");
      }

      const response = await fetch("/api/host/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: workTitle,
          type: workType,
          url,
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: { message?: string };
      };
      if (!response.ok || !data.ok) {
        throw new Error(data?.error?.message || "添加失败。");
      }

      setWorkTitle("");
      setWorkUrl("");
      setWorkFile(null);
      router.refresh();
    } catch (err) {
      setWorkError(err instanceof Error ? err.message : "添加失败。");
    } finally {
      setAddingWork(false);
    }
  }

  return (
    <div className="form-layout">
      <form className="form-card" onSubmit={save}>
        <div className="form-steps">
          <span className="form-step active">
            <b>01</b> 基本信息
          </span>
          <span className="form-step active">
            <b>02</b> 报价与作品
          </span>
        </div>

        {message ? <div className="ok-banner" style={{ marginBottom: 16 }}>{message}</div> : null}
        {error ? <div className="error-text" style={{ marginBottom: 12 }}>{error}</div> : null}

        <section className="form-section" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
          <h3>先让人记住你。</h3>
          <p className="hint">主页是商家判断你的第一眼，别只写「专业主持」。 </p>

          <div className="field">
            <label htmlFor="profile-name">姓名</label>
            <input
              id="profile-name"
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="profile-city">城市</label>
              <input
                id="profile-city"
                className="input"
                value={values.city}
                onChange={(event) => update("city", event.target.value)}
                placeholder="上海"
              />
            </div>
            <div className="field">
              <label htmlFor="profile-years">从业年限</label>
              <input
                id="profile-years"
                className="input"
                type="number"
                min={0}
                value={values.experienceYears}
                onChange={(event) =>
                  update("experienceYears", Number(event.target.value) || 0)
                }
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="profile-tagline">一句话定位</label>
            <input
              id="profile-tagline"
              className="input"
              value={values.tagline}
              onChange={(event) => update("tagline", event.target.value)}
              placeholder="例：把婚礼现场，变成一场有呼吸感的叙事。"
            />
          </div>

          <div className="field">
            <label>主持风格</label>
            <div className="chip-row" style={{ marginTop: 0 }}>
              {STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`chip ${values.styles.includes(style) ? "on" : ""}`}
                  onClick={() => toggleStyle(style)}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="profile-bio">自我介绍</label>
            <textarea
              id="profile-bio"
              className="textarea"
              value={values.bio}
              onChange={(event) => update("bio", event.target.value)}
              placeholder="你主持过什么、擅长什么、客户怎么评价你……"
            />
          </div>
        </section>

        <section className="form-section">
          <h3>把报价写明白。</h3>
          <p className="hint">时 / 半 / 全天，分开写。透明报价能减少来回。</p>

          <div className="field-row">
            <div className="field">
              <label>按小时（元）</label>
              <input
                className="input"
                type="number"
                min={0}
                value={values.priceHourly}
                onChange={(event) =>
                  update("priceHourly", Number(event.target.value) || 0)
                }
              />
            </div>
            <div className="field">
              <label>半天（元）</label>
              <input
                className="input"
                type="number"
                min={0}
                value={values.priceHalfDay}
                onChange={(event) =>
                  update("priceHalfDay", Number(event.target.value) || 0)
                }
              />
            </div>
          </div>

          <div className="field">
            <label>全天（元）</label>
            <input
              className="input"
              type="number"
              min={0}
              value={values.priceFullDay}
              onChange={(event) =>
                update("priceFullDay", Number(event.target.value) || 0)
              }
            />
          </div>
        </section>

        <section className="form-section">
          <h3>作品集。</h3>
          <p className="hint">上传一段现场视频或图片，商家会先看这个。</p>

          {works.length ? (
            <div className="work-manage">
              {works.map((work) => (
                <div className="work-manage-item" key={work.id}>
                  <b>{work.title}</b>
                  <span>
                    {work.type === "video"
                      ? "视频"
                      : work.type === "image"
                        ? "图片"
                        : "音频"}{" "}
                    · {work.duration}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="dash-empty" style={{ marginTop: 12 }}>
              还没有作品，先加一个。
            </div>
          )}

          <div className="form-section" style={{ marginTop: 18, paddingTop: 0, borderTop: 0 }}>
            <div className="field-row">
              <div className="field">
                <label>作品标题</label>
                <input
                  className="input"
                  value={workTitle}
                  onChange={(event) => setWorkTitle(event.target.value)}
                  placeholder="例：2026 品牌年会 · 开场"
                />
              </div>
              <div className="field">
                <label>类型</label>
                <select
                  className="select"
                  value={workType}
                  onChange={(event) =>
                    setWorkType(event.target.value as "video" | "image" | "audio")
                  }
                >
                  <option value="video">视频</option>
                  <option value="image">图片</option>
                  <option value="audio">音频</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>作品链接或上传</label>
              <input
                className="input"
                value={workUrl}
                onChange={(event) => setWorkUrl(event.target.value)}
                placeholder="也可以直接粘贴视频链接"
              />
              <div className="upload-row" style={{ marginTop: 8 }}>
                <label className="btn btn-ghost btn-sm" style={{ cursor: "pointer" }}>
                  上传文件
                  <input
                    type="file"
                    hidden
                    accept="video/*,image/*,audio/*"
                    onChange={(event) =>
                      setWorkFile(event.target.files?.[0] ?? null)
                    }
                  />
                </label>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  {workFile ? workFile.name : "支持图片 / 视频 / 音频，≤25MB"}
                </span>
              </div>
            </div>

            {workError ? <div className="error-text">{workError}</div> : null}

            <Button
              type="button"
              variant="jade"
              size="sm"
              onClick={addWork}
              disabled={addingWork}
            >
              {addingWork ? "添加中…" : "添加作品"}
            </Button>
          </div>
        </section>

        <div className="form-actions">
          <Button href="/host/dashboard" variant="ghost">
            返回工作台
          </Button>
          <Button type="submit" variant="stage" disabled={saving}>
            {saving ? "保存中…" : "保存资料"}
          </Button>
        </div>
      </form>

      <aside className="preview-wrap">
        <div className="preview-label">商家看到的样子</div>
        <div className="host-card" style={{ cursor: "default" }}>
          <div className={`host-portrait tone-${tone}`}>
            <div className="host-portrait-top">
              <span className="tag tag-ink">{values.city || "城市待填"}</span>
              {values.styles.length ? (
                <span className="tag">{values.styles[0]}</span>
              ) : null}
            </div>
            <span className="initial">{name.slice(0, 1) || "台"}</span>
            <div className="host-portrait-bottom">
              <span>{values.experienceYears} 年经验</span>
              <span>{works.length} 个作品</span>
            </div>
          </div>
          <div className="host-body">
            <div className="host-name">{name || "你的名字"}</div>
            <div className="host-city">{values.city || "城市待填"}</div>
            <div className="host-tags">
              {values.styles.map((style) => (
                <Tag key={style}>{style}</Tag>
              ))}
            </div>
            <div className="host-foot">
              <div className="host-price">
                <b>
                  {values.priceHalfDay
                    ? `¥${values.priceHalfDay}`
                    : "待定价"}
                </b>
                <span>半天起</span>
              </div>
            </div>
          </div>
        </div>

        <div className="side-card" style={{ marginTop: 14 }}>
          <h3>填写建议</h3>
          <ul className="side-list">
            <li>
              <span>一句话定位</span>
              <b>比「专业主持」有用</b>
            </li>
            <li>
              <span>作品</span>
              <b>至少 1 个现场</b>
            </li>
            <li>
              <span>报价</span>
              <b>写清半天 / 全天</b>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
