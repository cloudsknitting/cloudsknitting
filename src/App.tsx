import React, { useEffect, useMemo, useState } from "react";

/**
 * Clouds Knitting – Course Single Page Web App (Deploy-safe)
 * - White + Brown as main; Mist-blue only as small accents (buttons / chips)
 * - No emoji icons. (Close button uses ASCII 'X')
 * - Sticky header + scrollable tabs (NO hamburger)
 * - Card-based layout with clear headings + bullet points
 * - Course price list with photo slots + clickable detail modal
 * - "Member-like" My Bookings: Email login prototype using localStorage (front-end only)
 */

const LINE_URL = "https://lin.ee/WItaEyI";
const IG_URL =
  "https://www.instagram.com/clouds_knitting?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

const theme = {
  bg: "#FFFFFF",
  card: "#FFFFFF",
  ink: "#3B2A1E",     // deep brown
  muted: "#6B5A4A",   // brown-gray
  line: "#E6E0DA",    // warm border
  warm: "#F3ECE5",    // light warm (very subtle)
  accent: "#4F6E86",  // mist-blue accent (small areas)
  accentSoft: "#E7F0F7",
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
  priceLabel: string;
  difficulty: string;
  summary: string;
  techniques: string[];
  applications: string[];
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
    applications: ["收納籃", "髮夾收納", "網格風格包型延伸"],
  },
  {
    id: "drawstring",
    level: "初階",
    name: "韓系抽繩包",
    priceLabel: "NT$2460（線上便宜 $100）",
    difficulty: "★★",
    summary:
      "精美細緻、重複單一針法把手感練到熟練；可由課堂決定鉤織大小。",
    techniques: ["單一針法重複訓練", "抽繩結構", "收口技巧"],
    applications: ["化妝包", "手提包"],
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
    applications: ["手提包", "不同尺寸延伸"],
  },
  {
    id: "square",
    level: "初階",
    name: "方包",
    priceLabel: "NT$2460（線上便宜 $100）",
    difficulty: "★★★",
    summary:
      "針法固定但辨識度較高；特殊包底放物不變形；學鉤織肩帶與縫合五金方法。",
    techniques: ["特殊包底", "肩帶鉤織", "五金縫合", "材料包含 50cm 肩帶（可加購線鉤長肩帶）"],
    applications: ["熱門學習款", "五金風格變化"],
  },

  {
    id: "tote",
    level: "進階",
    name: "撞色托特包",
    priceLabel: "NT$2460（適合有基礎）",
    difficulty: "（進階）",
    summary: "教如何換色鉤織、換色技巧、三角手把製作與縫合技巧。",
    techniques: ["換色鉤織", "換色技巧", "三角手把製作", "縫合技巧"],
    applications: ["托特包", "撞色變化"],
  },
  {
    id: "basket",
    level: "進階",
    name: "菜籃子",
    priceLabel: "NT$2460（適合有基礎）",
    difficulty: "（進階）",
    summary: "精美紋路邏輯一次教會；隱形縫合手把、跳色鉤織。",
    techniques: ["紋路邏輯", "隱形縫合手把", "跳色鉤織"],
    applications: ["手提尺寸", "可加購線材放大包款"],
  },
  {
    id: "fluffy",
    level: "進階",
    name: "毛茸茸手提包",
    priceLabel: "NT$2460（適合有基礎）",
    difficulty: "（進階）",
    summary: "毛茸茸線材幾乎盲鉤，但非常可愛的冬季包包。",
    techniques: ["盲鉤技巧", "線材手感控制"],
    applications: ["冬季手提包"],
  },

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
  },
];

