import React, { useEffect, useMemo, useState } from "react";

/**
 * Clouds Knitting — Single Page Web App (Prototype MVP)
 * Spec implemented:
 * - White-first theme + dark coffee text + mist blue accents
 * - NO emoji icons; SVG line icons only
 * - Desktop: collapsible LEFT sidebar contains navigation + Member Center + Contact quick links
 * - Mobile: NO hamburger; scrollable top tab bar contains ALL sections (incl. Member Center)
 * - Card-based layout, clear headings, bullet points
 * - Price list: bags clickable -> detail modal (stitches/techniques/applications + photo slot)
 * - Booking: crochet experience (有/無), bag, color code, add-ons, date+time slot (buttons; booked=disabled)
 * - Member center: Email+password (prototype localStorage), view own bookings + status
 * - Payment info shown + emphasized “匯款完成並收到預約成功通知才算成功”
 *
 * NOTE: This is a working prototype using localStorage.
 * A real backend/admin panel + email notifications + batch slot creation are Phase 2.
 */

/* ===================== Theme tokens ===================== */
const theme = {
  bg: "#FFFFFF",
  card: "#FCFCFA",
  line: "#EAE6DF",
  softLine: "#EFEAE2",
  ink: "#4B3621",
  muted: "#7A6A58",
  blue: "#6F7F8C",
  blueSoft: "#EEF2F4",
  danger: "#CFCFCF",
  pending: "#C9B8A6",
};

const FONT_SERIF =
  '"Noto Serif TC","Source Han Serif TC","Songti TC","PMingLiU",serif';
const FONT_SANS =
  '"Noto Sans TC","PingFang TC","Microsoft JhengHei","Heiti TC",sans-serif';

/* ===================== Types ===================== */
type Difficulty = "★★" | "★★★";
type BagLevel = "初階" | "進階" | "牛角";

type Bag = {
  id: string;
  level: BagLevel;
  name: string;
  price: number;
  difficulty: Difficulty;
  summary: string;
  learn: string[];
  apply: string[];
};

type AddOn = { id: string; name: string };

type Slot = {
  id: string;
  date: string; // YYYY-MM-DD
  label: string; // e.g. "下午 14:00–17:00"
  isOpen: boolean;
};

type BookingStatus = "待審核" | "已確認" | "已取消";

type Booking = {
  id: string;
  createdAt: number;
  status: BookingStatus;

  name: string;
  email: string;
  phone: string;
  experience: "有" | "無";

  bagId: string;
  colorCode: string;
  addOnIds: string[];

  slotId: string;

  paymentLast5: string;
  note: string;
};

type Member = { email: string; password: string };

/* ===================== Storage (prototype) ===================== */
const LS_MEMBERS = "ck_members_v1";
const LS_CURRENT = "ck_current_member_v1";
const LS_BOOKINGS = "ck_bookings_v1";
const LS_SLOTS = "ck_slots_v1";

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function lsSet<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function money(n: number) {
  return `NT$${n.toLocaleString("zh-TW")}`;
}
function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

/* ===================== SVG line icons (NO emoji) ===================== */
function Icon({
  name,
  size = 18,
  color,
}: {
  name:
    | "menu"
    | "close"
    | "brand"
    | "price"
    | "notice"
    | "faq"
    | "book"
    | "member"
    | "contact"
    | "bag"
    | "calendar"
    | "link"
    | "line"
    | "ig";
  size?: number;
  color?: string;
}) {
  const c = color ?? theme.ink;
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { flex: "0 0 auto" },
  };

  switch (name) {
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12" />
          <path d="M18 6l-12 12" />
        </svg>
      );
    case "brand":
      return (
        <svg {...common}>
          <path d="M4 12c2.5-7 13.5-7 16 0" />
          <path d="M6.5 12c1.7-4.8 9.3-4.8 11 0" />
          <path d="M12 12v8" />
          <path d="M10 18l2 2 2-2" />
        </svg>
      );
    case "price":
      return (
        <svg {...common}>
          <path d="M7 7h10v10H7z" />
          <path d="M9 10h6" />
          <path d="M9 13h6" />
          <path d="M9 16h4" />
        </svg>
      );
    case "notice":
      return (
        <svg {...common}>
          <path d="M12 3l9 16H3l9-16z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "faq":
      return (
        <svg {...common}>
          <path d="M4 5h16v12H7l-3 3V5z" />
          <path d="M9.5 10a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.2.9-1.2 1.8" />
          <path d="M12 16h.01" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 19V6a2 2 0 0 1 2-2h12v15" />
          <path d="M6 4v15a2 2 0 0 0 2 2h12" />
        </svg>
      );
    case "member":
      return (
        <svg {...common}>
          <path d="M20 21a8 8 0 0 0-16 0" />
          <path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <path d="M21 8v10a2 2 0 0 1-2 2H7l-4 3V6a2 2 0 0 1 2-2h10" />
          <path d="M16 3h5v5" />
          <path d="M21 3l-6 6" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M7 9h10l1 12H6L7 9z" />
          <path d="M9 9V7a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <path d="M7 3v3" />
          <path d="M17 3v3" />
          <path d="M4 7h16" />
          <path d="M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
          <path d="M8 11h4" />
          <path d="M8 15h3" />
        </svg>
      );
    case "link":
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10.5 4.5" />
          <path d="M14 11a5 5 0 0 0-7.07 0L5.52 12.4a5 5 0 0 0 7.07 7.07l.91-.91" />
        </svg>
      );
    case "line":
      return (
        <svg {...common}>
          <path d="M4 6.5C4 4.6 6.2 3 9 3h6c2.8 0 5 1.6 5 3.5V12c0 1.9-2.2 3.5-5 3.5H10l-3.5 2.5V15.5C5 15.1 4 13.7 4 12V6.5z" />
          <path d="M8 7.5h.01" />
          <path d="M12 7.5h.01" />
          <path d="M16 7.5h.01" />
        </svg>
      );
    case "ig":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="12" height="12" rx="3" />
          <path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
          <path d="M15.5 8.5h.01" />
        </svg>
      );
    default:
      return null;
  }
}

