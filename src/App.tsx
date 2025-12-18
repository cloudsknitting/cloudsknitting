import React, { useEffect, useMemo, useState } from "react";

/** Links */
const LINE_URL = "https://lin.ee/WItaEyI";
const IG_URL =
  "https://www.instagram.com/clouds_knitting?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

/** Theme (white-first + mist blue accents) */
const theme = {
  bg: "#FFFFFF",
  card: "#FFFFFF",
  ink: "#4b3621",
  muted: "#7a6a58",
  line: "#E2E8F0",
  mist: "#E6F0F7",
  mist2: "#D7E7F3",
  accent: "#5D7487", // mist-blue-ish
};

const serif =
  '"Noto Serif TC","Source Han Serif TC","Songti TC","PMingLiU",serif';
const sans =
  '"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif';

type BagLevel = "初階" | "進階" | "特殊";
type Bag = {
  id: string;
  level: BagLevel;
  name: string;
  priceLabel: string; // e.g. NT$2460
  difficulty: string; // e.g. ★★
  summary: string;
  techniques: string[];
  applications: string[];
  photoHint: string; // placeholder label for where you will put photos
};

const BAGS: Bag[] = [
  {
    id: "bucket",
    level: "初階",
    name: "水桶包",
    priceLabel: "NT$2460（線上便宜 $100）",
    difficulty: "★★",
    summary:
      "學習圓形包底，能夠學到多個基礎針法、藏線方式；可加購學習長肩帶，一包多個背法。",
    techniques: ["圓形包底", "加針邏輯", "多種基礎針法", "藏線方式", "（加購）長肩帶技巧"],
    applications: ["收納籃", "飲料提袋", "水桶包", "杯墊"],
    photoHint: "放水桶包照片（建議 1:1 或 4:3）",
  },
  {
    id: "mesh",
    level: "初階",
    name: "網格包",
    priceLabel: "NT$2460（線上便宜 $100）",
    difficulty: "★★",
    summary:
      "實用頻率極高的包款，橢圓形包底、加針邏輯，可學多個基礎針法與藏線方式。",
    techniques: ["橢圓形包底", "加針邏輯", "多種基礎針法", "藏線方式"],
    applications: ["收納籃", "髮夾收納", "日常外出包（網格風格）"],
    photoHint: "放網格包照片",
  },
  {
    id: "drawstring",
    level: "初階",
    name: "韓系抽繩包",
    priceLabel: "NT$2460（線上便宜 $100）",
    difficulty: "★★",
    summary:
      "精美細緻、重複單一針法把手感練到非常熟練；可由課堂決定鉤織大小。",
    techniques: ["單一針法重複訓練", "抽繩結構", "收口技巧"],
    applications: ["化妝包", "手提包"],
    photoHint: "放韓系抽繩包照片",
  },
  {
    id: "handbag",
    level: "初階",
    name: "手提包",
    priceLabel: "NT$2460（線上便宜 $100）",
    difficulty: "★★",
    summary:
      "經典扎實紋路，橢圓包底；學多個基礎針法以及手把縫合；可加購長肩帶一包多背。",
    techniques: ["橢圓包底", "多種基礎針法", "手把縫合", "（加購）長肩帶技巧"],
    applications: ["手提包", "可延伸做不同尺寸的日常包"],
    photoHint: "放手提包照片",
  },
  {
    id: "square",
    level: "初階",
    name: "方包",
    priceLabel: "NT$2460（線上便宜 $100）",
    difficulty: "★★★",
    summary:
      "針法固定但辨識度較高，需要耐心適應；特殊包底放物不變形；學肩帶與五金縫合。",
    techniques: ["特殊包底", "肩帶鉤織", "五金縫合", "材料包含 50cm 肩帶（可加購線鉤長肩帶）"],
    applications: ["熱門學習款", "可變化不同背法與五金風格"],
    photoHint: "放方包照片",
  },

  // Advanced
  {
    id: "tote",
    level: "進階",
    name: "撞色托特包",
    priceLabel: "NT$2460",
    difficulty: "（適合有基礎）",
    summary: "教如何換色鉤織、換色技巧、三角手把製作與縫合技巧。",
    techniques: ["換色鉤織", "換色技巧", "三角手把製作", "縫合技巧"],
    applications: ["托特包", "各種撞色變化"],
    photoHint: "放撞色托特包照片",
  },
  {
    id: "basket",
    level: "進階",
    name: "菜籃子",
    priceLabel: "NT$2460",
    difficulty: "（適合有基礎）",
    summary: "精美紋路邏輯一次教會；隱形縫合手把、跳色鉤織。",
    techniques: ["紋路邏輯", "隱形縫合手把", "跳色鉤織"],
    applications: ["手提尺寸", "可加購線材放大包款"],
    photoHint: "放菜籃子照片",
  },
  {
    id: "fluffy",
    level: "進階",
    name: "毛茸茸手提包",
    priceLabel: "NT$2460",
    difficulty: "（適合有基礎）",
    summary: "毛茸茸線材幾乎盲鉤，但非常可愛的冬季包包，背上真的會暖和。",
    techniques: ["盲鉤技巧", "線材手感控制"],
    applications: ["冬季手提包", "毛茸茸風格變化"],
    photoHint: "放毛茸茸手提包照片",
  },

  // Special
  {
    id: "horn",
    level: "特殊",
    name: "牛角包",
    priceLabel: "NT$2860（需有鉤針經驗）",
    difficulty: "（需有經驗）",
    summary:
      "特殊加針邏輯鉤出完美弧度包型；手把原理可自行變換；放了物品整顆包更美。",
    techniques: ["特殊加針邏輯", "弧度包型控制", "手把原理延伸"],
    applications: ["牛角包", "弧形包型延伸"],
    photoHint: "放牛角包照片",
  },
];