function Card({ children }: React.PropsWithChildren) {
  return (
    <section
      style={{
        background: theme.card,
        border: `1px solid ${theme.line}`,
        borderRadius: 18,
        boxShadow: "0 8px 22px rgba(0,0,0,0.04)",
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
        background: active ? theme.accentSoft : theme.bg,
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
            background: theme.accentSoft,
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
              fontSize: 14,
              color: theme.accent,
              fontFamily: sans,
            }}
          >
            X
          </button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
}

/** Member-like prototype (front-end only) */
type BookingStatus = "等待審核中" | "預約成功" | "已取消";
type Booking = {
  id: string;
  createdAt: string;
  courseName: string;
  hours: string;
  location: string;
  bagName: string;
  price: string;
  colorResult: string;
  addOns: string;
  total: string;
  status: BookingStatus;
};

const LS_USER = "clouds_user_email";
const LS_BOOKINGS = "clouds_bookings_by_email";

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readBookings(email: string): Booking[] {
  const map = safeJsonParse<Record<string, Booking[]>>(
    localStorage.getItem(LS_BOOKINGS),
    {}
  );
  return map[email] ?? [];
}

export default function App() {
  const tabs = useMemo(
    () => ["教學介紹", "課程價目表", "預約須知", "常見問題", "我的預約", "聯絡方式"],
    []
  );
  const [activeTab, setActiveTab] = useState("教學介紹");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBag, setSelectedBag] = useState<Bag | null>(null);

  const openBag = (bag: Bag) => {
    setSelectedBag(bag);
    setModalOpen(true);
  };

  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(LS_USER) || "";
    if (saved) setUserEmail(saved);
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    setBookings(readBookings(userEmail));
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

  const beginner = BAGS.filter((b) => b.level === "初階");
  const advanced = BAGS.filter((b) => b.level === "進階");
  const special = BAGS.filter((b) => b.level === "特殊");

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink, fontFamily: sans }}>
      {/* Sticky header + scrollable tabs */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.96)",
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
        {activeTab === "教學介紹" && (
          <Card>
            <h1 style={{ fontFamily: serif, fontSize: 26, margin: 0 }}>教學介紹</h1>
            <div style={{ marginTop: 6, color: theme.muted, fontSize: 14 }}>
              一針一引，療癒自己
            </div>

            <div style={{ borderTop: `1px dashed ${theme.line}`, paddingTop: 12, marginTop: 12 }}>
              <h2 style={{ fontFamily: serif, fontSize: 18, margin: "0 0 8px 0" }}>
                上課方式／你會學到
              </h2>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
                <li>教你如何看織圖、辨識針目、了解鉤織原理</li>
                <li>不只完成一個尺寸：學會調整比例，設計出各種尺寸</li>
                <li>同一套邏輯可延伸到其他款式，真正學以致用</li>
                <li>一對一為主，也可一對二；依學員程度調整進度</li>
              </ul>
            </div>

            <div style={{ borderTop: `1px dashed ${theme.line}`, paddingTop: 12, marginTop: 12 }}>
              <h2 style={{ fontFamily: serif, fontSize: 18, margin: "0 0 8px 0" }}>
                課後支援
              </h2>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
                <li>課後複習影片：不限次數觀看</li>
                <li>遇到問題可聯絡官方 LINE 詢問</li>
                <li>教學重視理解與實作，把你教到會</li>
              </ul>
            </div>

            <div
              style={{
                marginTop: 14,
                borderRadius: 16,
                border: `1px solid ${theme.line}`,
                background: theme.warm,
                padding: 12,
                fontSize: 14,
                lineHeight: 1.9,
              }}
            >
              <b>第一次預約課程？</b>
              請先看「預約須知」。若不確定包款或顏色，也可以先透過 LINE 討論後再預約，完全沒問題。
            </div>
          </Card>
        )}

        {activeTab === "課程價目表" && (
          <Card>
            <h1 style={{ fontFamily: serif, fontSize: 22, margin: 0 }}>課程價目表</h1>
            <div style={{ marginTop: 6, color: theme.muted, fontSize: 14 }}>
              每個包款皆預留照片位置；點「查看介紹」可看到技巧與應用範圍。
            </div>

            {/* Group: Beginner */}
            <div style={{ marginTop: 14 }}>
              <h2 style={{ fontFamily: serif, fontSize: 18, margin: "0 0 10px 0" }}>
                初階包款（NT$2460；線上便宜 $100）
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                {beginner.map((b) => (
                  <div key={b.id} style={{ border: `1px solid ${theme.line}`, borderRadius: 16, padding: 12, background: "#fff" }}>
                    <div style={{ borderRadius: 12, border: `1px dashed ${theme.line}`, background: theme.warm, height: 140, display: "grid", placeItems: "center", color: theme.muted, fontSize: 12, textAlign: "center", padding: 10 }}>
                      放 {b.name} 照片
                    </div>
                    <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                      <div style={{ fontFamily: serif, fontSize: 18 }}>{b.name}</div>
                      <div style={{ fontSize: 13, color: theme.muted }}>難度 {b.difficulty}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.7 }}>{b.summary}</div>
                      <div style={{ marginTop: 6 }}>
                        <PrimaryButton onClick={() => openBag(b)}>查看介紹</PrimaryButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group: Advanced */}
            <div style={{ marginTop: 18 }}>
              <h2 style={{ fontFamily: serif, fontSize: 18, margin: "0 0 10px 0" }}>
                進階包款（NT$2460；適合有鉤針基礎的同學）
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                {advanced.map((b) => (
                  <div key={b.id} style={{ border: `1px solid ${theme.line}`, borderRadius: 16, padding: 12, background: "#fff" }}>
                    <div style={{ borderRadius: 12, border: `1px dashed ${theme.line}`, background: theme.warm, height: 140, display: "grid", placeItems: "center", color: theme.muted, fontSize: 12, textAlign: "center", padding: 10 }}>
                      放 {b.name} 照片
                    </div>
                    <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                      <div style={{ fontFamily: serif, fontSize: 18 }}>{b.name}</div>
                      <div style={{ fontSize: 13, color: theme.muted }}>{b.priceLabel}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.7 }}>{b.summary}</div>
                      <div style={{ marginTop: 6 }}>
                        <PrimaryButton onClick={() => openBag(b)}>查看介紹</PrimaryButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group: Special */}
            <div style={{ marginTop: 18 }}>
              <h2 style={{ fontFamily: serif, fontSize: 18, margin: "0 0 10px 0" }}>
                特殊包款
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                {special.map((b) => (
                  <div key={b.id} style={{ border: `1px solid ${theme.line}`, borderRadius: 16, padding: 12, background: "#fff" }}>
                    <div style={{ borderRadius: 12, border: `1px dashed ${theme.line}`, background: theme.warm, height: 140, display: "grid", placeItems: "center", color: theme.muted, fontSize: 12, textAlign: "center", padding: 10 }}>
                      放 {b.name} 照片
                    </div>
                    <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                      <div style={{ fontFamily: serif, fontSize: 18 }}>{b.name}</div>
                      <div style={{ fontSize: 13, color: theme.muted }}>{b.priceLabel}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.7 }}>{b.summary}</div>
                      <div style={{ marginTop: 6 }}>
                        <PrimaryButton onClick={() => openBag(b)}>查看介紹</PrimaryButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeTab === "預約須知" && (
          <Card>
            <h1 style={{ fontFamily: serif, fontSize: 22, margin: 0 }}>預約須知</h1>

            <div
              style={{
                marginTop: 12,
                borderRadius: 16,
                border: `1px solid ${theme.line}`,
                background: theme.warm,
                padding: 12,
                fontSize: 14,
                lineHeight: 1.9,
              }}
            >
              <b>第一次預約課程？請先看這裡：</b>
              若不確定包款或顏色，可先透過 LINE 討論後再預約，完全沒問題。
            </div>

            <ul style={{ marginTop: 12, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
              <li>完成匯款後填寫預約表單，我們確認收款後預約才正式成立。</li>
              <li>課程 3 小時教完整顆包包的織法，「重複部分」需回家自行完成。</li>
              <li>材料包裡的線材是足夠的，但因每個人的手勁不同會影響用線量。</li>
              <li>完成報名後不得取消及退費，只能轉讓他人課程、更改時段，或換此包款成品。</li>
            </ul>
          </Card>
        )}

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

        {activeTab === "我的預約" && (
          <Card>
            <h1 style={{ fontFamily: serif, fontSize: 22, margin: 0 }}>我的預約</h1>
            <div style={{ marginTop: 8, color: theme.muted, fontSize: 14 }}>
              登入後可查看：課程價格、課程時數、上課地點、顏色確認結果、加購明細、總金額，以及是否已確認預約成功。
            </div>

            {!userEmail ? (
              <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                <div style={{ fontSize: 14, lineHeight: 1.9, background: theme.warm, border: `1px solid ${theme.line}`, borderRadius: 16, padding: 12 }}>
                  為了保護你的個人預約資訊，請先登入（目前為前端原型：Email 作為識別）。
                </div>

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
                      fontFamily: sans,
                    }}
                  />
                  <PrimaryButton onClick={handleLogin}>登入</PrimaryButton>
                </div>

                <div style={{ fontSize: 12, color: theme.muted }}>
                  ＊後台完成後，這裡會顯示你「已購買/已預約」課程明細與狀態。
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
                  <div style={{ fontSize: 14, lineHeight: 1.9, background: theme.warm, border: `1px solid ${theme.line}`, borderRadius: 16, padding: 12 }}>
                    目前尚無預約紀錄。完成預約後，系統會在此顯示你的課程明細與狀態（等待審核中／預約成功）。
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {bookings.map((bk) => (
                      <div key={bk.id} style={{ border: `1px solid ${theme.line}`, borderRadius: 16, padding: 12, background: "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                          <div style={{ fontFamily: serif, fontSize: 18 }}>{bk.courseName}</div>
                          <div style={{ fontSize: 12, padding: "4px 10px", borderRadius: 999, border: `1px solid ${theme.accent}`, background: theme.accentSoft }}>
                            {bk.status}
                          </div>
                        </div>

                        <div style={{ marginTop: 8, display: "grid", gap: 6, fontSize: 14, lineHeight: 1.8 }}>
                          <div>包款：{bk.bagName}</div>
                          <div>課程價格：{bk.price}</div>
                          <div>課程時數：{bk.hours}</div>
                          <div>上課地點：{bk.location}</div>
                          <div>顏色確認結果：{bk.colorResult}</div>
                          <div>加購明細：{bk.addOns}</div>
                          <div><b>總金額：{bk.total}</b></div>
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

      <Modal
        open={modalOpen}
        title={selectedBag ? `${selectedBag.name}（課程介紹）` : "課程介紹"}
        onClose={() => setModalOpen(false)}
      >
        {selectedBag ? (
          <div style={{ display: "grid", gap: 14 }}>
            <div
              style={{
                borderRadius: 14,
                border: `1px dashed ${theme.line}`,
                background: theme.warm,
                height: 220,
                display: "grid",
                placeItems: "center",
                color: theme.muted,
                fontSize: 12,
                textAlign: "center",
                padding: 10,
              }}
            >
              放 {selectedBag.name} 詳細介紹照片
            </div>

            <div style={{ fontSize: 13, color: theme.muted }}>
              {selectedBag.level} ・ 難度 {selectedBag.difficulty} ・ {selectedBag.priceLabel}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.9 }}>{selectedBag.summary}</div>

            <div>
              <div style={{ fontFamily: serif, fontSize: 16, marginBottom: 6 }}>你會學到的技巧</div>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
                {selectedBag.techniques.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ fontFamily: serif, fontSize: 16, marginBottom: 6 }}>可延伸應用範圍</div>
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
              <OutlineButton onClick={() => setModalOpen(false)}>關閉</OutlineButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