/* ===================== UI helpers ===================== */
function Card({
  title,
  icon,
  children,
  footer,
}: {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: theme.card,
        borderRadius: 18,
        border: `1px solid ${theme.softLine}`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {(title || icon) && (
        <div
          style={{
            padding: "16px 18px 10px",
            borderBottom: `1px solid ${theme.softLine}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {icon}
          <h2
            style={{
              margin: 0,
              fontFamily: FONT_SERIF,
              fontSize: 18,
              letterSpacing: "0.02em",
              color: theme.ink,
            }}
          >
            {title}
          </h2>
        </div>
      )}
      <div style={{ padding: 18 }}>{children}</div>
      {footer && (
        <div
          style={{
            padding: "12px 18px 16px",
            borderTop: `1px solid ${theme.softLine}`,
            background: "#fff",
          }}
        >
          {footer}
        </div>
      )}
    </section>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        margin: "0 0 10px 0",
        fontFamily: FONT_SERIF,
        fontSize: 28,
        letterSpacing: "0.02em",
        color: theme.ink,
      }}
    >
      {children}
    </h1>
  );
}

function Subtle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: 0, color: theme.muted, fontSize: 13, lineHeight: 1.7 }}>
      {children}
    </p>
  );
}

function PillButton({
  active,
  disabled,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={{
        borderRadius: 999,
        padding: "8px 14px",
        border: `1px solid ${active ? theme.blue : "transparent"}`,
        background: disabled ? theme.blueSoft : active ? "#fff" : "transparent",
        color: disabled ? "#8c98a0" : theme.ink,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: active ? "0 6px 14px rgba(0,0,0,0.06)" : "none",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        borderRadius: 14,
        padding: "12px 14px",
        background: disabled ? "#c7c7c7" : theme.ink,
        color: "#fff",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 14,
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 14,
        padding: "10px 12px",
        background: "#fff",
        color: theme.ink,
        border: `1px solid ${theme.line}`,
        cursor: "pointer",
        fontSize: 14,
      }}
    >
      {children}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, color: theme.muted }}>
        {label} {required ? <span style={{ color: theme.blue }}>*</span> : null}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        style={{
          borderRadius: 12,
          border: `1px solid ${theme.line}`,
          padding: "10px 12px",
          outline: "none",
          fontSize: 14,
          background: "#fff",
          color: theme.ink,
        }}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, color: theme.muted }}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          borderRadius: 12,
          border: `1px solid ${theme.line}`,
          padding: "10px 12px",
          outline: "none",
          fontSize: 14,
          resize: "vertical",
          background: "#fff",
          color: theme.ink,
        }}
      />
    </label>
  );
}

function RadioGroup({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontSize: 12, color: theme.muted }}>
        {label} {required ? <span style={{ color: theme.blue }}>*</span> : null}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {options.map((opt) => (
          <label
            key={opt}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              border: `1px solid ${value === opt ? theme.blue : theme.line}`,
              background: value === opt ? theme.blueSoft : "#fff",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name={label}
              checked={value === opt}
              onChange={() => onChange(opt)}
              style={{ accentColor: theme.blue }}
            />
            <span style={{ fontSize: 13 }}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckboxGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  options: { id: string; name: string }[];
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontSize: 12, color: theme.muted }}>{label}</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {options.map((opt) => {
          const checked = value.includes(opt.id);
          return (
            <label
              key={opt.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                border: `1px solid ${checked ? theme.blue : theme.line}`,
                background: checked ? theme.blueSoft : "#fff",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  if (e.target.checked) onChange([...value, opt.id]);
                  else onChange(value.filter((x) => x !== opt.id));
                }}
                style={{ accentColor: theme.blue }}
              />
              <span style={{ fontSize: 13 }}>{opt.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.18)",
        zIndex: 50,
        display: "grid",
        placeItems: "center",
        padding: 18,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "min(920px, 100%)",
          background: "#fff",
          borderRadius: 18,
          border: `1px solid ${theme.softLine}`,
          boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: `1px solid ${theme.softLine}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="bag" color={theme.blue} />
            <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: theme.ink }}>
              {title}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              borderRadius: 12,
              padding: 8,
              border: `1px solid ${theme.softLine}`,
              background: "#fff",
              cursor: "pointer",
            }}
            aria-label="close"
          >
            <Icon name="close" />
          </button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
}

/* ===================== Small components ===================== */
function GroupTitle({ label, meta }: { label: string; meta: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
      <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: theme.ink }}>{label}</div>
      <div style={{ fontSize: 12, color: theme.muted }}>{meta}</div>
    </div>
  );
}

function BagGrid({ bags, onOpen }: { bags: Bag[]; onOpen: (id: string) => void }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
      }}
    >
      {bags.map((b) => (
        <button
          key={b.id}
          type="button"
          onClick={() => onOpen(b.id)}
          style={{
            border: `1px solid ${theme.softLine}`,
            borderRadius: 18,
            background: "#fff",
            padding: 14,
            cursor: "pointer",
            textAlign: "left",
            boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 16, color: theme.ink }}>{b.name}</div>
            <span
              style={{
                fontSize: 12,
                color: theme.blue,
                border: `1px solid ${theme.line}`,
                borderRadius: 999,
                padding: "4px 10px",
                background: theme.blueSoft,
              }}
            >
              {b.difficulty}
            </span>
          </div>
          <div style={{ marginTop: 6, color: theme.muted, fontSize: 13, lineHeight: 1.7 }}>
            {b.summary}
          </div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, color: theme.ink, fontWeight: 700 }}>{money(b.price)}</div>
            <div style={{ fontSize: 12, color: theme.muted }}>點擊看詳細</div>
          </div>
          <div
            style={{
              marginTop: 10,
              borderRadius: 14,
              border: `1px dashed ${theme.line}`,
              background: theme.card,
              height: 86,
              display: "grid",
              placeItems: "center",
              color: theme.muted,
              fontSize: 12,
            }}
          >
            包款照片位置
          </div>
        </button>
      ))}
    </div>
  );
}

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div
      style={{
        border: `1px solid ${theme.softLine}`,
        borderRadius: 16,
        padding: 14,
        background: "#fff",
      }}
    >
      <div style={{ fontWeight: 700, color: theme.ink, marginBottom: 4 }}>Q：{q}</div>
      <div style={{ color: theme.muted }}>A：{a}</div>
    </div>
  );
}