/** Simple modal */
function Modal({
  open,
  title,
  onClose,
  children,
}: React.PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
}>) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(920px, 100%)",
          background: theme.card,
          border: `1px solid ${theme.line}`,
          borderRadius: 18,
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: `1px solid ${theme.line}`,
            background: theme.mist,
          }}
        >
          <div style={{ fontFamily: serif, fontSize: 18, color: theme.ink }}>
            {title}
          </div>
          <button
            onClick={onClose}
            aria-label="close"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 18,
              color: theme.accent,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
}

function Card({
  children,
  soft,
}: React.PropsWithChildren<{ soft?: boolean }>) {
  return (
    <section
      style={{
        background: soft ? theme.mist : theme.card,
        border: `1px solid ${theme.line}`,
        borderRadius: 18,
        boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
        padding: 18,
      }}
    >
      {children}
    </section>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: React.PropsWithChildren<{ active: boolean; onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      style={{
        whiteSpace: "nowrap",
        fontSize: 14,
        padding: "8px 12px",
        borderRadius: 999,
        border: active ? `1px solid ${theme.accent}` : "1px solid transparent",
        background: active ? theme.mist2 : theme.bg,
        boxShadow: active ? "0 6px 14px rgba(0,0,0,0.06)" : "none",
        cursor: "pointer",
        color: theme.ink,
        fontFamily: sans,
      }}
    >
      {children}
    </button>
  );
}

function PrimaryButton({
  children,
  onClick,
}: React.PropsWithChildren<{ onClick?: () => void }>) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${theme.accent}`,
        background: theme.accent,
        color: "#fff",
        borderRadius: 14,
        padding: "10px 14px",
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function OutlineButton({
  children,
  onClick,
}: React.PropsWithChildren<{ onClick?: () => void }>) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${theme.line}`,
        background: "#fff",
        color: theme.ink,
        borderRadius: 14,
        padding: "10px 14px",
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

/** Member-ish (prototype) */
type BookingStatus = "等待審核中" | "預約成功" | "已取消";
type Booking = {
  id: string;
  createdAt: string;
  courseName: string;
  hours: string;
  location: string;
  bagName: string;
  colorResult: string; // teacher confirmed result
  addOns: string; // read-only
  total: string; // read-only
  status: BookingStatus;
};

const LS_USER = "clouds_user_email";
const LS_BOOKINGS = "clouds_bookings_by_email"; // JSON map email->Booking[]

function readBookings(email: string): Booking[] {
  try {
    const raw = localStorage.getItem(LS_BOOKINGS);
    if (!raw) return [];
    const map = JSON.parse(raw) as Record<string, Booking[]>;
    return map[email] ?? [];
  } catch {
    return [];
  }
}

function writeBookings(email: string, bookings: Booking[]) {
  try {
    const raw = localStorage.getItem(LS_BOOKINGS);
    const map = (raw ? (JSON.parse(raw) as Record<string, Booking[]>) : {}) || {};
    map[email] = bookings;
    localStorage.setItem(LS_BOOKINGS, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export default function CrochetApp() {
  const tabs = useMemo(
    () => ["教學介紹", "課程價目表", "預約須知", "常見問題", "我的預約", "聯絡方式"],
    []
  );
  const [activeTab, setActiveTab] = useState("教學介紹");

  const [bagModalOpen, setBagModalOpen] = useState(false);
  const [selectedBag, setSelectedBag] = useState<Bag | null>(null);

  const openBag = (bag: Bag) => {
    setSelectedBag(bag);
    setBagModalOpen(true);
  };

  // Member-ish
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(LS_USER) || "";
    if (saved) setUserEmail(saved);
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    const list = readBookings(userEmail);
    setBookings(list);
  }, [userEmail]);

  const handleLogin = () => {
    const e = email.trim();
    if (!e) return;
    localStorage.setItem(LS_USER, e);
    setUserEmail(e);
    setEmail("");
  };

  const handleLogout = () => {
    localStorage.removeItem(LS_USER);
    setUserEmail("");
    setBookings([]);
  };

  // Course list grouping
  const beginner = BAGS.filter((b) => b.level === "初階");
  const advanced = BAGS.filter((b) => b.level === "進階");
  const special = BAGS.filter((b) => b.level === "特殊");

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink, fontFamily: sans }}>
      {/* Sticky header + scrollable tabs (no hamburger) */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${theme.line}`,
        }}
      >
        <nav
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            padding: "12px 16px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tabs.map((t) => (
            <TabButton key={t} active={activeTab === t} onClick={() => setActiveTab(t)}>
              {t}
            </TabButton>
          ))}
        </nav>
      </header>

      <main style={{ padding: 16, maxWidth: 980, margin: "0 auto", display: "grid", gap: 14 }}>
        {/* 教學介紹 */}
        {activeTab === "教學介紹" && (
          <Card>
            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <h1 style={{ fontFamily: serif, fontSize: 26, margin: 0 }}>教學介紹</h1>
                <div style={{ marginTop: 6, color: theme.muted, fontSize: 14 }}>
                  一針一引，療癒自己
                </div>
              </div>

              <div style={{ borderTop: `1px dashed ${theme.line}`, paddingTop: 12 }}>
                <h2 style={{ fontFamily: serif, fontSize: 18, margin: "0 0 8px 0" }}>
                  上課方式／你會學到
                </h2>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
                  <li>教你如何看織圖、辨識針目、了解鉤織原理</li>
                  <li>不只完成一個尺寸：會帶你學會調整比例，設計出各種尺寸</li>
                  <li>同一套邏輯可延伸到其他款式，真正學以致用</li>
                  <li>課程以一對一教學為主，也可一對二（會依學員程度調整教學進度）</li>
                </ul>
              </div>

              <div style={{ borderTop: `1px dashed ${theme.line}`, paddingTop: 12 }}>
                <h2 style={{ fontFamily: serif, fontSize: 18, margin: "0 0 8px 0" }}>
                  課後支援
                </h2>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
                  <li>回家忘了也不用擔心：提供課後複習影片（不限次數觀看）</li>
                  <li>練習遇到問題，可透過官方 LINE 詢問</li>
                  <li>教學重視理解與實作，把你教到會，而不是只把作品做完</li>
                </ul>
              </div>

              <Card soft>
                <div style={{ fontSize: 14, lineHeight: 1.9 }}>
                  <b>第一次預約課程？</b>
                  你可以先看「預約須知」。若不確定包款或顏色，也可以先透過 LINE 討論後再預約，完全沒問題。
                </div>
              </Card>
            </div>
          </Card>
        )}

        {/* 課程價目表 */}
        {activeTab === "課程價目表" && (
          <Card>
            <h1 style={{ fontFamily: serif, fontSize: 22, margin: 0 }}>課程價目表</h1>
            <div style={{ marginTop: 6, color: theme.muted, fontSize: 14 }}>
              每個包款皆預留照片位置；點「查看介紹」可看到難度、技巧與應用範圍。
            </div>

            <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
              <div>
                <h2 style={{ fontFamily: serif, fontSize: 18, margin: "0 0 10px 0" }}>
                  初階包款（NT$2460；線上便宜 $100）
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 12,
                  }}
                >
                  {beginner.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        border: `1px solid ${theme.line}`,
                        borderRadius: 16,
                        padding: 12,
                        background: "#fff",
                      }}
                    >
                      {/* Photo placeholder */}
                      <div
                        style={{
                          borderRadius: 12,
                          border: `1px dashed ${theme.line}`,
                          background: theme.mist,
                          height: 140,
                          display: "grid",
                          placeItems: "center",
                          color: theme.muted,
                          fontSize: 12,
                          textAlign: "center",
                          padding: 10,
                        }}
                      >
                        {b.photoHint}
                      </div>

                      <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                        <div style={{ fontFamily: serif, fontSize: 18 }}>{b.name}</div>
                        <div style={{ fontSize: 13, color: theme.muted }}>
                          難度 {b.difficulty} ・ {b.priceLabel}
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 1.7 }}>{b.summary}</div>

                        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                          <PrimaryButton onClick={() => openBag(b)}>查看介紹</PrimaryButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 style={{ fontFamily: serif, fontSize: 18, margin: "0 0 10px 0" }}>
                  進階包款（NT$2460；適合有鉤針基礎的同學）
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 12,
                  }}
                >
                  {advanced.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        border: `1px solid ${theme.line}`,
                        borderRadius: 16,
                        padding: 12,
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          borderRadius: 12,
                          border: `1px dashed ${theme.line}`,
                          background: theme.mist,
                          height: 140,
                          display: "grid",
                          placeItems: "center",
                          color: theme.muted,
                          fontSize: 12,
                          textAlign: "center",
                          padding: 10,
                        }}
                      >
                        {b.photoHint}
                      </div>

                      <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                        <div style={{ fontFamily: serif, fontSize: 18 }}>{b.name}</div>
                        <div style={{ fontSize: 13, color: theme.muted }}>
                          {b.difficulty} ・ {b.priceLabel}
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 1.7 }}>{b.summary}</div>

                        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                          <PrimaryButton onClick={() => openBag(b)}>查看介紹</PrimaryButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 style={{ fontFamily: serif, fontSize: 18, margin: "0 0 10px 0" }}>
                  特殊包款
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 12,
                  }}
                >
                  {special.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        border: `1px solid ${theme.line}`,
                        borderRadius: 16,
                        padding: 12,
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          borderRadius: 12,
                          border: `1px dashed ${theme.line}`,
                          background: theme.mist,
                          height: 140,
                          display: "grid",
                          placeItems: "center",
                          color: theme.muted,
                          fontSize: 12,
                          textAlign: "center",
                          padding: 10,
                        }}
                      >
                        {b.photoHint}
                      </div>

                      <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                        <div style={{ fontFamily: serif, fontSize: 18 }}>{b.name}</div>
                        <div style={{ fontSize: 13, color: theme.muted }}>
                          {b.difficulty} ・ {b.priceLabel}
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 1.7 }}>{b.summary}</div>

                        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                          <PrimaryButton onClick={() => openBag(b)}>查看介紹</PrimaryButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: 12, color: theme.muted }}>
                ＊照片與 Logo 我們會在頁面版型都確定後再補上，你到時只要把圖片丟進
                <code style={{ margin: "0 6px" }}>src/assets</code>
                然後把 placeholder 換成 <code>img</code> 就好。
              </div>
            </div>
          </Card>
        )}

        {/* 預約須知 */}
        {activeTab === "預約須知" && (
          <Card>
            <h1 style={{ fontFamily: serif, fontSize: 22, margin: 0 }}>預約須知</h1>

            <Card soft>
              <div style={{ fontSize: 14, lineHeight: 1.9 }}>
                <b>第一次預約課程？請先看這裡：</b>
                若不確定包款或顏色，可先透過 LINE 討論後再預約，完全沒問題。
              </div>
            </Card>

            <ul style={{ marginTop: 10, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
              <li>完成匯款後填寫預約表單，我們確認收款後預約才正式成立。</li>
              <li>課程 3 小時教完整顆包包的織法，「重複部分」需回家自行完成。</li>
              <li>材料包裡的線材是足夠的，但因每個人的手勁不同會影響用線量。</li>
              <li>完成報名後不得取消及退費，只能轉讓他人課程、更改時段，或換此包款成品。</li>
            </ul>
          </Card>
        )}

        {/* 常見問題 */}
        {activeTab === "常見問題" && (
          <Card>
            <h1 style={{ fontFamily: serif, fontSize: 22, margin: 0 }}>常見問題</h1>
            <div style={{ display: "grid", gap: 10, marginTop: 12, fontSize: 14, lineHeight: 1.9 }}>
              <div>
                <b>Q：完全沒有經驗也可以參加嗎？</b>
                <div>A：當然可以。初學者包款課程專為零基礎學員設計。</div>
              </div>
              <div>
                <b>Q：需要自備工具或材料嗎？</b>
                <div>A：完全不需要。課程費用已包含所有材料與工具使用。</div>
              </div>
              <div>
                <b>Q：預約後可以取消嗎？</b>
                <div>A：完成報名後不得取消及退費，只能轉讓他人課程、更改時段，或換此包款成品。</div>
              </div>
            </div>
          </Card>
        )}

        {/* 我的預約（會員感：登入後才能看） */}
        {activeTab === "我的預約" && (
          <Card>
            <h1 style={{ fontFamily: serif, fontSize: 22, margin: 0 }}>我的預約</h1>
            <div style={{ marginTop: 8, color: theme.muted, fontSize: 14 }}>
              登入後可查看：課程價格、課程時數、上課地點、顏色確認結果、加購明細、總金額，以及是否已確認預約成功。
            </div>

            {!userEmail ? (
              <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                <Card soft>
                  <div style={{ fontSize: 14, lineHeight: 1.9 }}>
                    為了保護你的個人預約資訊，請先登入（先用 Email 登入作為會員識別；後台完成後會升級成正式會員系統）。
                  </div>
                </Card>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="輸入 Email 以登入"
                    style={{
                      flex: "1 1 260px",
                      border: `1px solid ${theme.line}`,
                      borderRadius: 14,
                      padding: "10px 12px",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                  <PrimaryButton onClick={handleLogin}>登入</PrimaryButton>
                </div>

                <div style={{ fontSize: 12, color: theme.muted }}>
                  ＊目前版本為前端展示：登入後會顯示你的預約清單（資料之後會接後台審核系統）。
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 14 }}>
                    已登入：<b>{userEmail}</b>
                  </div>
                  <OutlineButton onClick={handleLogout}>登出</OutlineButton>
                </div>

                {bookings.length === 0 ? (
                  <Card soft>
                    <div style={{ fontSize: 14, lineHeight: 1.9 }}>
                      目前尚無預約紀錄。
                      <br />
                      下一階段我們會把「我要預約」表單與時段、匯款末 5 碼、以及審核狀態正式接到這裡顯示。
                    </div>
                  </Card>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {bookings.map((bk) => (
                      <div
                        key={bk.id}
                        style={{
                          border: `1px solid ${theme.line}`,
                          borderRadius: 16,
                          padding: 12,
                          background: "#fff",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                          <div style={{ fontFamily: serif, fontSize: 18 }}>{bk.courseName}</div>
                          <div
                            style={{
                              fontSize: 12,
                              padding: "4px 10px",
                              borderRadius: 999,
                              border: `1px solid ${theme.accent}`,
                              background: theme.mist,
                            }}
                          >
                            {bk.status}
                          </div>
                        </div>

                        <div style={{ marginTop: 8, display: "grid", gap: 6, fontSize: 14, lineHeight: 1.8 }}>
                          <div>包款：{bk.bagName}</div>
                          <div>課程時數：{bk.hours}</div>
                          <div>上課地點：{bk.location}</div>
                          <div>顏色確認結果：{bk.colorResult}</div>
                          <div>加購明細：{bk.addOns}</div>
                          <div>
                            <b>總金額：{bk.total}</b>
                          </div>
                          <div style={{ fontSize: 12, color: theme.muted }}>建立時間：{bk.createdAt}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <PrimaryButton onClick={() => window.open(LINE_URL, "_blank")}>
                  不確定包款/顏色？先用 LINE 討論
                </PrimaryButton>
              </div>
            )}
          </Card>
        )}

        {/* 聯絡方式 */}
        {activeTab === "聯絡方式" && (
          <Card>
            <h1 style={{ fontFamily: serif, fontSize: 22, margin: 0 }}>聯絡方式</h1>
            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <OutlineButton onClick={() => window.open(LINE_URL, "_blank")}>LINE 官方</OutlineButton>
              <OutlineButton onClick={() => window.open(IG_URL, "_blank")}>Instagram</OutlineButton>
            </div>
          </Card>
        )}
      </main>

      {/* Bag detail modal */}
      <Modal
        open={bagModalOpen}
        title={selectedBag ? `${selectedBag.name}（課程介紹）` : "課程介紹"}
        onClose={() => setBagModalOpen(false)}
      >
        {selectedBag ? (
          <div style={{ display: "grid", gap: 14 }}>
            <div
              style={{
                borderRadius: 14,
                border: `1px dashed ${theme.line}`,
                background: theme.mist,
                height: 220,
                display: "grid",
                placeItems: "center",
                color: theme.muted,
                fontSize: 12,
                textAlign: "center",
                padding: 10,
              }}
            >
              {selectedBag.photoHint}（詳細頁照片位置）
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontSize: 13, color: theme.muted }}>
                {selectedBag.level} ・ 難度 {selectedBag.difficulty} ・ {selectedBag.priceLabel}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.9 }}>{selectedBag.summary}</div>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontFamily: serif, fontSize: 16 }}>你會學到的技巧</div>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
                {selectedBag.techniques.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontFamily: serif, fontSize: 16 }}>可延伸應用範圍</div>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
                {selectedBag.applications.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <PrimaryButton onClick={() => window.open(LINE_URL, "_blank")}>
                想先確認顏色/加購？用 LINE 討論
              </PrimaryButton>
              <OutlineButton onClick={() => setBagModalOpen(false)}>關閉</OutlineButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
