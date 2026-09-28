/* ============================================================
   观道 · 道德经研习 — 应用逻辑
   路由、渲染、搜索、主题切换
   ============================================================ */

/* ---------- 工具 ---------- */
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const PART_NAME = { dao: "道经", de: "德经" };
const CN_NUM = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
const cnNum = (n) => {
  if (n <= 10) return CN_NUM[n];
  if (n < 20) return "十" + CN_NUM[n % 10];
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const t = tens === 2 ? "二十" : CN_NUM[tens] + "十";
    return t + (ones ? CN_NUM[ones] : "");
  }
  return String(n);
};
const cnChapter = (n) => "第" + cnNum(n) + "章";

/* ---------- 主题 ---------- */
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  const btn = $("#theme-toggle");
  if (btn) btn.textContent = t === "dark" ? "🌙" : "☀️";
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(cur);
  try { localStorage.setItem("laozi-theme", cur); } catch (e) {}
}
(function initTheme() {
  let t = "dark";
  try { t = localStorage.getItem("laozi-theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"); } catch (e) {}
  applyTheme(t);
})();

/* ---------- 导航 ---------- */
function setActive(nav) {
  $$("#main-nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === nav));
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function nav(name) {
  location.hash = "#/" + name;
  return false;
}

/* ---------- 高亮 ---------- */
function highlight(text, kw) {
  if (!kw) return esc(text);
  const t = esc(text);
  const k = esc(kw.trim()).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!k) return t;
  return t.replace(new RegExp("(" + k + ")", "gi"), "<mark>$1</mark>");
}

/* ---------- 渲染：首页 ---------- */
const TAO_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tgo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d9b36a"/><stop offset="100%" stop-color="#c14b3a"/>
    </linearGradient>
    <clipPath id="tclip"><circle cx="100" cy="100" r="96"/></clipPath>
  </defs>
  <circle cx="100" cy="100" r="96" fill="none" stroke="url(#tgo)" stroke-width="3"/>
  <g clip-path="url(#tclip)">
    <path d="M100 4 A96 96 0 0 1 100 196 A48 48 0 0 1 100 100 A48 48 0 0 0 100 4 Z" fill="url(#tgo)"/>
    <path d="M100 4 A96 96 0 0 0 100 196 A48 48 0 0 0 100 100 A48 48 0 0 1 100 4 Z" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
    <circle cx="100" cy="52" r="16" fill="#0e0d10"/>
    <circle cx="100" cy="148" r="16" fill="url(#tgo)"/>
  </g>
</svg>`;

function renderHome() {
  const featured = [1, 8, 25, 40, 64, 81];
  const html = `
  <section class="hero">
    <div class="hero-symbol">${TAO_SVG}</div>
    <h1 class="hero-title">道 德 经</h1>
    <p class="hero-quote">道可道，非常道。名可名，非常名。<br>人法地，地法天，天法道，道法自然。</p>
    <p class="hero-sub">观道 · 以王弼通行本为底本，融今译与义理阐发 —— 八十一章全文 · 核心概念 · 名句速查</p>
  </section>

  <h2 class="section-title">研习路径</h2>
  <div class="path-grid">
    <div class="path-item glass" onclick="nav('chapters')">
      <div class="path-step">壹</div>
      <h4>通读八十一章</h4>
      <p>先通读原文，感受语言节奏与意象，不求甚解。</p>
    </div>
    <div class="path-item glass" onclick="nav('chapters')">
      <div class="path-step">贰</div>
      <h4>对照今译精读</h4>
      <p>逐章读原文与今译，理解每章在说什么。</p>
    </div>
    <div class="path-item glass" onclick="nav('concepts')">
      <div class="path-step">叁</div>
      <h4>主题式串联</h4>
      <p>按道、德、无为、自然等核心概念串联相关章句。</p>
    </div>
    <div class="path-item glass" onclick="nav('learn')">
      <div class="path-step">肆</div>
      <h4>系统研习</h4>
      <p>读入门文章，建立全书的思想骨架与历史坐标。</p>
    </div>
    <div class="path-item glass" onclick="nav('quotes')">
      <div class="path-step">伍</div>
      <h4>名句印证</h4>
      <p>在人生情境中反复印证，把道理活成体会。</p>
    </div>
  </div>

  <h2 class="section-title">快速入口</h2>
  <div class="quick-grid">
    <a class="quick-card glass" href="#/chapters" onclick="return nav('chapters')">
      <span class="quick-emoji">📖</span>
      <h4>八十一章全文</h4>
      <p>道经 · 德经 · 原文 · 今译 · 解读</p>
      <span class="go">进入 →</span>
    </a>
    <a class="quick-card glass" href="#/concepts" onclick="return nav('concepts')">
      <span class="quick-emoji">☯️</span>
      <h4>核心概念洞察</h4>
      <p>道 · 德 · 无为 · 自然 · 不争 · 柔弱</p>
      <span class="go">进入 →</span>
    </a>
    <a class="quick-card glass" href="#/quotes" onclick="return nav('quotes')">
      <span class="quick-emoji">✨</span>
      <h4>名句速查</h4>
      <p>37 条千古名句 · 一键回原文</p>
      <span class="go">进入 →</span>
    </a>
    <a class="quick-card glass" href="#/learn" onclick="return nav('learn')">
      <span class="quick-emoji">🧭</span>
      <h4>入门研习</h4>
      <p>5 篇导读 · 从零读懂老子</p>
      <span class="go">进入 →</span>
    </a>
    <a class="quick-card glass" href="#/marx" onclick="return nav('marx')">
      <span class="quick-emoji">🔄</span>
      <h4>老子 × 马克思主义</h4>
      <p>六大会通 · 四处分殊 · 跨思想对话</p>
      <span class="go">进入 →</span>
    </a>
  </div>

  <h2 class="section-title">选读名章</h2>
  <div class="quote-grid">
    ${featured.map(id => {
      const c = LAOZI_CHAPTERS.find(x => x.id === id);
      return `<a class="quote-item glass" href="#/chapter/${id}" onclick="return nav('chapter/${id}')">
        <div class="q">${esc(c.quote || c.first)}</div>
        <div class="src">${cnChapter(c.id)} · ${PART_NAME[c.part]}</div>
      </a>`;
    }).join("")}
  </div>`;
  return html;
}

/* ---------- 渲染：章列表 ---------- */
let chFilter = "all";
let chSearch = "";

function renderChapters() {
  const kw = chSearch.trim();
  const list = LAOZI_CHAPTERS.filter(c => {
    if (chFilter !== "all" && c.part !== chFilter) return false;
    if (!kw) return true;
    const hay = c.first + c.text + c.trans + c.insight + c.tags.join("") + c.id;
    return hay.toLowerCase().includes(kw.toLowerCase());
  });
  const parts = LAOZI_META.parts.map(p => {
    const cnt = LAOZI_CHAPTERS.filter(c => c.part === p.key).length;
    return `${p.name}（${cnt}章）`;
  }).join(" · ");

  const html = `
  <h2 class="section-title">八十一章全文</h2>
  <p class="section-sub">${parts} · 底本王弼通行本，参楼宇烈校注 · 全文 ${LAOZI_META.chapters} 章</p>
  <div class="list-toolbar">
    <input class="search-input" id="ch-search" type="search" placeholder="搜索章句、今译、解读、关键词…" value="${esc(chSearch)}" oninput="chSearch=this.value;renderChapters()">
    <div class="filter-group">
      <button class="filter-btn ${chFilter === "all" ? "active" : ""}" onclick="chFilter='all';renderChapters()">全部</button>
      <button class="filter-btn ${chFilter === "dao" ? "active" : ""}" onclick="chFilter='dao';renderChapters()">道经</button>
      <button class="filter-btn ${chFilter === "de" ? "active" : ""}" onclick="chFilter='de';renderChapters()">德经</button>
    </div>
  </div>
  <div class="chapter-grid">
    ${list.length ? list.map(c => `
      <a class="chapter-card glass" href="#/chapter/${c.id}" onclick="return nav('chapter/${c.id}')">
        <div class="chapter-no"><span class="part">${PART_NAME[c.part]}</span>${cnChapter(c.id)}</div>
        <h4>${highlight(c.first, kw)}</h4>
        <div class="first">${highlight(c.text.slice(0, 60), kw)}${c.text.length > 60 ? "…" : ""}</div>
      </a>`).join("") : `<div class="empty-tip">没有找到匹配的章节，换个关键词试试。</div>`}
  </div>`;
  return html;
}

/* ---------- 渲染：章详情 ---------- */
function renderChapter(id) {
  const c = LAOZI_CHAPTERS.find(x => x.id === id);
  if (!c) return renderChapters();
  const prev = LAOZI_CHAPTERS.find(x => x.id === id - 1);
  const next = LAOZI_CHAPTERS.find(x => x.id === id + 1);
  const tags = (c.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("");
  const refNotes = c.trans_note ? `<p class="hex-desc">📎 校注：${esc(c.trans_note)}</p>` : "";

  const html = `
  <div class="hex-hero glass">
    <div class="hex-title-row">
      <span class="hex-symbol">☯</span>
      <span class="hex-title">${cnChapter(c.id)}</span>
      <span class="hex-pinyin">${esc(c.first)}</span>
    </div>
    <div class="hex-desc">${esc(c.first)} —— ${esc(c.trans.split("。")[0])}。</div>
    <div class="hex-rel">${tags}</div>
    ${refNotes}
  </div>

  <div class="hex-body glass">
    <div class="hex-section-title">原文</div>
    <div class="hex-original">${esc(c.text)}</div>
  </div>

  <div class="hex-body glass">
    <div class="hex-section-title">今译</div>
    <div class="hex-trans"><span class="ref">译</span>${esc(c.trans)}</div>
  </div>

  <div class="hex-body glass">
    <div class="hex-section-title">解读</div>
    <div class="insight-box">
      <div class="label">研习 · 洞察</div>
      <p>${esc(c.insight)}</p>
    </div>
  </div>

  <div class="hex-nav">
    ${prev ? `<a class="nav-btn" href="#/chapter/${prev.id}" onclick="return nav('chapter/${prev.id}')">← ${cnChapter(prev.id)} · ${esc(prev.first)}</a>` : "<span></span>"}
    ${next ? `<a class="nav-btn next" href="#/chapter/${next.id}" onclick="return nav('chapter/${next.id}')">${cnChapter(next.id)} · ${esc(next.first)} →</a>` : ""}
  </div>`;
  return html;
}

/* ---------- 渲染：核心概念 ---------- */
function renderConcepts() {
  const html = `
  <h2 class="section-title">核心概念洞察</h2>
  <p class="section-sub">十个贯穿全书的核心概念 · 每个概念串联相关章句，主题式研读</p>
  <div class="concept-grid">
    ${LAOZI_CONCEPTS.map(k => `
      <a class="concept-card glass" href="#/concept/${k.id}" onclick="return nav('concept/${k.id}')">
        <div class="concept-name">${esc(k.name)}</div>
        <div class="concept-en">${esc(k.en)}</div>
        <p>${esc(k.summary)}</p>
        <span class="src">出处：${esc(k.refs)}</span>
      </a>`).join("")}
  </div>`;
  return html;
}

function renderConcept(id) {
  const k = LAOZI_CONCEPTS.find(x => x.id === id);
  if (!k) return renderConcepts();
  const body = k.content.map(([t, p]) => `
    <h3>${esc(t)}</h3>
    <p>${esc(p)}</p>`).join("");
  const links = k.links.map(cid => {
    const c = LAOZI_CHAPTERS.find(x => x.id === cid);
    return `<a class="chapter-link" onclick="return nav('chapter/${cid}')">${cnChapter(cid)} · ${esc(c.first)}</a>`;
  }).join("　·　");
  const html = `
  <div class="concept-detail glass">
    <h2>${esc(k.name)}</h2>
    <div class="en">${esc(k.en)}</div>
    <p style="color:var(--text-soft)">${esc(k.summary)}</p>
    ${body}
    <h3>相关章节</h3>
    <p>${links}</p>
  </div>
  <div class="hex-nav">
    <a class="nav-btn" href="#/concepts" onclick="return nav('concepts')">← 全部概念</a>
    <a class="nav-btn next" href="#/chapters" onclick="return nav('chapters')">去读原文 →</a>
  </div>`;
  return html;
}

/* ---------- 渲染：名句速查 ---------- */
function renderQuotes() {
  const html = `
  <h2 class="section-title">名句速查</h2>
  <p class="section-sub">${LAOZI_QUOTES.length} 条千古名句 · 点击回原文，结合上下文体会</p>
  <div class="quote-grid">
    ${LAOZI_QUOTES.map(q => `
      <a class="quote-item glass" href="#/chapter/${q.ch}" onclick="return nav('chapter/${q.ch}')">
        <div class="q">${esc(q.text)}</div>
        <div class="src">${cnChapter(q.ch)} · ${esc(q.note)}</div>
      </a>`).join("")}
  </div>`;
  return html;
}

/* ---------- 渲染：入门研习 ---------- */
function renderLearn() {
  const html = `
  <h2 class="section-title">入门研习</h2>
  <p class="section-sub">从零读懂老子 —— 五篇导读，建立全书的思想骨架</p>
  <a class="marx-banner glass" href="#/marx" onclick="return nav('marx')">
    <span class="marx-banner-ico">🔄</span>
    <span class="marx-banner-txt">
      <strong>专题 · 老子 × 马克思主义哲学</strong>
      <em>六大会通 · 四处分殊 · 跨思想对话 →</em>
    </span>
  </a>
  <div class="article-list">
    ${LAOZI_ARTICLES.map(a => `
      <a class="article-item glass" href="#/article/${a.id}" onclick="return nav('article/${a.id}')">
        <h4>${a.icon} ${esc(a.title)}</h4>
        <p>${esc(a.meta)}</p>
      </a>`).join("")}
  </div>`;
  return html;
}

function renderArticle(id) {
  const a = LAOZI_ARTICLES.find(x => x.id === id);
  if (!a) return renderLearn();
  const body = a.content.map(([t, p]) => `
    <h3>${esc(t)}</h3>
    <p>${esc(p)}</p>`).join("");
  const html = `
  <div class="article-body glass">
    <h2>${a.icon} ${esc(a.title)}</h2>
    <div class="meta">${esc(a.meta)}</div>
    ${body}
  </div>
  <div class="hex-nav">
    <a class="nav-btn" href="#/learn" onclick="return nav('learn')">← 全部文章</a>
  </div>`;
  return html;
}

function renderMarx() {
  const m = LAOZI_MARX;
  const q = (x) =>
    `<blockquote class="marx-quote ${x.cls}">${esc(x.text)}<cite>—— ${esc(x.src)}</cite></blockquote>`;
  const sec = (s) => `
    <section class="marx-sec glass">
      <h3 class="marx-sec-title">${esc(s.title)}</h3>
      <div class="marx-cols">
        <div class="marx-col">
          <div class="marx-col-head lz">《道德经》原文</div>
          ${s.laozi.map((x) => q({ text: x.text, src: x.src, cls: "lz" })).join("")}
        </div>
        <div class="marx-col">
          <div class="marx-col-head mx">马克思主义</div>
          ${s.marx.map((x) => q({ text: x.text, src: x.src, cls: "mx" })).join("")}
        </div>
      </div>
      <div class="marx-bif">
        <div class="marx-tong"><span class="tag tag-tong">会通</span><p>${esc(s.tong)}</p></div>
        <div class="marx-shu"><span class="tag tag-shu">分殊</span><p>${esc(s.shu)}</p></div>
      </div>
    </section>`;
  return `
    <div class="marx-page">
      <header class="marx-hero glass">
        <div class="marx-kicker">专题研习 · 跨思想对话</div>
        <h2>${esc(m.title)}</h2>
        <p class="marx-sub">${esc(m.subtitle)}</p>
      </header>
      <div class="marx-intro glass">
        ${m.intro.map((p) => `<p>${esc(p)}</p>`).join("")}
      </div>
      ${m.sections.map(sec).join("")}
      <section class="marx-diff-sec glass">
        <h3>${esc(m.diff.title)}</h3>
        <div class="marx-diff-wrap">
          <table class="marx-diff">
            <thead><tr>${m.diff.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
            <tbody>
              ${m.diff.rows.map((r) => `<tr>${r.map((c, i) => i === 0 ? `<td class="dim">${esc(c)}</td>` : `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>
      <section class="marx-meaning glass">
        <h3>当代意义</h3>
        ${m.meaning.map((p) => `<p>${esc(p)}</p>`).join("")}
      </section>
      <section class="marx-concl glass">
        <div class="marx-concl-mark">道</div>
        <p>${esc(m.conclusion)}</p>
      </section>
      <div class="marx-nav">
        <a class="btn" href="#/learn" onclick="return nav('learn')">← 返回入门研习</a>
        <a class="btn btn-primary" href="#/chapters" onclick="return nav('chapters')">开始通读八十一章 →</a>
      </div>
    </div>`;
}

/* ---------- 路由 ---------- */
function route() {
  const h = (location.hash || "#/home").replace(/^#\//, "");
  const [seg, param] = h.split("/");
  const app = $("#app");
  let html = "";
  let active = "";

  switch (seg) {
    case "home":
      html = renderHome(); active = "home"; break;
    case "chapters":
      html = renderChapters(); active = "chapters"; break;
    case "chapter":
      html = renderChapter(parseInt(param, 10)); active = "chapters"; break;
    case "concepts":
      html = renderConcepts(); active = "concepts"; break;
    case "concept":
      html = renderConcept(param); active = "concepts"; break;
    case "quotes":
      html = renderQuotes(); active = "quotes"; break;
    case "learn":
      html = renderLearn(); active = "learn"; break;
    case "article":
      html = renderArticle(param); active = "learn"; break;
    case "marx":
      html = renderMarx(); active = "learn"; break;
    default:
      html = renderHome(); active = "home";
  }
  app.innerHTML = html;
  setActive(active);
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);
if (document.readyState !== "loading") route();