/* ===================== App ===================== */
export default function CrochetApp() {
  const LINE_URL = "https://lin.ee/WItaEyI";
  const IG_URL = "https://www.instagram.com/clouds_knitting";

  const sections = useMemo(
    () => [
      { key: "brand", label: "品牌介紹", icon: "brand" as const },
      { key: "price", label: "價目表", icon: "price" as const },
      { key: "notice", label: "預約須知", icon: "notice" as const },
      { key: "faq", label: "常見問題", icon: "faq" as const },
      { key: "booking", label: "我要預約", icon: "book" as const },
      { key: "member", label: "會員中心", icon: "member" as const },
      { key: "contact", label: "聯絡我們", icon: "contact" as const },
    ],
    []
  );

  const [active, setActive] = useState<string>("brand");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  /* Data */
  const bags: Bag[] = useMemo(
    () => [
      {
        id: "bucket",
        level: "初階",
        name: "水桶包",
        price: 2460,
        difficulty: "★★",
        summary:
          "學習圓形包底，能夠學到多個基礎針法、藏線方式，並可加購學習長肩帶，一包多個背法。",
        learn: [
          "圓形包底起針與加針邏輯",
          "多個基礎針法練習與組合",
          "藏線方式與收尾整理",
          "（加購）長肩帶製作與連接方式",
        ],
        apply: ["收納籃", "飲料提袋", "水桶包", "杯墊"],
      },
      {
        id: "mesh",
        level: "初階",
        name: "網格包",
        price: 2460,
        difficulty: "★★",
        summary:
          "實用頻率極高的包款，橢圓形包底，加針邏輯，能夠學到多個基礎針法、藏線方式。",
        learn: [
          "橢圓形包底起針與加針邏輯",
          "多個基礎針法練習與組合",
          "藏線方式與收尾整理",
          "（加購）長肩帶變化與連接方式",
        ],
        apply: ["收納籃", "髮夾收納", "網格包"],
      },
      {
        id: "drawstring",
        level: "初階",
        name: "韓系抽繩包",
        price: 2460,
        difficulty: "★★",
        summary:
          "精美細致的一款包，重複單一針法，可以將針法練到非常熟練；課堂決定鉤織大小。",
        learn: ["單一針法穩定度訓練", "抽繩結構與束口邏輯", "包型整理與使用後變化觀念"],
        apply: ["化妝包", "手提包"],
      },
      {
        id: "handbag",
        level: "初階",
        name: "手提包",
        price: 2460,
        difficulty: "★★",
        summary:
          "經典扎實的紋路，橢圓包底，學到多個基礎針法以及手把的縫合；可加購長肩帶。",
        learn: ["橢圓包底結構與加針邏輯", "多個基礎針法與紋路呈現", "手把縫合與穩固技巧", "（加購）長肩帶製作與固定方式"],
        apply: ["手提包", "肩背包（加購肩帶）"],
      },
      {
        id: "square",
        level: "初階",
        name: "方包",
        price: 2460,
        difficulty: "★★★",
        summary:
          "針法固定但辨識度較高；特殊包底放了物品完全不會變形；學鉤織肩帶及縫合五金方法。",
        learn: ["特殊包底結構（穩定不變形）", "固定針法下的辨識與節奏", "肩帶鉤織與五金縫合方法", "材料包含 50 公分肩帶（可加購線鉤長肩帶）"],
        apply: ["方包", "斜背包（可延伸）"],
      },
      {
        id: "colorTote",
        level: "進階",
        name: "撞色托特包",
        price: 2460,
        difficulty: "★★★",
        summary:
          "教如何換色鉤織、換色技巧、三角手把的製作、縫合技巧；一開始先學習長 25 的尺寸。",
        learn: ["換色鉤織技巧與收線整潔", "撞色節奏控制", "三角手把製作", "縫合技巧"],
        apply: ["托特包", "撞色變化設計"],
      },
      {
        id: "basket",
        level: "進階",
        name: "菜籃子",
        price: 2460,
        difficulty: "★★★",
        summary:
          "精美紋路，紋路的鉤針邏輯一次教會你；隱形縫合手把、跳色鉤織；可加購放大包款。",
        learn: ["紋路鉤織邏輯", "隱形縫合手把", "跳色鉤織技巧", "（加購）放大尺寸與用線評估"],
        apply: ["菜籃子", "大容量提袋（放大）"],
      },
      {
        id: "fluffy",
        level: "進階",
        name: "毛茸茸手提包",
        price: 2460,
        difficulty: "★★★",
        summary:
          "毛茸茸線材幾乎是盲鉤，但非常可愛的冬季包包，帶在身上真的會暖和。",
        learn: ["毛線特性與張力控制", "盲鉤節奏與手感", "包型整理"],
        apply: ["冬季手提包", "毛茸茸小物"],
      },
      {
        id: "horn",
        level: "牛角",
        name: "牛角包",
        price: 2860,
        difficulty: "★★★",
        summary:
          "需有鉤針經驗：使用特殊加針邏輯，鉤出完美弧度包型；手把原理可自行變換；放了物品整顆包更美。",
        learn: ["特殊加針邏輯（完美弧度）", "包型比例與張力控制", "手把鉤織原理與變化"],
        apply: ["牛角包", "弧形包型延伸"],
      },
    ],
    []
  );

  const addOns: AddOn[] = useMemo(
    () => [
      { id: "leatherStrap", name: "牛皮肩帶" },
      { id: "learnLongStrap", name: "學習長肩帶" },
    ],
    []
  );

  const seededSlots: Slot[] = useMemo(() => {
    const today = new Date();
    const days = [2, 4, 7, 9, 12].map((d) => {
      const dt = new Date(today);
      dt.setDate(today.getDate() + d);
      const dd = String(dt.getDate()).padStart(2, "0");
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      return `${dt.getFullYear()}-${mm}-${dd}`;
    });
    const out: Slot[] = [];
    for (const date of days) {
      out.push(
        { id: uid("slot"), date, label: "上午 10:00–13:00", isOpen: true },
        { id: uid("slot"), date, label: "下午 14:00–17:00", isOpen: true },
        { id: uid("slot"), date, label: "晚上 19:00–22:00", isOpen: true }
      );
    }
    return out;
  }, []);

  /* State */
  const [bagOpenId, setBagOpenId] = useState<string | null>(null);

  const [memberEmail, setMemberEmail] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [currentMember, setCurrentMember] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);

  const [draft, setDraft] = useState({
    experience: "" as "" | "有" | "無",
    bagId: "",
    colorCode: "",
    addOnIds: [] as string[],
    date: "",
    slotId: "",
    name: "",
    phone: "",
    email: "",
    paymentLast5: "",
    note: "",
  });

  useEffect(() => {
    const savedBookings = lsGet<Booking[]>(LS_BOOKINGS, []);
    setBookings(savedBookings);

    const savedSlots = lsGet<Slot[]>(LS_SLOTS, []);
    if (savedSlots.length === 0) {
      lsSet(LS_SLOTS, seededSlots);
      setSlots(seededSlots);
    } else setSlots(savedSlots);

    const savedCurrent = lsGet<string | null>(LS_CURRENT, null);
    setCurrentMember(savedCurrent);
    if (savedCurrent) setDraft((d) => ({ ...d, email: savedCurrent }));
  }, [seededSlots]);

  useEffect(() => lsSet(LS_BOOKINGS, bookings), [bookings]);
  useEffect(() => lsSet(LS_SLOTS, slots), [slots]);

  /* Responsive */
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Maps */
  const slotById = useMemo(() => new Map(slots.map((s) => [s.id, s])), [slots]);
  const bagById = useMemo(() => new Map(bags.map((b) => [b.id, b])), [bags]);
  const addOnById = useMemo(() => new Map(addOns.map((a) => [a.id, a])), [addOns]);

  const bookedSlotIds = useMemo(() => {
    const locked = new Set<string>();
    bookings.forEach((b) => {
      if (b.status !== "已取消") locked.add(b.slotId);
    });
    return locked;
  }, [bookings]);

  const availableDates = useMemo(() => {
    const ds = Array.from(new Set(slots.filter((s) => s.isOpen).map((s) => s.date)));
    ds.sort();
    return ds;
  }, [slots]);

  const slotsForDate = useMemo(() => {
    if (!draft.date) return [];
    return slots.filter((s) => s.date === draft.date).sort((a, b) => a.label.localeCompare(b.label, "zh-TW"));
  }, [slots, draft.date]);

  const activeSection = sections.find((s) => s.key === active);
  const bagModal = bagOpenId ? bagById.get(bagOpenId) : null;

  const myBookings = useMemo(() => {
    if (!currentMember) return [];
    return bookings.filter((b) => b.email === currentMember).sort((a, b) => b.createdAt - a.createdAt);
  }, [bookings, currentMember]);

  /* Auth */
  function registerOrLogin() {
    const members = lsGet<Member[]>(LS_MEMBERS, []);
    const email = memberEmail.trim().toLowerCase();
    const pw = memberPassword;

    if (!email || !pw) return alert("請輸入 Email 與密碼");

    const exists = members.find((m) => m.email === email);
    if (!exists) {
      const next = [...members, { email, password: pw }];
      lsSet(LS_MEMBERS, next);
      lsSet(LS_CURRENT, email);
      setCurrentMember(email);
      setDraft((d) => ({ ...d, email }));
      return alert("已註冊並登入");
    }
    if (exists.password !== pw) return alert("密碼錯誤");

    lsSet(LS_CURRENT, email);
    setCurrentMember(email);
    setDraft((d) => ({ ...d, email }));
    alert("登入成功");
  }

  function logout() {
    lsSet(LS_CURRENT, null);
    setCurrentMember(null);
    alert("已登出");
  }

  /* Booking */
  function validateDraft(): string | null {
    if (!draft.name.trim()) return "請填寫姓名";
    if (!draft.phone.trim()) return "請填寫手機";
    if (!draft.email.trim()) return "請填寫信箱";
    if (!draft.experience) return "請選擇是否有鉤針經驗";
    if (!draft.bagId) return "請選擇包款";
    if (!draft.colorCode.trim()) return "請填寫色號";
    if (!draft.date || !draft.slotId) return "請選擇日期與時段";
    if (!draft.paymentLast5.trim()) return "請填寫匯款末 5 碼";
    if (draft.paymentLast5.trim().length !== 5) return "匯款末 5 碼需為 5 位數";

    const slot = slotById.get(draft.slotId);
    if (!slot || !slot.isOpen) return "此時段目前不可預約";
    if (bookedSlotIds.has(draft.slotId)) return "此時段已被預約，請選擇其他時段";

    return null;
  }

  function submitBooking() {
    const err = validateDraft();
    if (err) return alert(err);

    const b: Booking = {
      id: uid("bk"),
      createdAt: Date.now(),
      status: "待審核",

      name: draft.name.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim().toLowerCase(),
      experience: draft.experience as "有" | "無",

      bagId: draft.bagId,
      colorCode: draft.colorCode.trim(),
      addOnIds: draft.addOnIds,

      slotId: draft.slotId,

      paymentLast5: draft.paymentLast5.trim(),
      note: draft.note.trim(),
    };

    setBookings((prev) => [b, ...prev]);

    setDraft((d) => ({
      ...d,
      experience: "",
      bagId: "",
      colorCode: "",
      addOnIds: [],
      date: "",
      slotId: "",
      name: "",
      phone: "",
      paymentLast5: "",
      note: "",
    }));

    alert("已送出預約申請。提醒：匯款完成並收到預約成功通知才算成功。");
  }

  /* Prototype admin (local) */
  const [adminMode, setAdminMode] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const ADMIN_KEY = "clouds";

  function approveBooking(id: string) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "已確認" } : b)));
  }
  function cancelBooking(id: string) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "已取消" } : b)));
  }
  function closeSlot(slotId: string) {
    setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, isOpen: false } : s)));
  }
  function openSlot(slotId: string) {
    setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, isOpen: true } : s)));
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink, fontFamily: FONT_SANS }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : sidebarCollapsed ? "76px 1fr" : "300px 1fr",
          minHeight: "100vh",
        }}
      >
        {/* Sidebar desktop */}
        {!isMobile && (
          <aside
            style={{
              borderRight: `1px solid ${theme.softLine}`,
              padding: "18px 14px",
              position: "sticky",
              top: 0,
              height: "100vh",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Logo placeholder */}
            <div style={{ padding: "10px 10px 14px", border: `1px solid ${theme.softLine}`, borderRadius: 16, background: theme.card }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      border: `1px dashed ${theme.line}`,
                      background: "#fff",
                      display: "grid",
                      placeItems: "center",
                      color: theme.muted,
                      fontSize: 11,
                    }}
                    title="Logo 占位（之後換成你的 logo 圖檔）"
                  >
                    Logo
                  </div>
                  {!sidebarCollapsed && (
                    <div>
                      <div style={{ fontFamily: FONT_SERIF, fontSize: 16, letterSpacing: "0.02em" }}>Clouds Knitting</div>
                      <div style={{ fontSize: 12, color: theme.muted }}>一對一鉤針包款課程</div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSidebarCollapsed((v) => !v)}
                  style={{ borderRadius: 12, padding: 8, border: `1px solid ${theme.softLine}`, background: "#fff", cursor: "pointer" }}
                  aria-label="toggle sidebar"
                  title={sidebarCollapsed ? "展開側欄" : "收合側欄"}
                >
                  {sidebarCollapsed ? <Icon name="menu" color={theme.blue} /> : <Icon name="close" color={theme.blue} />}
                </button>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ display: "grid", gap: 6 }}>
              {sections.map((s) => {
                const isActive = s.key === active;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setActive(s.key)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: sidebarCollapsed ? "10px" : "10px 12px",
                      borderRadius: 14,
                      border: `1px solid ${isActive ? theme.blue : "transparent"}`,
                      background: isActive ? theme.blueSoft : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    title={s.label}
                  >
                    <Icon name={s.icon} color={isActive ? theme.blue : theme.ink} />
                    {!sidebarCollapsed && <span style={{ fontSize: 14, color: theme.ink }}>{s.label}</span>}
                  </button>
                );
              })}
            </nav>

            <div style={{ flex: 1 }} />

            {/* Quick contact */}
            <div style={{ display: "grid", gap: 8, padding: "12px 10px", borderRadius: 16, border: `1px solid ${theme.softLine}`, background: theme.card }}>
              {!sidebarCollapsed && <div style={{ fontSize: 12, color: theme.muted }}>快速聯絡</div>}
              <a
                href={LINE_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 14,
                  border: `1px solid ${theme.line}`,
                  textDecoration: "none",
                  color: theme.ink,
                  background: "#fff",
                }}
              >
                <Icon name="line" color={theme.blue} />
                {!sidebarCollapsed && <span style={{ fontSize: 13 }}>LINE 官方</span>}
              </a>
              <a
                href={IG_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 14,
                  border: `1px solid ${theme.line}`,
                  textDecoration: "none",
                  color: theme.ink,
                  background: "#fff",
                }}
              >
                <Icon name="ig" color={theme.blue} />
                {!sidebarCollapsed && <span style={{ fontSize: 13 }}>Instagram</span>}
              </a>
            </div>
          </aside>
        )}

        {/* Main */}
        <div style={{ minWidth: 0 }}>
          {/* Mobile sticky header: scrollable tabs (NO hamburger) */}
          {isMobile && (
            <header
              style={{
                position: "sticky",
                top: 0,
                zIndex: 20,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(8px)",
                borderBottom: `1px solid ${theme.softLine}`,
              }}
            >
              <div style={{ padding: "12px 14px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 18 }}>Clouds Knitting</div>
                    <div style={{ color: theme.muted, fontSize: 12 }}>一對一鉤針包款課程</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <a
                      href={LINE_URL}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 14,
                        display: "grid",
                        placeItems: "center",
                        border: `1px solid ${theme.line}`,
                        background: "#fff",
                        textDecoration: "none",
                      }}
                      aria-label="LINE"
                    >
                      <Icon name="line" color={theme.blue} />
                    </a>
                    <a
                      href={IG_URL}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 14,
                        display: "grid",
                        placeItems: "center",
                        border: `1px solid ${theme.line}`,
                        background: "#fff",
                        textDecoration: "none",
                      }}
                      aria-label="Instagram"
                    >
                      <Icon name="ig" color={theme.blue} />
                    </a>
                  </div>
                </div>
              </div>

              <nav style={{ display: "flex", overflowX: "auto", gap: 10, padding: "8px 14px 12px" }}>
                {sections.map((s) => (
                  <PillButton key={s.key} active={active === s.key} onClick={() => setActive(s.key)}>
                    {s.label}
                  </PillButton>
                ))}
              </nav>
            </header>
          )}

          <main
            style={{
              padding: isMobile ? "16px 14px 60px" : "26px 28px",
              maxWidth: 1020,
              margin: "0 auto",
              display: "grid",
              gap: 16,
            }}
          >
            {!isMobile && (
              <div style={{ padding: "6px 2px 0" }}>
                <H1>{activeSection?.label}</H1>
                <Subtle>白色主調 × 深咖文字 × 霧灰藍點綴。所有圖示皆為 SVG 線條風格。</Subtle>
              </div>
            )}

            {active === "brand" && (
              <>
                <Card title="一針一引，療癒自己" icon={<Icon name="brand" color={theme.blue} />}>
                  <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                    <li>不只教完成，而是教你如何學以致用。</li>
                    <li>除了學會看織圖，也能學會調整其他尺寸。</li>
                    <li>學會後能實際運用在其他款式上，建立自己的延伸能力。</li>
                    <li>主打教學負責，把你教到會。</li>
                  </ul>
                </Card>

                <Card title="上課方式" icon={<Icon name="calendar" color={theme.blue} />}>
                  <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                    <li>課程以一對一教學為主，節奏依學生程度調整。</li>
                    <li>包款色號與加購項目建議先透過 LINE 討論確認後再預約。</li>
                  </ul>
                </Card>
              </>
            )}

            {active === "price" && (
              <Card
                title="價目表與包款"
                icon={<Icon name="price" color={theme.blue} />}
                footer={<div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.7 }}>每個包款皆預留照片位置。點擊包款可查看詳細內容。</div>}
              >
                <div style={{ display: "grid", gap: 14 }}>
                  <GroupTitle label="初階包款" meta="NT$2460（線上便宜 $100）" />
                  <BagGrid bags={bags.filter((b) => b.level === "初階")} onOpen={(id) => setBagOpenId(id)} />

                  <GroupTitle label="進階包款" meta="NT$2460（適合有鉤針基礎）" />
                  <BagGrid bags={bags.filter((b) => b.level === "進階")} onOpen={(id) => setBagOpenId(id)} />

                  <GroupTitle label="牛角包" meta="NT$2860（需有鉤針經驗）" />
                  <BagGrid bags={bags.filter((b) => b.level === "牛角")} onOpen={(id) => setBagOpenId(id)} />
                </div>
              </Card>
            )}

            {active === "notice" && (
              <Card title="預約須知" icon={<Icon name="notice" color={theme.blue} />}>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                  <li>完成匯款後填寫預約表單，我們確認收款後預約才正式成立。</li>
                  <li>課程約 3 小時教完整顆包包的織法，「重複部分」需回家自行完成。</li>
                  <li>材料包裡的線材是足夠的，但因每個人的手勁不同會影響用線量。</li>
                  <li>完成報名後不得取消及退費，只能轉讓他人課程、更改時段，或換此包款成品。</li>
                </ul>
              </Card>
            )}

            {active === "faq" && (
              <Card title="常見問題" icon={<Icon name="faq" color={theme.blue} />}>
                <div style={{ display: "grid", gap: 12, lineHeight: 1.8 }}>
                  <QA q="完全沒有經驗也可以參加嗎？" a="當然可以。初學者包款課程專為零基礎學員設計。" />
                  <QA q="需要自備工具或材料嗎？" a="完全不需要。課程費用已包含所有材料與工具使用。" />
                  <QA q="預約後可以取消嗎？" a="完成報名後不得取消及退費，只能轉讓他人課程、更改時段，或換此包款成品。" />
                </div>
              </Card>
            )}

            {active === "booking" && (
              <>
                <Card title="匯款資訊" icon={<Icon name="link" color={theme.blue} />}>
                  <div style={{ border: `1px solid ${theme.line}`, borderRadius: 16, padding: 14, background: "#fff", display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>銀行代碼：824 連線銀行</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>匯款帳號：111015503125</div>
                    <div style={{ marginTop: 6, color: theme.muted, fontSize: 13, lineHeight: 1.7 }}>
                      提醒：匯款完成並<strong style={{ color: theme.ink }}>收到預約成功通知</strong>才算成功。
                    </div>
                  </div>
                </Card>

                <Card title="我要預約" icon={<Icon name="calendar" color={theme.blue} />}>
                  <div style={{ display: "grid", gap: 14 }}>
                    <Subtle>
                      建議先透過 LINE 與老師確認顏色、是否現貨，以及是否有想加購（牛皮肩帶／學習長肩帶等），再完成預約填寫。
                    </Subtle>

                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                      <Input label="姓名" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} required />
                      <Input label="手機" value={draft.phone} onChange={(v) => setDraft((d) => ({ ...d, phone: v }))} required />
                      <Input label="信箱" value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} required placeholder="example@email.com" type="email" />
                      <RadioGroup
                        label="是否有鉤針經驗？"
                        value={draft.experience}
                        onChange={(v) => setDraft((d) => ({ ...d, experience: v as any }))}
                        options={["有", "無"]}
                        required
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                      <label style={{ display: "grid", gap: 6 }}>
                        <span style={{ fontSize: 12, color: theme.muted }}>
                          選擇包款 <span style={{ color: theme.blue }}>*</span>
                        </span>
                        <select
                          value={draft.bagId}
                          onChange={(e) => setDraft((d) => ({ ...d, bagId: e.target.value }))}
                          style={{ borderRadius: 12, border: `1px solid ${theme.line}`, padding: "10px 12px", fontSize: 14, background: "#fff", color: theme.ink }}
                        >
                          <option value="">請選擇</option>
                          <optgroup label="初階包款">
                            {bags.filter((b) => b.level === "初階").map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.name}（{b.difficulty}） {money(b.price)}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="進階包款">
                            {bags.filter((b) => b.level === "進階").map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.name}（{b.difficulty}） {money(b.price)}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="牛角包">
                            {bags.filter((b) => b.level === "牛角").map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.name}（{b.difficulty}） {money(b.price)}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </label>

                      <Input
                        label="色號（請先與老師確認）"
                        value={draft.colorCode}
                        onChange={(v) => setDraft((d) => ({ ...d, colorCode: v }))}
                        required
                        placeholder="例如：奶茶色 / 123"
                      />
                    </div>

                    <CheckboxGroup label="加購項目" value={draft.addOnIds} onChange={(next) => setDraft((d) => ({ ...d, addOnIds: next }))} options={addOns} />

                    <div style={{ border: `1px solid ${theme.softLine}`, borderRadius: 16, padding: 14, background: "#fff", display: "grid", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Icon name="calendar" color={theme.blue} />
                        <div style={{ fontWeight: 600 }}>選擇日期與時段</div>
                      </div>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {availableDates.map((d) => (
                          <PillButton key={d} active={draft.date === d} onClick={() => setDraft((x) => ({ ...x, date: d, slotId: "" }))}>
                            {d}
                          </PillButton>
                        ))}
                      </div>

                      {draft.date ? (
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {slotsForDate.map((s) => {
                            const locked = bookedSlotIds.has(s.id);
                            const disabled = locked || !s.isOpen;
                            return (
                              <PillButton
                                key={s.id}
                                active={draft.slotId === s.id}
                                disabled={disabled}
                                title={disabled ? (locked ? "此時段已被預約" : "此時段已關閉") : "可預約"}
                                onClick={() => setDraft((d) => ({ ...d, slotId: s.id }))}
                              >
                                {s.label} {locked ? "（已滿）" : ""}
                              </PillButton>
                            );
                          })}
                        </div>
                      ) : (
                        <Subtle>請先選擇日期。</Subtle>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                      <Input
                        label="匯款末 5 碼"
                        value={draft.paymentLast5}
                        onChange={(v) => setDraft((d) => ({ ...d, paymentLast5: v.replace(/\D/g, "").slice(0, 5) }))}
                        required
                        placeholder="請輸入 5 位數"
                      />
                      <div />
                    </div>

                    <TextArea label="備註（可填想要的顏色方向／加購需求／其他）" value={draft.note} onChange={(v) => setDraft((d) => ({ ...d, note: v }))} />

                    <PrimaryButton onClick={submitBooking}>送出預約申請</PrimaryButton>

                    <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.7 }}>
                      送出後狀態會顯示為「待審核」。老師確認收款並審核通過後，才會變更為「已確認」（預約成功）。
                    </div>
                  </div>
                </Card>
              </>
            )}

            {active === "member" && (
              <Card title="會員中心" icon={<Icon name="member" color={theme.blue} />}>
                <div style={{ display: "grid", gap: 14 }}>
                  {!currentMember ? (
                    <>
                      <Subtle>使用 Email + 密碼登入（原型示範）。正式版本會改為雲端資料庫與真正後台。</Subtle>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                        <Input label="Email" value={memberEmail} onChange={setMemberEmail} placeholder="example@email.com" type="email" required />
                        <Input label="密碼" value={memberPassword} onChange={setMemberPassword} type="password" required />
                      </div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <SecondaryButton onClick={registerOrLogin}>註冊 / 登入</SecondaryButton>
                        <SecondaryButton
                          onClick={() => {
                            setMemberEmail("");
                            setMemberPassword("");
                          }}
                        >
                          清除
                        </SecondaryButton>
                      </div>
                      <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.7 }}>
                        提示：此原型會把會員與預約資料存在你的瀏覽器中（localStorage）。不同電腦/瀏覽器不會同步。
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{currentMember}</div>
                          <div style={{ fontSize: 12, color: theme.muted }}>可查看自己的預約與狀態</div>
                        </div>
                        <SecondaryButton onClick={logout}>登出</SecondaryButton>
                      </div>

                      <div style={{ display: "grid", gap: 10 }}>
                        {myBookings.length === 0 ? (
                          <div style={{ padding: 14, borderRadius: 16, border: `1px dashed ${theme.line}`, background: "#fff", color: theme.muted }}>
                            目前沒有預約紀錄。你可以到「我要預約」送出預約申請。
                          </div>
                        ) : (
                          myBookings.map((b) => {
                            const bag = bagById.get(b.bagId);
                            const slot = slotById.get(b.slotId);
                            const badgeBg =
                              b.status === "待審核" ? theme.blueSoft : b.status === "已確認" ? theme.blue : theme.danger;
                            const badgeFg = b.status === "已確認" ? "#fff" : theme.ink;

                            return (
                              <div
                                key={b.id}
                                style={{
                                  border: `1px solid ${theme.softLine}`,
                                  borderRadius: 18,
                                  background: "#fff",
                                  padding: 14,
                                  display: "grid",
                                  gap: 10,
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Icon name="bag" color={theme.blue} />
                                    <div style={{ fontFamily: FONT_SERIF, fontSize: 16 }}>{bag?.name ?? "（未知包款）"}</div>
                                  </div>
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      padding: "6px 10px",
                                      borderRadius: 999,
                                      border: `1px solid ${theme.line}`,
                                      background: badgeBg,
                                      color: badgeFg,
                                      fontSize: 12,
                                    }}
                                  >
                                    {b.status}
                                  </span>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, fontSize: 13, lineHeight: 1.8 }}>
                                  <Field label="時段" value={slot ? `${slot.date}｜${slot.label}` : "（未知時段）"} />
                                  <Field label="鉤針經驗" value={b.experience} />
                                  <Field label="色號" value={b.colorCode} />
                                  <Field
                                    label="加購"
                                    value={
                                      b.addOnIds.length === 0
                                        ? "無"
                                        : b.addOnIds.map((id) => addOnById.get(id)?.name).filter(Boolean).join("、")
                                    }
                                  />
                                  <Field label="匯款末 5 碼" value={b.paymentLast5} />
                                </div>

                                <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.7 }}>
                                  提醒：匯款完成並收到<strong style={{ color: theme.ink }}>預約成功通知</strong>才算成功。
                                </div>

                                {adminMode && (
                                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                    <SecondaryButton onClick={() => approveBooking(b.id)}>標記已確認</SecondaryButton>
                                    <SecondaryButton onClick={() => cancelBooking(b.id)}>取消（釋放時段）</SecondaryButton>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}

                  {/* Admin toggle */}
                  <div style={{ marginTop: 8, padding: 14, borderRadius: 18, border: `1px solid ${theme.softLine}`, background: theme.card, display: "grid", gap: 10 }}>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 16 }}>老師示範模式（原型）</div>
                    <Subtle>本機示範用：用來展示「審核／取消／關閉時段」。正式版本會改成真正後台與權限。</Subtle>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <Input label="示範密碼" value={adminKey} onChange={setAdminKey} type="password" placeholder="輸入示範密碼" />
                      <SecondaryButton
                        onClick={() => {
                          if (adminKey === ADMIN_KEY) {
                            setAdminMode((v) => !v);
                            alert(adminMode ? "已關閉示範模式" : "已開啟示範模式");
                          } else alert("密碼不正確");
                        }}
                      >
                        {adminMode ? "關閉示範模式" : "開啟示範模式"}
                      </SecondaryButton>
                    </div>

                    {adminMode && (
                      <div style={{ display: "grid", gap: 8 }}>
                        <div style={{ fontSize: 12, color: theme.muted }}>時段管理（開放/關閉）</div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {slots.slice(0, 9).map((s) => (
                            <PillButton key={s.id} active={s.isOpen} onClick={() => (s.isOpen ? closeSlot(s.id) : openSlot(s.id))}>
                              {s.date} {s.label} {s.isOpen ? "（開放）" : "（關閉）"}
                            </PillButton>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {active === "contact" && (
              <Card title="聯絡我們" icon={<Icon name="contact" color={theme.blue} />}>
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={{ border: `1px solid ${theme.softLine}`, borderRadius: 18, padding: 14, background: "#fff", display: "grid", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon name="line" color={theme.blue} />
                      <div style={{ fontFamily: FONT_SERIF, fontSize: 16 }}>LINE 官方帳號</div>
                    </div>
                    <div style={{ color: theme.muted, fontSize: 13, lineHeight: 1.7 }}>
                      建議先透過 LINE 與老師確認包款顏色、是否現貨，以及加購需求。
                    </div>
                    <a
                      href={LINE_URL}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 14,
                        border: `1px solid ${theme.line}`,
                        background: theme.blueSoft,
                        color: theme.ink,
                        textDecoration: "none",
                        width: "fit-content",
                      }}
                    >
                      <Icon name="link" color={theme.blue} />
                      <span>前往 LINE</span>
                    </a>
                  </div>

                  <div style={{ border: `1px solid ${theme.softLine}`, borderRadius: 18, padding: 14, background: "#fff", display: "grid", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon name="ig" color={theme.blue} />
                      <div style={{ fontFamily: FONT_SERIF, fontSize: 16 }}>Instagram</div>
                    </div>
                    <div style={{ color: theme.muted, fontSize: 13, lineHeight: 1.7 }}>作品展示與鉤針風格分享。</div>
                    <a
                      href={IG_URL}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 14,
                        border: `1px solid ${theme.line}`,
                        background: theme.blueSoft,
                        color: theme.ink,
                        textDecoration: "none",
                        width: "fit-content",
                      }}
                    >
                      <Icon name="link" color={theme.blue} />
                      <span>前往 Instagram</span>
                    </a>
                  </div>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* Bag detail modal */}
      <Modal
        open={!!bagModal}
        title={bagModal ? `${bagModal.name}（${bagModal.level}｜${bagModal.difficulty}）` : ""}
        onClose={() => setBagOpenId(null)}
      >
        {bagModal && (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 12 }}>
              <div style={{ border: `1px solid ${theme.softLine}`, borderRadius: 16, padding: 14, background: theme.card }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 18, marginBottom: 6 }}>{bagModal.name}</div>
                <div style={{ color: theme.muted, fontSize: 13, lineHeight: 1.8 }}>{bagModal.summary}</div>
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, border: `1px solid ${theme.line}`, borderRadius: 999, padding: "6px 10px", background: theme.blueSoft }}>
                    {money(bagModal.price)}
                  </span>
                  <span style={{ fontSize: 12, border: `1px solid ${theme.line}`, borderRadius: 999, padding: "6px 10px", background: theme.blueSoft }}>
                    {bagModal.level}｜難度 {bagModal.difficulty}
                  </span>
                </div>
              </div>

              <div style={{ border: `1px dashed ${theme.line}`, borderRadius: 16, padding: 14, background: "#fff", minHeight: 160, display: "grid", placeItems: "center", color: theme.muted }}>
                <div style={{ textAlign: "center", lineHeight: 1.6 }}>
                  <div style={{ fontFamily: FONT_SERIF, color: theme.ink }}>包款照片位置</div>
                  <div style={{ fontSize: 12 }}>之後可替換成你的包款圖片</div>
                </div>
              </div>
            </div>

            <div style={{ border: `1px solid ${theme.softLine}`, borderRadius: 16, padding: 14, background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Icon name="bag" color={theme.blue} />
                <div style={{ fontFamily: FONT_SERIF, fontSize: 16 }}>能學到的針法 / 技巧</div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                {bagModal.learn.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>

            <div style={{ border: `1px solid ${theme.softLine}`, borderRadius: 16, padding: 14, background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Icon name="link" color={theme.blue} />
                <div style={{ fontFamily: FONT_SERIF, fontSize: 16 }}>可延伸應用範圍</div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                {bagModal.apply.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <SecondaryButton
                onClick={() => {
                  setActive("booking");
                  setBagOpenId(null);
                  setDraft((d) => ({ ...d, bagId: bagModal.id }));
                }}
              >
                帶入此包款並前往預約
              </SecondaryButton>
              <SecondaryButton onClick={() => setBagOpenId(null)}>關閉</SecondaryButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: theme.muted, fontSize: 12 }}>{label}</div>
      <div>{value}</div>
    </div>
  );
}

