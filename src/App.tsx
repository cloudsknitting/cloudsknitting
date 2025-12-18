import React, { useMemo, useState } from "react";

const LINE_URL = "https://lin.ee/WItaEyI";
const IG_URL =
  "https://www.instagram.com/clouds_knitting?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

function Card(props: React.PropsWithChildren<{ title?: string }>) {
  return (
    <section
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 18,
        boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
        padding: 18,
      }}
    >
      {props.title ? (
        <h2
          style={{
            fontFamily:
              '"Noto Serif TC","Source Han Serif TC","Songti TC",serif',
            fontSize: 18,
            margin: "0 0 10px 0",
            color: "#4b3621",
          }}
        >
          {props.title}
        </h2>
      ) : null}
      {props.children}
    </section>
  );
}

function PrimaryButton(
  props: React.PropsWithChildren<{ onClick?: () => void }>
) {
  return (
    <button
      onClick={props.onClick}
      style={{
        border: "1px solid #5D7487",
        background: "#5D7487",
        color: "#fff",
        borderRadius: 14,
        padding: "10px 14px",
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {props.children}
    </button>
  );
}

function OutlineButton(
  props: React.PropsWithChildren<{ onClick?: () => void }>
) {
  return (
    <button
      onClick={props.onClick}
      style={{
        border: "1px solid #C7D2DA",
        background: "#fff",
        color: "#4b3621",
        borderRadius: 14,
        padding: "10px 14px",
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {props.children}
    </button>
  );
}

export default function CrochetApp() {
  const tabs = useMemo(
    () => ["教學介紹", "課程價目表", "預約須知", "常見問題", "我的預約", "聯絡方式"],
    []
  );
  const [activeTab, setActiveTab] = useState("教學介紹");

  const serif =
    '"Noto Serif TC","Source Han Serif TC","Songti TC",serif';
  const sans =
    '"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif';

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", color: "#4b3621", fontFamily: sans }}>
      {/* Sticky Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #E2E8F0",
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
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  whiteSpace: "nowrap",
                  fontSize: 14,
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: active ? "1px solid #5D7487" : "1px solid transparent",
                  background: active ? "#E7EEF3" : "#FFFFFF",
                  boxShadow: active ? "0 6px 14px rgba(0,0,0,0.06)" : "none",
                  cursor: "pointer",
                }}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </header>

      <main style={{ padding: 16, maxWidth: 900, margin: "0 auto", display: "grid", gap: 14 }}>
        {activeTab === "教學介紹" && (
          <Card>
            <h1 style={{ fontFamily: serif, fontSize: 26, margin: 0 }}>教學介紹</h1>
            <p style={{ margin: "6px 0 14px 0", color: "#7a6a58", fontSize: 14 }}>
              一針一引，療癒自己
            </p>

            <h3 style={{ fontFamily: serif, fontSize: 18, margin: "14px 0 8px 0" }}>
              上課方式／你會學到
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
              <li>教你如何看織圖、辨識針目、了解鉤織原理</li>
              <li>不只完成一個尺寸：會帶你學會調整比例，設計出各種尺寸</li>
              <li>同一套邏輯可延伸到其他款式，真正學以致用</li>
              <li>課程以一對一教學為主，也可一對二（會依學員程度調整教學進度）</li>
            </ul>

            <h3 style={{ fontFamily: serif, fontSize: 18, margin: "16px 0 8px 0" }}>
              課後支援
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
              <li>回家忘了也不用擔心：提供課後複習影片（不限次數觀看）</li>
              <li>練習遇到問題，可透過官方 LINE 詢問</li>
              <li>教學重視理解與實作，把你教到會，而不是只把作品做完</li>
            </ul>

            <div
              style={{
                marginTop: 14,
                borderRadius: 16,
                border: "1px solid #C7D2DA",
                background: "#F3F7FA",
                padding: 12,
                fontSize: 14,
                lineHeight: 1.9,
              }}
            >
              <b>第一次預約課程？</b>
              你可以先看「預約須知」。若不確定包款或顏色，也可以先透過 LINE 討論後再預約，完全沒問題。
            </div>
          </Card>
        )}

        {activeTab === "課程價目表" && (
          <Card title="課程價目表">
            <h3 style={{ fontFamily: serif, fontSize: 18, margin: "8px 0" }}>
              初階包款 NT$2460（線上便宜 $100）
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
              <li>水桶包（難度★★）：圓形包底、多種基礎針法，可延伸應用於收納籃、飲料提袋、杯墊</li>
              <li>網格包（難度★★）：橢圓包底、實用度高，可應用於收納籃、髮夾</li>
              <li>韓系抽繩包（難度★★）：單一針法反覆練習，適合初學者從小尺寸開始</li>
              <li>手提包（難度★★）：扎實紋路，學習手把縫合</li>
              <li>方包（難度★★★）：特殊包底，不易變形，學習肩帶與五金縫合</li>
            </ul>

            <h3 style={{ fontFamily: serif, fontSize: 18, margin: "16px 0 8px 0" }}>
              進階包款 NT$2460
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
              <li>撞色托特包：換色鉤織技巧、三角手把製作</li>
              <li>菜籃子：精美紋路、跳色鉤織、隱形縫合</li>
              <li>毛茸茸手提包：冬季限定，盲鉤技巧</li>
            </ul>

            <h3 style={{ fontFamily: serif, fontSize: 18, margin: "16px 0 8px 0" }}>
              牛角包 NT$2860（需有鉤針經驗）
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
              <li>特殊加針邏輯，鉤出完美弧度包型</li>
              <li>手把鉤針原理可自行變換</li>
              <li>放了物品整顆包更美</li>
            </ul>

            <p style={{ marginTop: 12, fontSize: 12, color: "#7a6a58" }}>
              ＊每個項目皆預留包款照片區（之後可加入圖片）。
            </p>
          </Card>
        )}

        {activeTab === "預約須知" && (
          <Card title="預約須知">
            <div
              style={{
                borderRadius: 16,
                border: "1px solid #C7D2DA",
                background: "#F3F7FA",
                padding: 12,
                fontSize: 14,
                lineHeight: 1.9,
                marginBottom: 12,
              }}
            >
              <b>第一次預約課程？請先看這裡：</b>
              若不確定包款或顏色，可先透過 LINE 討論後再預約，完全沒問題。
            </div>

            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
              <li>完成匯款後填寫預約表單，我們確認收款後預約才正式成立。</li>
              <li>課程約 3 小時教完整顆包包的織法，「重複部分」需回家自行完成。</li>
              <li>材料包裡的線材是足夠的，但因每個人的手勁不同會影響用線量。</li>
              <li>完成報名後不得取消及退費，只能轉讓他人課程、更改時段，或換此包款成品。</li>
            </ul>
          </Card>
        )}

        {activeTab === "常見問題" && (
          <Card title="常見問題">
            <div style={{ display: "grid", gap: 10, fontSize: 14, lineHeight: 1.9 }}>
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
          <Card title="我的預約">
            <p style={{ marginTop: 0, fontSize: 14, lineHeight: 1.9 }}>
              這裡會顯示你已送出的預約明細與狀態（例如：等待審核中／預約成功）。
            </p>
            <div
              style={{
                borderRadius: 16,
                border: "1px solid #C7D2DA",
                background: "#F3F7FA",
                padding: 12,
                fontSize: 14,
                lineHeight: 1.9,
                margin: "10px 0 12px 0",
              }}
            >
              目前先完成「課程內容版面」更新；下一階段我們再把預約表單、時段按鈕、匯款末 5 碼、以及狀態查詢完整接上。
            </div>
            <PrimaryButton onClick={() => window.open(LINE_URL, "_blank")}>
              先用 LINE 詢問／確認顏色
            </PrimaryButton>
          </Card>
        )}

        {activeTab === "聯絡方式" && (
          <Card title="聯絡方式">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <OutlineButton onClick={() => window.open(LINE_URL, "_blank")}>
                LINE 官方
              </OutlineButton>
              <OutlineButton onClick={() => window.open(IG_URL, "_blank")}>
                Instagram
              </OutlineButton>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
