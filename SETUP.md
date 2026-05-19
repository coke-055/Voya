# SeatFlow 旅遊足跡 App

## 安裝步驟

### 1. 安裝 Node.js
前往 https://nodejs.org 下載 LTS 版本並安裝。

### 2. 安裝依賴套件
打開終端機，進入此資料夾：

```
cd C:\Users\spttw10536\Desktop\seatflow
npm install
```

### 3. 啟動開發伺服器

```
npm run dev
```

瀏覽器開啟 http://localhost:5173

### 4. 打包發佈

```
npm run build
```

---

## 功能說明

### 迷霧地圖
- 全球地圖使用深色暗夜風格
- 造訪過的城市地圖會「解鎖」顯示，以發光圓形穿透霧效
- 未造訪的地方保持霧效覆蓋
- 城市等級的解鎖（例如去過河內 → 河內解鎖，胡志明市仍覆霧）

### 新增行程
- 點擊側邊欄右上角「新增行程」
- 可上傳**內政部入出國日期證明書（PDF）**自動解析出入境日期
- 搜尋並選擇造訪城市（支援中英文搜尋）
- 已包含全球約 130 個熱門城市資料

### 倒數計時
- 未來行程會顯示倒數天數徽章（「X 天後」）
- 側邊欄頂部統計：造訪國家、城市、行程數

### 飛機動畫
- 點擊地圖左下角「生成動畫」
- 自動渲染 60 秒動畫：飛機從台灣依時間順序飛往各目的地
- 抵達時解鎖當地霧效
- 輸出 WebM 格式（可上傳 YouTube、Instagram）

---

## 技術架構

- React 18 + TypeScript
- Vite（開發/打包）
- Leaflet + react-leaflet（互動地圖）
- Canvas 2D API（霧效 + 動畫）
- PDF.js（PDF 解析）
- Zustand（狀態管理 + localStorage 持久化）
- Tailwind CSS（樣式）
