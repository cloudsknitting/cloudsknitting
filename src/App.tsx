// Single-page Crochet Course Web App (Course-focused)
// Style: White-first, calming, dark coffee text + mist blue accents
// No emoji. Icons (if any) must be SVG line style only.

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LINE_URL = "https://lin.ee/WItaEyI";
const IG_URL =
  "https://www.instagram.com/clouds_knitting?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

export default function CrochetApp() {
  const tabs = useMemo(
    () => ["教學介紹", "課程價目表", "預約須知", "常見問題", "我的預約", "聯絡方式"],
    []
  );
  const [activeTab, setActiveTab] = useState("教學介紹");

  return (
    <div className="min-h-screen bg-white text-[#4b3621] font-sans">
      {/* Sticky Header (Mobile: scrollable tabs, NO hamburger) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#E2E8F0]">
        <nav className="flex overflow-x-auto no-scrollbar px-4 py-3 gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={
                "whitespace-nowrap text-sm px-3 py-1.5 rounded-full border transition " +
                (activeTab === tab
                  ? "bg-[#E7EEF3] border-[#5D7487] shadow-sm"
                  : "bg-white border-transparent hover:border-[#C7D2DA]")
              }
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <main className="p-4 space-y-6 max-w-3xl mx-auto">
        {/* 教學介紹 */}
        {activeTab === "教學介紹" && (
          <Card className="rounded-2xl shadow-sm border border-[#E2E8F0]">
            <CardContent className="space-y-5">
              <div className="space-y-1">
                <h1 className="font-serif text-2xl">教學介紹</h1>
                <p className="text-sm text-[#7a6a58]">一針一引，療癒自己</p>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-lg">上課方式／你會學到</h2>
                <ul className="list-disc pl-5 space-y-2 text-sm leading-7">
                  <li>教你如何看織圖、辨識針目、了解鉤織原理</li>
                  <li>不只完成一個尺寸：會帶你學會調整比例，設計出各種尺寸</li>
                  <li>同一套邏輯可延伸到其他款式，真正學以致用</li>
                  <li>課程以一對一教學為主，也可一對二（會依學員程度調整教學進度）</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-lg">課後支援</h2>
                <ul className="list-disc pl-5 space-y-2 text-sm leading-7">
                  <li>回家忘了也不用擔心：提供課後複習影片（不限次數觀看）</li>
                  <li>練習遇到問題，可透過官方 LINE 詢問</li>
                  <li>教學重視理解與實作，把你教到會，而不是只把作品做完</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[#C7D2DA] bg-[#F3F7FA] p-4">
                <p className="text-sm leading-7">
                  <span className="font-semibold">第一次預約課程？</span>
                  你可以先看「預約須知」。若不確定包款或顏色，也可以先透過 LINE 討論後再預約，完全沒問題。
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 課程價目表 */}
        {activeTab === "課程價目表" && (
          <Card className="rounded-2xl shadow-sm border border-[#E2E8F0]">
            <CardContent className="space-y-6">
              <h2 className="font-serif text-xl">初階包款 NT$2460（線上便宜 $100）</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm leading-7">
                <li>水桶包（難度★★）：圓形包底、多種基礎針法，可延伸應用於收納籃、飲料提袋、杯墊</li>
                <li>網格包（難度★★）：橢圓包底、實用度高，可應用於收納籃、髮夾</li>
                <li>韓系抽繩包（難度★★）：單一針法反覆練習，適合初學者從小尺寸開始</li>
                <li>手提包（難度★★）：扎實紋路，學習手把縫合</li>
                <li>方包（難度★★★）：特殊包底，不易變形，學習肩帶與五金縫合</li>
              </ul>

              <h2 className="font-serif text-xl">進階包款 NT$2460</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm leading-7">
                <li>撞色托特包：換色鉤織技巧、三角手把製作</li>
                <li>菜籃子：精美紋路、跳色鉤織、隱形縫合</li>
                <li>毛茸茸手提包：冬季限定，盲鉤技巧</li>
              </ul>

              <h2 className="font-serif text-xl">牛角包 NT$2860（需有鉤針經驗）</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm leading-7">
                <li>特殊加針邏輯，鉤出完美弧度包型</li>
                <li>手把鉤針原理可自行變換</li>
                <li>放了物品整顆包更美</li>
              </ul>

              <p className="text-xs text-[#7a6a58]">＊每個項目皆預留包款照片區（之後可加入圖片）。</p>
            </CardContent>
          </Card>
        )}

        {/* 預約須知 */}
        {activeTab === "預約須知" && (
          <Card className="rounded-2xl shadow-sm border border-[#E2E8F0]">
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-[#C7D2DA] bg-[#F3F7FA] p-4">
                <p className="text-sm leading-7">
                  <span className="font-semibold">第一次預約課程？請先看這裡：</span>
                  若不確定包款或顏色，可先透過 LINE 討論後再預約，完全沒問題。
                </p>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm leading-7">
                <li>完成匯款後填寫預約表單，我們確認收款後預約才正式成立。</li>
                <li>課程約 3 小時教完整顆包包的織法，「重複部分」需回家自行完成。</li>
                <li>材料包裡的線材是足夠的，但因每個人的手勁不同會影響用線量。</li>
                <li>完成報名後不得取消及退費，只能轉讓他人課程、更改時段，或換此包款成品。</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* 常見問題 */}
        {activeTab === "常見問題" && (
          <Card className="rounded-2xl shadow-sm border border-[#E2E8F0]">
            <CardContent className="space-y-4 text-sm leading-7">
              <div>
                <strong>Q：完全沒有經驗也可以參加嗎？</strong>
                <p>A：當然可以。初學者包款課程專為零基礎學員設計。</p>
              </div>
              <div>
                <strong>Q：需要自備工具或材料嗎？</strong>
                <p>A：完全不需要。課程費用已包含所有材料與工具使用。</p>
              </div>
              <div>
                <strong>Q：預約後可以取消嗎？</strong>
                <p>A：完成報名後不得取消及退費，只能轉讓他人課程、更改時段，或換此包款成品。</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 我的預約（目前先保留入口與提示；後續再接完整預約/會員系統） */}
        {activeTab === "我的預約" && (
          <Card className="rounded-2xl shadow-sm border border-[#E2E8F0]">
            <CardContent className="space-y-4 text-sm leading-7">
              <p>
                這裡會顯示你已送出的預約明細與狀態（例如：等待審核中／預約成功）。
              </p>
              <div className="rounded-2xl border border-[#C7D2DA] bg-[#F3F7FA] p-4">
                <p>
                  目前版本先完成「課程內容版面」更新；
                  下一階段我們再把預約表單、時段按鈕、匯款末 5 碼、以及狀態查詢完整接上。
                </p>
              </div>
              <Button
                className="rounded-xl bg-[#5D7487] hover:bg-[#4f6373]"
                onClick={() => window.open(LINE_URL, "_blank")}
              >
                先用 LINE 詢問／確認顏色
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 聯絡方式 */}
        {activeTab === "聯絡方式" && (
          <Card className="rounded-2xl shadow-sm border border-[#E2E8F0]">
            <CardContent className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-[#C7D2DA]"
                onClick={() => window.open(LINE_URL, "_blank")}
              >
                LINE 官方
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-[#C7D2DA]"
                onClick={() => window.open(IG_URL, "_blank")}
              >
                Instagram
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
