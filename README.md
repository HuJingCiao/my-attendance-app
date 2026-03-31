# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

進度規劃
階段一：基礎建設與前端介面 (Day 1 - Day 3)
這個階段的目標是把你在 AppSheet 做的「畫面」用程式碼刻出來。

Day 1：環境建置與版本控制 (The Foundation)

主題：安裝必備軟體，初始化專案架構，並建立第一個 Git Repository。

工具：VS Code (編輯器)、Node.js、Git、GitHub。

Git 實踐：git init 初始化專案，連接遠端 GitHub Repo，完成第一次 git commit。

Day 2：前端 UI 框架與靜態切版 (The UI)

主題：導入 Vant UI，建立手機版面佈局（Header、打卡大按鈕、溫馨提示區塊）。

工具：Vue 3、Vite、Vant UI 組件庫。

Git 實踐：建立 feature/ui-layout 分支進行開發。

Day 3：前端狀態管理與模擬邏輯 (Mock Data & State)

主題：用 Vue 的響應式語法 (ref, computed) 寫出「自動判斷上下班」的前端切換邏輯。暫時使用假資料（Mock Data）測試按鈕。

工具：Vue Composition API。

Git 實踐：完成切版與基礎邏輯後，發起 Pull Request (PR) 併入主分支。

階段二：後端 API 與資料庫設計 (Day 4 - Day 6)
這個階段我們要建構系統的「大腦」與「記憶」，取代 AppSheet 的自動化背景運作。

Day 4：後端伺服器建置與 API 設計 (RESTful API)

主題：架設 Node.js 伺服器，設計打卡所需的 API 路由（例如 POST /api/punch）。

工具：Express.js、Postman（API 測試工具）。

Git 實踐：建立 feature/backend-setup 分支。

Day 5：關聯式資料庫設計 (Database Schema)

主題：將 AppSheet 的兩張表（員工清單、打卡紀錄）正規化為 SQL Table，並建立資料庫連線。

工具：PostgreSQL（建議用 Supabase 或 Neon 提供免費雲端資料庫）、DBeaver 或 Prisma (ORM)。

Day 6：實作核心業務邏輯 (Core Logic)

主題：在後端寫出 SQL 查詢，真實判斷該員工「今天是否已打卡」，並將資料寫入資料庫。

工具：Node.js、SQL 語法。

Git 實踐：後端 API 測試通過後，git commit 並推上 GitHub。

階段三：前後端串接與進階功能 (Day 7 - Day 9)
這個階段會把前後端結合，並加入真正工程師才會處理的進階手機端功能。

Day 7：前後端 API 串接 (Integration)

主題：讓 Vue 前端的打卡按鈕真正發送 HTTP 請求到你的 Express 後端，並在畫面上顯示成功或失敗。

工具：Axios (HTTP 客戶端套件)。

Day 8：身分驗證與權限控管 (Authentication)

主題：實作登入系統（取代 USEREMAIL()），發放 JWT (JSON Web Token)，確保員工只能看到自己的資料。

工具：JWT (jsonwebtoken套件)、前端 Router Guard (路由守衛)。

Git 實踐：建立 feature/auth 分支專門處理登入邏輯。

Day 9：定位功能與 PWA 安裝 (Geolocation & PWA)

主題：呼叫手機瀏覽器的 GPS API 取得經緯度（取代 HERE()），並將網頁設定為 PWA，讓它可以在手機桌面上產生 App 圖示。

工具：HTML5 Geolocation API、Vite PWA Plugin。

階段四：部署與文件化 (Day 10)
這是讓面試官看到成果的最重要步驟。

Day 10：雲端部署與撰寫 README (Deployment)

主題：將前端部署到 Vercel/Netlify，後端部署到 Render。並在 GitHub 寫一份完整的 README 專案說明。

工具：Vercel、Render、Markdown。

Git 實踐：打上版本標籤 git tag v1.0.0，完成最終推送！