import React, { useEffect, useMemo, useState } from "react";

/* ===================== Theme ===================== */
const theme = {
  bg: "#FFFFFF",
  card: "#FCFCFA",
  line: "#EAE6DF",
  softLine: "#EFEAE2",
  ink: "#4B3621",
  muted: "#7A6A58",

  // Mist blue (more visible)
  blue: "#70879A",
  blueDeep: "#5D7487",
  blueSoft: "#E7EEF3",
  blueTint: "#F3F7FA",
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
  hours: number; // course duration
  difficulty: Difficulty;
  summary: string;
  learn: string[];
  apply: string[];
};

type AddOn = { id: string; name: string; price: number };

type Slot = {
  id: string;
  date: string; // YYYY-MM-DD
  label: string; // e.g. "下午 14:00–17:00"
  isOpen: boolean;
};

type BookingStatus = "等待匯款" | "等待審核中" | "預約成功" | "未成立";

type Booking = {
  id: string;
  createdAt: number;
  status: BookingStatus;

  // Student info
  name: string;
  email: string;
  phone: string;
  experience: "有" | "無";

  // Course
  bagId: string;
  colorCode: string;
  addOnIds: string[];

  slotId: string;

  // Payment
  paymentLast5?: string;

  // Teacher-only fields (read-only to student)
  colorConfirmedResult: string;

  note: string;
};

type Member = { email: string; password: string };

/* ===================== Storage (prototype) ===================== */
const LS_MEMBERS = "ck_members_v3";
const LS_CURRENT = "ck_current_member_v3";
const LS_BOOKINGS = "ck_bookings_v3";
const LS_SLOTS = "ck_slots_v3";

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
    | "teach"
    | "price"
    | "notice"
    | "book"
    | "mine"
    | "contact"
    | "bag"
    | "calendar"
    | "link"
    | "line"
    | "ig"
    | "check";
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
    strokeWidth: 1.7,
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
    case "teach":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M6 6v12" />
          <path d="M18 6v12" />
          <path d="M8 10h8" />
          <path d="M8 14h6" />
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
    case "book":
      return (
        <svg {...common}>
          <path d="M4 19V6a2 2 0 0 1 2-2h12v15" />
          <path d="M6 4v15a2 2 0 0 0 2 2h12" />
        </svg>
      );
    case "mine":
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
    case "check":
      return (
        <svg {...common}>
          <path d="M20 6L9 17l-5-5" />
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
        boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
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
            background: "#fff",
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
        margin: "0 0 8px 0",
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
        border: `1px solid ${active ? theme.blueDeep : theme.line}`,
        background: disabled ? "#F1F1F1" : active ? theme.blueSoft : "#fff",
        color: disabled ? "#9A9A9A" : theme.ink,
        cursor: disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        boxShadow: active ? "0 10px 20px rgba(0,0,0,0.06)" : "none",
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
        background: disabled ? "#C7C7C7" : theme.blueDeep,
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
        {label} {required ? <span style={{ color: theme.blueDeep }}>*</span> : null}
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
        {label} {required ? <span style={{ color: theme.blueDeep }}>*</span> : null}
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
              border: `1px solid ${value === opt ? theme.blueDeep : theme.line}`,
              background: value === opt ? theme.blueSoft : "#fff",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name={label}
              checked={value === opt}
              onChange={() => onChange(opt)}
              style={{ accentColor: theme.blueDeep }}
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
  options: AddOn[];
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
                border: `1px solid ${checked ? theme.blueDeep : theme.line}`,
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
                style={{ accentColor: theme.blueDeep }}
              />
              <span style={{ fontSize: 13 }}>
                {opt.name}（{money(opt.price)}）
              </span>
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
          boxShadow: "0 18px 50px rgba(0,0,0,0.16)",
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
            background: theme.blueTint,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: FONT_SERIF,
              fontSize: 18,
              color: theme.ink,
            }}
          >
            {title}
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

function GroupTitle({ label, meta }: { label: string; meta: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: theme.ink }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color: theme.muted }}>{meta}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: theme.muted, fontSize: 12 }}>{label}</div>
      <div style={{ lineHeight: 1.7 }}>{value}</div>
    </div>
  );
}

