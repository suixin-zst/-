import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="container" style={{ padding: "120px 0", textAlign: "center" }}>
      <span className="eyebrow" style={{ justifyContent: "center" }}>
        404 · Off stage
      </span>
      <h1 className="display-lg" style={{ marginTop: 14 }}>
        这一幕，还没开场。
      </h1>
      <p className="lead" style={{ margin: "12px auto 0", maxWidth: 420 }}>
        你找的页面可能已经下台，或者链接写错了。回首页重新找一条路。
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: 26,
          flexWrap: "wrap",
        }}
      >
        <Button href="/">回首页</Button>
        <Button href="/host/gigs" variant="ghost">
          去商单大厅
        </Button>
      </div>
    </main>
  );
}
