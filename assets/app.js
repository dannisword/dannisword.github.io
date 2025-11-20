const routes = {
  intro: {
    title: "系統簡介",
    desc: "說明系統目的、範圍與主要使用情境。",
    file: "docs/intro.md",
  },
  architecture: {
    title: "系統架構",
    desc: "系統組成、服務邏輯與技術棧說明。",
    file: "docs/architecture.md",
  },
  api: {
    title: "API & 模組設計",
    desc: "API 風格、命名規則與主要模組。",
    file: "docs/api.md",
  },
  deployment: {
    title: "部署與環境",
    desc: "各環境設定、部署流程與注意事項。",
    file: "docs/deployment.md",
  },
  operations: {
    title: "維運與監控",
    desc: "Log、Health Check、告警與日常維運流程。",
    file: "docs/operations.md",
  },
};

const docContentEl = document.getElementById("doc-content");
const pageTitleEl = document.getElementById("page-title");
const pageDescEl = document.getElementById("page-desc");
const yearEl = document.getElementById("year");
const menuItems = document.querySelectorAll(".menu-item");

yearEl.textContent = new Date().getFullYear();

function getCurrentKey() {
  const hash = window.location.hash.replace("#", "");
  if (!hash) return "intro";
  return routes[hash] ? hash : "intro";
}

async function loadDoc(key) {
  const route = routes[key] || routes["intro"];

  // 更新標題/描述
  pageTitleEl.textContent = route.title;
  pageDescEl.textContent = route.desc;

  // 更新選單 active
  menuItems.forEach((item) => {
    const docKey = item.getAttribute("data-doc");
    if (docKey === key) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // 載入 Markdown 內容
  try {
    const res = await fetch(route.file);
    if (!res.ok) {
      throw new Error("File not found");
    }
    const md = await res.text();
    const html = marked.parse(md);
    docContentEl.innerHTML = html;
  } catch (err) {
    docContentEl.innerHTML = `
      <p>無法載入文件：<code>${route.file}</code></p>
      <p>請確認檔案是否存在於 <code>/docs</code> 資料夾。</p>
    `;
  }
}

// 初始載入
window.addEventListener("load", () => {
  const key = getCurrentKey();
  loadDoc(key);
});

// 監聽 hash 變化（點選選單 or 手動切網址）
window.addEventListener("hashchange", () => {
  const key = getCurrentKey();
  loadDoc(key);
});