function PhotoSlot({ label }: { label: string }) {
  return (
    <div
      style={{
        marginTop: 10,
        borderRadius: 14,
        border: `1px dashed ${theme.blue}`,
        background: theme.blueTint,
        height: 92,
        display: "grid",
        placeItems: "center",
        color: theme.blueDeep,
        fontSize: 12,
      }}
    >
      {label}
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
            boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div style={{ fontFamily: FONT_SERIF, fontSize: 16, color: theme.ink }}>
              {b.name}
            </div>
            <span
              style={{
                fontSize: 12,
                color: theme.blueDeep,
                border: `1px solid ${theme.blue}`,
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
            <div style={{ fontSize: 13, color: theme.ink, fontWeight: 800 }}>{money(b.price)}</div>
            <div style={{ fontSize: 12, color: theme.muted }}>點擊看詳細</div>
          </div>
          <PhotoSlot label="包款照片位置" />
        </button>
      ))}
    </div>
  );
}

/* ===================== App ===================== */
export default function App() {
  // External links
  const LINE_URL = "https://lin.ee/WItaEyI";
  const IG_URL =
    "https://www.instagram.com/clouds_knitting?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

  // Payment info (shown ONLY in Checkout after booking submit)
  const BANK_CODE = "824 連線銀行";
  const BANK_ACCOUNT = "111015503125";

  // Location (for member detail)
  const COURSE_LOCATION = "（請於 LINE 確認上課地點）";

  const sections = useMemo(
    () => [
      { key: "teach", label: "教學介紹", icon: "teach" as const },
      { key: "price", label: "包款課程", icon: "price" as const },
      { key: "booking", label: "我要預約", icon: "book" as const },
      { key: "notice", label: "預約須知", icon: "notice" as const },
      { key: "mine", label: "我的預約", icon: "mine" as const },
      { key: "contact", label: "聯絡我們", icon: "contact" as const },
    ],
    []
  );

  const [active, setActive] = useState<string>("teach");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const bags: Bag[] = useMemo(
    () => [
      {
        id: "bucket",
        level: "初階",
        name: "水桶包",
        price: 2460,
        hours: 3,
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
        hours: 3,
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
        hours: 3,
        difficulty: "★★",
        summary:
          "精美細致的一款包，重複單一針法，可把針法練到非常熟練；課堂決定鉤織大小。",
        learn: ["單一針法穩定度訓練", "抽繩結構與束口邏輯", "包型整理與使用後變化觀念"],
        apply: ["化妝包", "手提包"],
      },
      {
        id: "handbag",
        level: "初階",
        name: "手提包",
        price: 2460,
        hours: 3,
        difficulty: "★★",
        summary:
          "經典扎實的紋路，橢圓包底，學到多個基礎針法以及手把的縫合；可加購長肩帶。",
        learn: [
          "橢圓包底結構與加針邏輯",
          "多個基礎針法與紋路呈現",
          "手把縫合與穩固技巧",
          "（加購）長肩帶製作與固定方式",
        ],
        apply: ["手提包", "肩背包（加購肩帶）"],
      },
      {
        id: "square",
        level: "初階",
        name: "方包",
        price: 2460,
        hours: 3,
        difficulty: "★★★",
        summary:
          "針法固定但辨識度較高；特殊包底放了物品完全不會變形；學肩帶與五金縫合方法。",
        learn: [
          "特殊包底結構（穩定不變形）",
          "固定針法下的辨識與節奏",
          "肩帶鉤織與五金縫合方法",
          "材料包含 50 公分肩帶（可加購線鉤長肩帶）",
        ],
        apply: ["方包", "斜背包（可延伸）"],
      },
      {
        id: "colorTote",
        level: "進階",
        name: "撞色托特包",
        price: 2460,
        hours: 3,
        difficulty: "★★★",
        summary:
          "教如何換色鉤織、換色技巧、三角手把製作、縫合技巧；一開始先學習長 25 的尺寸。",
        learn: ["換色鉤織技巧與收線整潔", "撞色節奏控制", "三角手把製作", "縫合技巧"],
        apply: ["托特包", "撞色變化設計"],
      },
      {
        id: "basket",
        level: "進階",
        name: "菜籃子",
        price: 2460,
        hours: 3,
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
        hours: 3,
        difficulty: "★★★",
        summary: "毛茸茸線材幾乎是盲鉤，但非常可愛的冬季包包，帶在身上真的會暖和。",
        learn: ["毛線特性與張力控制", "盲鉤節奏與手感", "包型整理"],
        apply: ["冬季手提包", "毛茸茸小物"],
      },
      {
        id: "horn",
        level: "牛角",
        name: "牛角包",
        price: 2860,
        hours: 3,
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
      { id: "leatherStrap", name: "牛皮肩帶", price: 600 },
      { id: "learnLongStrap", name: "學習長肩帶", price: 400 },
    ],
    []
  );

  const [bagOpenId, setBagOpenId] = useState<string | null>(null);

  // Auth (prototype)
  const [memberEmail, setMemberEmail] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [currentMember, setCurrentMember] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);

  // Checkout modal
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutBookingId, setCheckoutBookingId] = useState<string | null>(null);
  const [checkoutLast5, setCheckoutLast5] = useState<string>("");

  // Draft booking (no payment info here)
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
    note: "",
  });

  // Responsive
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Seed slots (demo)
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

  const bagById = useMemo(() => new Map(bags.map((b) => [b.id, b])), [bags]);
  const addOnById = useMemo(() => new Map(addOns.map((a) => [a.id, a])), [addOns]);
  const slotById = useMemo(() => new Map(slots.map((s) => [s.id, s])), [slots]);

  const bookedSlotIds = useMemo(() => {
    const locked = new Set<string>();
    bookings.forEach((b) => {
      if (b.status !== "未成立") locked.add(b.slotId);
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
    return slots
      .filter((s) => s.date === draft.date)
      .sort((a, b) => a.label.localeCompare(b.label, "zh-TW"));
  }, [slots, draft.date]);

  const bagModal = bagOpenId ? bagById.get(bagOpenId) : null;

  const myBookings = useMemo(() => {
    if (!currentMember) return [];
    return bookings.filter((b) => b.email === currentMember).sort((a, b) => b.createdAt - a.createdAt);
  }, [bookings, currentMember]);

  function calcAddOnTotal(ids: string[]) {
    return ids.map((id) => addOnById.get(id)?.price ?? 0).reduce((a, b) => a + b, 0);
  }

  function calcTotal(b: Booking) {
    const bag = bagById.get(b.bagId);
    return (bag?.price ?? 0) + calcAddOnTotal(b.addOnIds);
  }

  /* ===================== Auth ===================== */
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

  /* ===================== Booking Flow ===================== */
  function validateDraft(): string | null {
    if (!draft.name.trim()) return "請填寫姓名";
    if (!draft.phone.trim()) return "請填寫手機";
    if (!draft.email.trim()) return "請填寫信箱";
    if (!draft.experience) return "請選擇是否有鉤針經驗";
    if (!draft.bagId) return "請選擇包款";
    if (!draft.colorCode.trim()) return "請填寫色號";
    if (!draft.date || !draft.slotId) return "請選擇日期與時段";

    const slot = slotById.get(draft.slotId);
    if (!slot || !slot.isOpen) return "此時段目前不可預約";
    if (bookedSlotIds.has(draft.slotId)) return "此時段已被預約，請選擇其他時段";

    return null;
  }

  function submitBookingDraft() {
    const err = validateDraft();
    if (err) return alert(err);

    const b: Booking = {
      id: uid("bk"),
      createdAt: Date.now(),
      status: "等待匯款",

      name: draft.name.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim().toLowerCase(),
      experience: draft.experience as "有" | "無",

      bagId: draft.bagId,
      colorCode: draft.colorCode.trim(),
      addOnIds: draft.addOnIds,

      slotId: draft.slotId,

      paymentLast5: undefined,

      colorConfirmedResult: "待確認",

      note: draft.note.trim(),
    };

    setBookings((prev) => [b, ...prev]);

    setDraft((d) => ({
      experience: "",
      bagId: "",
      colorCode: "",
      addOnIds: [],
      date: "",
      slotId: "",
      name: "",
      phone: "",
      email: currentMember ?? d.email,
      note: "",
    }));

    // Open checkout immediately
    setCheckoutBookingId(b.id);
    setCheckoutLast5("");
    setCheckoutOpen(true);
  }

  function submitPaymentLast5() {
    const last5 = checkoutLast5.trim();
    if (last5.length !== 5) return alert("匯款末 5 碼需為 5 位數");
    if (!checkoutBookingId) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === checkoutBookingId ? { ...b, paymentLast5: last5, status: "等待審核中" } : b
      )
    );

    setCheckoutOpen(false);
    setCheckoutBookingId(null);
    alert("已送出匯款資訊，狀態已變更為『等待審核中』。老師確認收款後才會顯示預約成功。");
    setActive("mine");
  }

  const activeSection = sections.find((s) => s.key === active);

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink, fontFamily: FONT_SANS }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : sidebarCollapsed ? "84px 1fr" : "320px 1fr",
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
              background: theme.blueTint,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                padding: "12px 12px 14px",
                border: `1px solid ${theme.blue}`,
                borderRadius: 16,
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 14,
                      border: `1px dashed ${theme.blue}`,
                      background: theme.blueTint,
                      display: "grid",
                      placeItems: "center",
                      color: theme.blueDeep,
                      fontSize: 11,
                    }}
                    title="Logo 占位（之後換成你的 logo 圖檔）"
                  >
                    Logo
                  </div>
                  {!sidebarCollapsed && (
                    <div>
                      <div style={{ fontFamily: FONT_SERIF, fontSize: 16, letterSpacing: "0.02em" }}>
                        Clouds Knitting
                      </div>
                      <div style={{ fontSize: 12, color: theme.muted }}>一針一引，療癒自己</div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSidebarCollapsed((v) => !v)}
                  style={{
                    borderRadius: 12,
                    padding: 8,
                    border: `1px solid ${theme.blue}`,
                    background: theme.blueSoft,
                    cursor: "pointer",
                  }}
                  aria-label="toggle sidebar"
                  title={sidebarCollapsed ? "展開側欄" : "收合側欄"}
                >
                  {sidebarCollapsed ? <Icon name="menu" color={theme.blueDeep} /> : <Icon name="close" color={theme.blueDeep} />}
                </button>
              </div>
            </div>

            <nav style={{ display: "grid", gap: 8 }}>
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
                      padding: sidebarCollapsed ? "12px" : "12px 12px",
                      borderRadius: 16,
                      border: `1px solid ${isActive ? theme.blueDeep : "transparent"}`,
                      background: isActive ? theme.blueSoft : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    title={s.label}
                  >
                    <Icon name={s.icon as any} color={isActive ? theme.blueDeep : theme.ink} />
                    {!sidebarCollapsed && <span style={{ fontSize: 14, color: theme.ink }}>{s.label}</span>}
                  </button>
                );
              })}
            </nav>

            <div style={{ flex: 1 }} />

            <div
              style={{
                display: "grid",
                gap: 8,
                padding: "12px 12px",
                borderRadius: 16,
                border: `1px solid ${theme.blue}`,
                background: "#fff",
              }}
            >
              {!sidebarCollapsed && <div style={{ fontSize: 12, color: theme.muted }}>快速聯絡</div>}
              <a
                href={LINE_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 10px",
                  borderRadius: 14,
                  border: `1px solid ${theme.line}`,
                  textDecoration: "none",
                  color: theme.ink,
                  background: theme.blueTint,
                }}
              >
                <Icon name="line" color={theme.blueDeep} />
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
                  padding: "10px 10px",
                  borderRadius: 14,
                  border: `1px solid ${theme.line}`,
                  textDecoration: "none",
                  color: theme.ink,
                  background: theme.blueTint,
                }}
              >
                <Icon name="ig" color={theme.blueDeep} />
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
                backdropFilter: "blur(10px)",
                borderBottom: `1px solid ${theme.softLine}`,
              }}
            >
              <div style={{ padding: "12px 14px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 18 }}>Clouds Knitting</div>
                    <div style={{ color: theme.muted, fontSize: 12 }}>一針一引，療癒自己</div>
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
                        border: `1px solid ${theme.blue}`,
                        background: theme.blueSoft,
                        textDecoration: "none",
                      }}
                      aria-label="LINE"
                    >
                      <Icon name="line" color={theme.blueDeep} />
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
                        border: `1px solid ${theme.blue}`,
                        background: theme.blueSoft,
                        textDecoration: "none",
                      }}
                      aria-label="Instagram"
                    >
                      <Icon name="ig" color={theme.blueDeep} />
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
              padding: isMobile ? "16px 14px 64px" : "26px 28px",
              maxWidth: 1040,
              margin: "0 auto",
              display: "grid",
              gap: 16,
            }}
          >
            {!isMobile && (
              <div style={{ padding: "6px 2px 0" }}>
                <H1>{activeSection?.label}</H1>
              </div>
            )}

            {/* 教學介紹 */}
            {active === "teach" && (
              <>
                <Card title="教學介紹" icon={<Icon name="teach" color={theme.blueDeep} />}>
                  <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.95 }}>
                    <li>
                      本課程以實際完成包款為目標，不只學會照著織圖鉤織，也會教你理解結構、調整尺寸，
                      讓所學技巧能應用在其他包款上。
                    </li>
                    <li>上課會依學員的鉤針經驗與學習狀況，調整教學進度與內容，確保能跟得上、不挫折。</li>
                    <li>課程以一對一教學為主，亦可一對二上課（適合朋友同行或家人一起學習）。</li>
                    <li>教學風格重視理解與實作，不是趕進度，而是把你教到會、教到能自己延伸應用。</li>
                    <li>完全沒有鉤針經驗的學員也可以報名，初學者會從適合的包款與進度開始教學。</li>
                  </ul>
                </Card>
              </>
            )}

            {/* 包款課程 */}
            {active === "price" && (
              <Card
                title="包款課程"
                icon={<Icon name="price" color={theme.blueDeep} />}
                footer={<div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.7 }}>點擊包款可查看詳細介紹（針法/技巧/應用範圍）與照片位置。</div>}
              >
                <div style={{ display: "grid", gap: 14 }}>
                  <div
                    style={{
                      border: `1px solid ${theme.blue}`,
                      background: theme.blueTint,
                      borderRadius: 16,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontFamily: FONT_SERIF, color: theme.ink, marginBottom: 6 }}>不確定該選哪一款？</div>
                    <div style={{ color: theme.muted, fontSize: 13, lineHeight: 1.7 }}>
                      你可以先參考各包款說明，或先透過 LINE 與我們討論後再預約。
                    </div>
                  </div>

                  <GroupTitle label="初階包款" meta={`${money(2460)}（線上便宜 $100）`} />
                  <BagGrid bags={bags.filter((b) => b.level === "初階")} onOpen={(id) => setBagOpenId(id)} />

                  <GroupTitle label="進階包款" meta={`${money(2460)}（適合有鉤針基礎）`} />
                  <BagGrid bags={bags.filter((b) => b.level === "進階")} onOpen={(id) => setBagOpenId(id)} />

                  <GroupTitle label="牛角包" meta={`${money(2860)}（需有鉤針經驗）`} />
                  <BagGrid bags={bags.filter((b) => b.level === "牛角")} onOpen={(id) => setBagOpenId(id)} />
                </div>
              </Card>
            )}

            {/* 我要預約 */}
            {active === "booking" && (
              <Card title="我要預約" icon={<Icon name="book" color={theme.blueDeep} />}>
                <div style={{ display: "grid", gap: 14 }}>
                  <div
                    style={{
                      border: `1px solid ${theme.blue}`,
                      background: theme.blueSoft,
                      borderRadius: 16,
                      padding: 12,
                      display: "grid",
                      gap: 6,
                    }}
                  >
                    <div style={{ fontFamily: FONT_SERIF, color: theme.ink }}>第一次預約課程？請先看這裡</div>
                    <ol style={{ margin: 0, paddingLeft: 18, color: theme.muted, lineHeight: 1.75, fontSize: 13 }}>
                      <li>選擇想學的包款與時段，送出預約申請。</li>
                      <li>送出後會顯示匯款資訊；完成匯款並確認後才算預約成功。</li>
                      <li>若不確定包款或顏色，可先透過 LINE 討論後再預約，完全沒問題。</li>
                    </ol>
                  </div>

                  <Subtle>小提醒：送出預約後會先進入「準備結帳」顯示匯款資訊；完成匯款並經確認後才算成立。</Subtle>

                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                    <Input label="姓名" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} required />
                    <Input label="手機" value={draft.phone} onChange={(v) => setDraft((d) => ({ ...d, phone: v }))} required />
                    <Input
                      label="信箱"
                      value={draft.email}
                      onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
                      required
                      placeholder="example@email.com"
                      type="email"
                    />
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
                        選擇包款 <span style={{ color: theme.blueDeep }}>*</span>
                      </span>
                      <select
                        value={draft.bagId}
                        onChange={(e) => setDraft((d) => ({ ...d, bagId: e.target.value }))}
                        style={{
                          borderRadius: 12,
                          border: `1px solid ${theme.line}`,
                          padding: "10px 12px",
                          fontSize: 14,
                          background: "#fff",
                          color: theme.ink,
                        }}
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
                      label="色號（可先與老師確認）"
                      value={draft.colorCode}
                      onChange={(v) => setDraft((d) => ({ ...d, colorCode: v }))}
                      required
                      placeholder="例如：奶茶色 / 123"
                    />
                  </div>

                  <CheckboxGroup label="加購項目" value={draft.addOnIds} onChange={(next) => setDraft((d) => ({ ...d, addOnIds: next }))} options={addOns} />

                  <div
                    style={{
                      border: `1px solid ${theme.softLine}`,
                      borderRadius: 16,
                      padding: 14,
                      background: "#fff",
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon name="calendar" color={theme.blueDeep} />
                      <div style={{ fontWeight: 700 }}>選擇日期與時段</div>
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

                  <TextArea
                    label="備註（可填想要的顏色方向／加購需求／其他）"
                    value={draft.note}
                    onChange={(v) => setDraft((d) => ({ ...d, note: v }))}
                  />

                  <PrimaryButton onClick={submitBookingDraft}>送出預約申請</PrimaryButton>

                  <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.7 }}>
                    送出後會先進入「準備結帳」顯示匯款資訊。完成匯款並經確認後，才會顯示預約成功。
                  </div>
                </div>
              </Card>
            )}

            {/* 預約須知 */}
            {active === "notice" && (
              <Card title="預約須知" icon={<Icon name="notice" color={theme.blueDeep} />}>
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={{ border: `1px solid ${theme.blue}`, background: theme.blueTint, borderRadius: 16, padding: 12 }}>
                    <div style={{ fontFamily: FONT_SERIF, color: theme.ink, marginBottom: 6 }}>第一次預約課程？請先看這裡</div>
                    <ol style={{ margin: 0, paddingLeft: 18, color: theme.muted, lineHeight: 1.75, fontSize: 13 }}>
                      <li>先選擇包款與時段，送出預約申請。</li>
                      <li>送出後才會顯示匯款資訊；完成匯款並經確認後才算成立。</li>
                      <li>狀態顯示為「等待審核中」時，表示我們正在核對款項。</li>
                    </ol>
                  </div>

                  <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.95 }}>
                    <li>完成匯款後，我們確認收款後預約才正式成立。</li>
                    <li>課程約 3 小時教完整顆包包的織法，「重複部分」需回家自行完成。</li>
                    <li>材料包裡的線材是足夠的，但因每個人的手勁不同會影響用線量。</li>
                    <li>完成報名後不得取消及退費，只能轉讓他人課程、更改時段，或換此包款成品。</li>
                    <li>若不確定包款或顏色，可先透過 LINE 討論後再預約，完全沒問題。</li>
                  </ul>
                </div>
              </Card>
            )}

            {/* 我的預約 */}
            {active === "mine" && (
              <Card title="我的預約" icon={<Icon name="mine" color={theme.blueDeep} />}>
                <div style={{ display: "grid", gap: 14 }}>
                  {!currentMember ? (
                    <>
                      <Subtle>此頁僅供查詢已送出預約的課程資料（示範用登入）。</Subtle>
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
                        提示：此原型會把資料存在你的瀏覽器中（localStorage）。不同電腦/瀏覽器不會同步。
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 800 }}>{currentMember}</div>
                          <div style={{ fontSize: 12, color: theme.muted }}>可查看自己的預約明細與狀態</div>
                        </div>
                        <SecondaryButton onClick={logout}>登出</SecondaryButton>
                      </div>

                      <div style={{ display: "grid", gap: 10 }}>
                        {myBookings.length === 0 ? (
                          <div
                            style={{
                              padding: 14,
                              borderRadius: 16,
                              border: `1px dashed ${theme.blue}`,
                              background: theme.blueTint,
                              color: theme.blueDeep,
                            }}
                          >
                            目前沒有預約紀錄。你可以到「我要預約」送出預約申請。
                          </div>
                        ) : (
                          myBookings.map((b) => {
                            const bag = bagById.get(b.bagId);
                            const slot = slotById.get(b.slotId);

                            const statusStyle: Record<
                              BookingStatus,
                              { bg: string; fg: string; bd: string }
                            > = {
                              等待匯款: { bg: theme.blueTint, fg: theme.blueDeep, bd: theme.blue },
                              等待審核中: { bg: theme.blueSoft, fg: theme.blueDeep, bd: theme.blueDeep },
                              預約成功: { bg: theme.blueDeep, fg: "#fff", bd: theme.blueDeep },
                              未成立: { bg: "#F2F2F2", fg: "#777", bd: "#DDD" },
                            };

                            const st = statusStyle[b.status];

                            const addOnNames =
                              b.addOnIds.length === 0
                                ? "無"
                                : b.addOnIds
                                    .map((id) => addOnById.get(id)?.name)
                                    .filter(Boolean)
                                    .join("、");

                            const total = calcTotal(b);

                            return (
                              <div
                                key={b.id}
                                style={{
                                  border: `1px solid ${theme.softLine}`,
                                  borderRadius: 18,
                                  background: "#fff",
                                  padding: 14,
                                  display: "grid",
                                  gap: 12,
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Icon name="bag" color={theme.blueDeep} />
                                    <div style={{ fontFamily: FONT_SERIF, fontSize: 16 }}>
                                      {bag?.name ?? "（未知包款）"}
                                    </div>
                                  </div>
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      padding: "6px 10px",
                                      borderRadius: 999,
                                      border: `1px solid ${st.bd}`,
                                      background: st.bg,
                                      color: st.fg,
                                      fontSize: 12,
                                    }}
                                  >
                                    {b.status}
                                  </span>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, fontSize: 13 }}>
                                  <Field label="上課時段" value={slot ? `${slot.date}｜${slot.label}` : "（未知時段）"} />
                                  <Field label="課程時數" value={`${bag?.hours ?? 3} 小時`} />
                                  <Field label="課程價格" value={money(bag?.price ?? 0)} />
                                  <Field label="上課地點" value={COURSE_LOCATION} />
                                  <Field label="鉤針經驗" value={b.experience} />
                                  <Field label="你填寫的色號" value={b.colorCode} />
                                  <Field label="顏色確認結果" value={b.colorConfirmedResult || "待確認"} />
                                  <Field label="加購明細" value={addOnNames} />
                                  <Field label="加購金額" value={money(calcAddOnTotal(b.addOnIds))} />
                                  <Field label="總金額" value={money(total)} />
                                </div>

                                {b.status === "等待匯款" && (
                                  <div style={{ border: `1px solid ${theme.blue}`, background: theme.blueTint, borderRadius: 16, padding: 12, display: "grid", gap: 8 }}>
                                    <div style={{ fontFamily: FONT_SERIF, color: theme.ink }}>尚未完成匯款</div>
                                    <div style={{ color: theme.muted, fontSize: 13, lineHeight: 1.7 }}>
                                      你可以點下方按鈕查看匯款資訊並填寫匯款末 5 碼。
                                    </div>
                                    <SecondaryButton
                                      onClick={() => {
                                        setCheckoutBookingId(b.id);
                                        setCheckoutLast5(b.paymentLast5 ?? "");
                                        setCheckoutOpen(true);
                                      }}
                                    >
                                      前往準備結帳
                                    </SecondaryButton>
                                  </div>
                                )}

                                {b.paymentLast5 && (
                                  <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.7 }}>
                                    你填寫的匯款末 5 碼：<strong style={{ color: theme.ink }}>{b.paymentLast5}</strong>
                                  </div>
                                )}

                                {b.note && (
                                  <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.7 }}>
                                    備註：{b.note}
                                  </div>
                                )}

                                <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.7 }}>
                                  提醒：匯款完成並收到<strong style={{ color: theme.ink }}>預約成功通知</strong>才算成功。
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}

            {/* 聯絡我們 */}
            {active === "contact" && (
              <Card title="聯絡我們" icon={<Icon name="contact" color={theme.blueDeep} />}>
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={{ border: `1px solid ${theme.blue}`, borderRadius: 18, padding: 14, background: theme.blueTint, display: "grid", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon name="line" color={theme.blueDeep} />
                      <div style={{ fontFamily: FONT_SERIF, fontSize: 16 }}>LINE 官方帳號</div>
                    </div>
                    <div style={{ color: theme.muted, fontSize: 13, lineHeight: 1.7 }}>
                      若不確定包款或顏色，歡迎先透過 LINE 討論後再預約。
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
                        border: `1px solid ${theme.blue}`,
                        background: theme.blueSoft,
                        color: theme.ink,
                        textDecoration: "none",
                        width: "fit-content",
                      }}
                    >
                      <Icon name="link" color={theme.blueDeep} />
                      <span>前往 LINE</span>
                    </a>
                  </div>

                  <div style={{ border: `1px solid ${theme.blue}`, borderRadius: 18, padding: 14, background: theme.blueTint, display: "grid", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon name="ig" color={theme.blueDeep} />
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
                        border: `1px solid ${theme.blue}`,
                        background: theme.blueSoft,
                        color: theme.ink,
                        textDecoration: "none",
                        width: "fit-content",
                      }}
                    >
                      <Icon name="link" color={theme.blueDeep} />
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
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr", gap: 12 }}>
              <div style={{ border: `1px solid ${theme.blue}`, borderRadius: 16, padding: 14, background: theme.blueTint }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 18, marginBottom: 6 }}>{bagModal.name}</div>
                <div style={{ color: theme.muted, fontSize: 13, lineHeight: 1.8 }}>{bagModal.summary}</div>
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, border: `1px solid ${theme.blue}`, borderRadius: 999, padding: "6px 10px", background: theme.blueSoft, color: theme.blueDeep }}>
                    {money(bagModal.price)}
                  </span>
                  <span style={{ fontSize: 12, border: `1px solid ${theme.blue}`, borderRadius: 999, padding: "6px 10px", background: theme.blueSoft, color: theme.blueDeep }}>
                    {bagModal.level}｜難度 {bagModal.difficulty}
                  </span>
                  <span style={{ fontSize: 12, border: `1px solid ${theme.blue}`, borderRadius: 999, padding: "6px 10px", background: theme.blueSoft, color: theme.blueDeep }}>
                    課程 {bagModal.hours} 小時
                  </span>
                </div>
              </div>

              <div style={{ border: `1px dashed ${theme.blue}`, borderRadius: 16, padding: 14, background: "#fff", minHeight: 170, display: "grid", placeItems: "center", color: theme.blueDeep }}>
                <div style={{ textAlign: "center", lineHeight: 1.6 }}>
                  <div style={{ fontFamily: FONT_SERIF, color: theme.ink }}>包款照片位置</div>
                  <div style={{ fontSize: 12, color: theme.muted }}>之後可替換成你的包款圖片</div>
                </div>
              </div>
            </div>

            <div style={{ border: `1px solid ${theme.softLine}`, borderRadius: 16, padding: 14, background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Icon name="bag" color={theme.blueDeep} />
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
                <Icon name="link" color={theme.blueDeep} />
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

      {/* Checkout modal (payment info shown ONLY here) */}
      <Modal
        open={checkoutOpen}
        title="準備結帳"
        onClose={() => {
          setCheckoutOpen(false);
          setCheckoutBookingId(null);
        }}
      >
        {(() => {
          const bk = bookings.find((b) => b.id === checkoutBookingId);
          if (!bk) return <Subtle>找不到此筆預約資料。</Subtle>;

          const bag = bagById.get(bk.bagId);
          const slot = slotById.get(bk.slotId);
          const addOnTotal = calcAddOnTotal(bk.addOnIds);
          const total = calcTotal(bk);

          return (
            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ border: `1px solid ${theme.blue}`, background: theme.blueTint, borderRadius: 16, padding: 12 }}>
                <div style={{ fontFamily: FONT_SERIF, color: theme.ink, marginBottom: 6 }}>課程摘要</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, fontSize: 13 }}>
                  <Field label="包款" value={bag?.name ?? ""} />
                  <Field label="課程時數" value={`${bag?.hours ?? 3} 小時`} />
                  <Field label="上課時段" value={slot ? `${slot.date}｜${slot.label}` : ""} />
                  <Field label="課程價格" value={money(bag?.price ?? 0)} />
                  <Field label="加購金額" value={money(addOnTotal)} />
                  <Field label="總金額" value={money(total)} />
                </div>
              </div>

              <div style={{ border: `1px solid ${theme.blueDeep}`, background: theme.blueSoft, borderRadius: 16, padding: 12, display: "grid", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name="check" color={theme.blueDeep} />
                  <div style={{ fontFamily: FONT_SERIF, color: theme.ink }}>匯款資訊</div>
                </div>
                <div style={{ fontSize: 13, color: theme.ink, fontWeight: 800 }}>銀行代碼：{BANK_CODE}</div>
                <div style={{ fontSize: 13, color: theme.ink, fontWeight: 800 }}>匯款帳號：{BANK_ACCOUNT}</div>
                <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.7 }}>
                  提醒：匯款完成並收到<strong style={{ color: theme.ink }}>預約成功通知</strong>才算成功。
                </div>
              </div>

              <Input
                label="匯款末 5 碼"
                value={checkoutLast5}
                onChange={(v) => setCheckoutLast5(v.replace(/\D/g, "").slice(0, 5))}
                required
                placeholder="請輸入 5 位數"
              />

              <PrimaryButton onClick={submitPaymentLast5}>送出匯款資訊（進入等待審核中）</PrimaryButton>

              <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.7 }}>
                送出後狀態會變更為「等待審核中」。老師確認收款後才會顯示「預約成功」。
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
