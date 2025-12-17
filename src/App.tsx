import { useState } from "react";

const tabs = [
  "品牌介紹",
  "價目表",
  "預約須知",
  "常見問題",
  "我要預約",
  "聯絡方式",
];

export default function App() {
  const [activeTab, setActiveTab] = useState("品牌介紹");

  return (
    <div style={{ background: "#f6f2eb", minHeight: "100vh", color: "#4b3621" }}>
      {/* Sticky Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "#f6f2eb",
          borderBottom: "1px solid #e5ddd1",
          zIndex: 10,
        }}
      >
        <nav
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "12px",
            padding: "12px 16px",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                whiteSpace: "nowrap",
                padding: "6px 14px",
                borderRadius: "999px",
                border:
                  activeTab === tab
                    ? "1px solid #d6cbbd"
                    : "1px solid transparent",
                background: activeTab === tab ? "#ffffff" : "transparent",
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main style={{ padding: "24px", maxWidth: "720px", margin: "0 auto" }}>
        <Card>
          {activeTab === "品牌介紹" && (
            <>
              <h1>一針一引，療癒自己</h1>
              <ul>
                <li>品牌理念：not perfect but only</li>
                <li>不只教完成，而是教你如何學以致用</li>
                <li>學會調整尺寸，延伸到其他包款</li>
                <li>教學負責，把你教到會</li>
              </ul>
            </>
          )}

          {activeTab === "價目表" && (
            <>
              <h1>課程價目</h1>
              <ul>
                <li>初階包款 NT$2460（難度 ★★）</li>
                <li>進階包款 NT$2460（需基礎）</li>
                <li>牛角包 NT$2860（特殊技巧）</li>
              </ul>
              <p style={{ fontSize: "12px", color: "#7a6a58" }}>
                每個包款皆可放置照片
              </p>
            </>
          )}

          {activeTab === "預約須知" && (
            <>
              <h1>預約須知</h1>
              <ul>
                <li>完成匯款並確認收款後，預約才成立</li>
                <li>課程 3 小時，重複段落需回家完成</li>
                <li>完成報名後不得取消或退費</li>
              </ul>
            </>
          )}

          {activeTab === "常見問題" && (
            <>
              <h1>常見問題</h1>
              <p>
                <strong>Q：完全沒有經驗可以嗎？</strong>
                <br />
                A：可以，初階包款為零基礎設計。
              </p>
              <p>
                <strong>Q：需要自備材料嗎？</strong>
                <br />
                A：不需要，課程已包含。
              </p>
            </>
          )}

          {activeTab === "我要預約" && (
            <>
              <h1>我要預約</h1>
              <ul>
                <li>先與老師確認包款與色號</li>
                <li>再進行線上預約與填寫資料</li>
                <li>需後台審核並確認收款才成功</li>
              </ul>
            </>
          )}

          {activeTab === "聯絡方式" && (
            <>
              <h1>聯絡方式</h1>
              <p>LINE 官方帳號</p>
              <p>Instagram：clouds_knitting</p>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </div>
  );
}
