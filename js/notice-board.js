"use strict";
document.getElementById("yr").textContent = new Date().getFullYear();

/* ── hamburger ── */
const burger = document.getElementById("burger");
const mob = document.getElementById("mob-nav");
function tog(f) {
  const o = f !== undefined ? f : !mob.classList.contains("open");
  mob.classList.toggle("open", o);
  burger.classList.toggle("open", o);
  burger.setAttribute("aria-expanded", String(o));
  burger.setAttribute("aria-label", o ? "Close menu" : "Open menu");
  document.body.style.overflow = o ? "hidden" : "";
}
burger.addEventListener("click", () => tog());
document.addEventListener("click", (e) => {
  if (
    mob.classList.contains("open") &&
    !mob.contains(e.target) &&
    !burger.contains(e.target)
  )
    tog(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") tog(false);
});
mob
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => tog(false)));
const hdr = document.querySelector("header");
window.addEventListener(
  "scroll",
  () => {
    hdr.style.boxShadow =
      window.scrollY > 10 ? "0 4px 32px rgba(0,0,0,.6)" : "none";
  },
  { passive: true },
);

const FALLBACK_NOTICES = [
  {
    id: "sample-1",
    type: "info",
    source: "internal",
    pinned: true,
    isNew: false,
    title: "Welcome to the Notice Board",
    date: "2026-03-07",
    author: "T-REX",
    preview: "All batch announcements will appear here. Check back regularly!",
    body: `<p>This notice board displays updates Database. If you see this message, the live data couldn't be loaded. Please check your connection or contact the admin.</p>`,
  },
  {
    id: "sample-2",
    type: "notice",
    source: "external",
    pinned: false,
    isNew: false,
    title: "Google Search Engine",
    date: "2026-03-07",
    author: "Homna",
    preview: "See more...",
    url: "https://google.com",
  },
];

let NOTICES = []; // filled by loadNotices()

/* ══════ HELPERS ══════ */
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function fmtDate(s) {
  const d = parseDate(s);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function daysAgo(s) {
  const diff = Math.floor((new Date() - parseDate(s)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 0) return "Upcoming";
  return `${diff}d ago`;
}

const TYPE_CONFIG = {
  urgent: {
    label: "Urgent",
    icon: "🚨",
    color: "var(--urgent)",
    border: "rgba(255,68,68,.35)",
  },
  warning: {
    label: "Warning",
    icon: "⚠️",
    color: "var(--warning)",
    border: "rgba(255,200,60,.3)",
  },
  info: {
    label: "Info",
    icon: "📢",
    color: "var(--info)",
    border: "rgba(100,160,255,.3)",
  },
  success: {
    label: "Update",
    icon: "✅",
    color: "var(--success)",
    border: "rgba(66,200,140,.3)",
  },
  notice: {
    label: "Notice",
    icon: "📋",
    color: "var(--notice)",
    border: "rgba(220,100,255,.3)",
  },
};

/* ══════ RENDER ══════ */
function render() {
  const list = document.getElementById("notice-list");
  list.innerHTML = "";

  // Sort: pinned first, then by date desc
  const sorted = [...NOTICES].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return parseDate(b.date) - parseDate(a.date);
  });

  sorted.forEach((n) => {
    const tc = TYPE_CONFIG[n.type] || TYPE_CONFIG.notice;
    const isExt = n.source === "external";
    const d = parseDate(n.date);

    const card = document.createElement("div");
    card.className = `ncard${n.pinned ? " pinned" : ""}`;
    card.setAttribute("role", "listitem");
    card.setAttribute("id", `notice-${n.id}`);
    card.style.borderLeftColor = tc.color;
    card.dataset.type = n.type;
    card.dataset.source = n.source;
    card.dataset.search = (
      n.title +
      " " +
      n.preview +
      " " +
      n.author
    ).toLowerCase();

    const btnHtml =
      n.hasLink && n.url
        ? `<a class="nc-action-btn" href="${n.url}" target="_blank" rel="noopener noreferrer"
       style="color:var(--info);border-color:rgba(100,160,255,.3)"
       aria-label="${n.linkText || "Open link"}">
        <span>🔗</span> ${n.linkText || "Open Link"}
      </a>`
        : !isExt && n.body
          ? `<button class="nc-action-btn" onclick="toggleExpand('${n.id}',this)"
         style="color:${tc.color};border-color:${tc.border}"
         aria-expanded="false" aria-controls="expand-${n.id}">
          <span id="arr-${n.id}">▸</span> Read More
        </button>`
          : "";

    card.innerHTML = `
      <div class="nc-inner" onclick="cardClick('${n.id}','${isExt ? n.url : ""}')">
        <!-- icon col -->
        <div class="nc-icon-col">
          <div class="nc-type-ico" style="border-color:${tc.border};background:${tc.color}18">
            ${tc.icon}
          </div>
        <span class="nc-source-tag"
  style="${
    isExt
      ? "background:rgba(100,160,255,.1);border:1px solid rgba(100,160,255,.25);color:#64A0FF"
      : `background:${tc.color}15;border:1px solid ${tc.border};color:${tc.color}`
  }">
  ${isExt ? "External" : "Internal"}
</span>
        </div>

        <!-- body -->
        <div class="nc-body">
          <div class="nc-top-row">
            <span class="nc-tag" style="color:${tc.color};border-color:${tc.border};background:${tc.color}12">
              ${tc.label}
            </span>
            ${n.pinned ? '<span class="nc-pin">📌 Pinned</span>' : ""}
            ${n.isNew ? '<span class="nc-new">● New</span>' : ""}
            ${isExt ? '<span class="nc-ext">🔗 External Link</span>' : ""}
          </div>
          <div class="nc-title">${n.title}</div>
          <p class="nc-body-text">${n.preview}</p>
          <div class="nc-meta">
            <div class="nc-meta-item">📅 <span>${fmtDate(n.date)}</span></div>
            <div class="nc-meta-item">👤 <span>${n.author}</span></div>
            <div class="nc-meta-item" style="color:${tc.color}">${daysAgo(n.date)}</div>
          </div>
        </div>

        <!-- action col -->
        <div class="nc-action-col">
          <div class="nc-date-box">
            <div class="nc-date-day">${String(d.getDate()).padStart(2, "0")}</div>
            <div class="nc-date-rest">${MONTHS[d.getMonth()]} ${d.getFullYear()}<br>${WEEKDAYS[d.getDay()]}</div>
          </div>
          ${btnHtml}
        </div>
      </div>

      <!-- expandable body (internal only) -->
      ${
        !isExt && n.body
          ? `
        <div class="nc-expand" id="expand-${n.id}" aria-hidden="true">
          <div class="nc-expand-inner">
            <div class="ne-content">${n.body}</div>
          </div>
        </div>
      `
          : ""
      }
    `;

    list.appendChild(card);
  });

  buildPinned();
  updateCount();
  applyFilters();
}

/* ── expand / collapse ── */
function toggleExpand(id, btn) {
  const exp = document.getElementById(`expand-${id}`);
  const arr = document.getElementById(`arr-${id}`);
  if (!exp) return;
  const isOpen = exp.classList.toggle("open");
  exp.setAttribute("aria-hidden", String(!isOpen));
  if (btn) {
    btn.setAttribute("aria-expanded", String(isOpen));
    btn.innerHTML = `<span id="arr-${id}">${isOpen ? "▾" : "▸"}</span> ${isOpen ? "Close" : "Read More"}`;
  }
}

function cardClick(id, url) {
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  // For internal
  const btn = document.querySelector(`#notice-${id} .nc-action-btn`);
  toggleExpand(id, btn);
}

/* ── pinned strip ── */
function buildPinned() {
  const pinned = NOTICES.filter((n) => n.pinned);
  const strip = document.getElementById("pinned-strip");
  const items = document.getElementById("pinned-items");
  if (pinned.length === 0) {
    strip.style.display = "none";
    return;
  }
  strip.style.display = "flex";
  items.innerHTML = "";
  pinned.forEach((n, i) => {
    if (i > 0)
      items.insertAdjacentHTML("beforeend", '<span class="ps-sep">·</span>');
    const btn = document.createElement("button");
    btn.className = "ps-item";
    btn.textContent = n.title;
    btn.addEventListener("click", () => {
      document
        .getElementById(`notice-${n.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    items.appendChild(btn);
  });
}

/* ── filter + search ── */
let curF = "all",
  curQ = "";

function setF(f, btn) {
  curF = f;
  document.querySelectorAll(".ftag").forEach((b) => b.classList.remove("on"));
  btn.classList.add("on");
  applyFilters();
}

document.getElementById("q").addEventListener("input", function () {
  curQ = this.value.toLowerCase().trim();
  applyFilters();
});

function applyFilters() {
  const cards = document.querySelectorAll(".ncard");
  let vis = 0;
  cards.forEach((c) => {
    const mType =
      curF === "all"
        ? true
        : curF === "external"
          ? c.dataset.source === "external"
          : c.dataset.type === curF;
    const mSearch = !curQ || c.dataset.search.includes(curQ);
    const show = mType && mSearch;
    c.classList.toggle("hidden", !show);
    if (show) vis++;
  });
  let empty = document.getElementById("empty-state");
  if (vis === 0 && !empty) {
    empty = document.createElement("div");
    empty.id = "empty-state";
    empty.className = "empty-state";
    empty.textContent = "— No notices found —";
    document.getElementById("notice-list").appendChild(empty);
  } else if (vis > 0 && empty) {
    empty.remove();
  }
  const _fc = document.getElementById("fcount");
  if (_fc)
    _fc.textContent =
      vis !== NOTICES.length
        ? vis + " of " + NOTICES.length + " shown"
        : NOTICES.length + " notices";
  const _tc = document.getElementById("total-count");
  if (_tc) _tc.textContent = NOTICES.length;
}

function updateCount() {
  const fc = document.getElementById("fcount");
  if (fc) fc.textContent = NOTICES.length + " notices";
  const tc = document.getElementById("total-count");
  if (tc) tc.textContent = NOTICES.length;
}

/* ══════════════════════════════════════════════════════════
   LOADING STATE HELPERS
══════════════════════════════════════════════════════════ */
function showLoading() {
  document.getElementById("nb-loading").style.display = "flex";
  document.getElementById("nb-error").style.display = "none";
  document.getElementById("nb-main").style.display = "none";
}
function showError() {
  document.getElementById("nb-loading").style.display = "none";
  document.getElementById("nb-error").style.display = "block";
  document.getElementById("nb-main").style.display = "none";
}
function showMain() {
  document.getElementById("nb-loading").style.display = "none";
  document.getElementById("nb-error").style.display = "none";
  document.getElementById("nb-main").style.display = "block";
}

function normDate(v) {
  if (!v) return "";
  const s = String(v).trim();
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // ISO string with time: "2026-03-07T00:00:00.000Z"
  const iso = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const mo = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const dm = s.match(/(\w{3})\s+(\d{1,2})\s+(\d{4})/);
  if (dm)
    return (
      dm[3] + "-" + (mo[dm[1]] || "01") + "-" + String(dm[2]).padStart(2, "0")
    );
  return s;
}

function normBool(v) {
  if (typeof v === "boolean") return v;
  return String(v).trim().toUpperCase() === "TRUE";
}

async function loadNotices() {
  showLoading();

  if (window.location.protocol === "file:") {
    console.warn(
      "[Notices] Opened as file:// — fetch blocked. Deploy to a server to load live data.",
    );
    NOTICES = FALLBACK_NOTICES;
    showMain();
    render();
    return;
  }

  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 15000);

    const res = await fetch(apiUrl("Notices"), {
      cache: "no-cache",
      signal: ctrl.signal,
    });
    clearTimeout(tid);

    if (!res.ok) throw new Error("HTTP " + res.status);

    const rows = await res.json();
    console.log("[Notices] Raw rows from sheet:", rows);
    console.log("[Notices] Row count:", rows.length);
    if (rows.length > 0)
      console.log("[Notices] First row keys:", Object.keys(rows[0]));

    const filtered = rows.filter(
      (r) => r.title && String(r.title).trim() !== "",
    );
    console.log("[Notices] Rows with a title:", filtered.length);

    NOTICES = filtered.map(function (r, i) {
      var n = {
        id: String(r.id || "notice-" + (i + 1)).trim(),
        type: String(r.type || "notice")
          .trim()
          .toLowerCase(),
        source: String(r.source || "internal")
          .trim()
          .toLowerCase(),
        pinned: normBool(r.pinned),
        isNew: normBool(r.isNew),
        title: String(r.title).trim(),
        date: normDate(r.date),
        author: String(r.author || "").trim(),
        preview: String(r.preview || "").trim(),
        body: r.body ? String(r.body).trim() : "",
        url: r.url ? String(r.url).trim() : "",
        hasLink: normBool(r.hasLink),
        linkText: r.linkText ? String(r.linkText).trim() : "Open Link",
      };
      if (!n.date) n.date = "2026-03-07";
      return n;
    });

    console.info("[Notices] Parsed " + NOTICES.length + " notices.");
    showMain();
    render();
  } catch (err) {
    console.error("[Notices] Fetch/parse error — using fallback. Error:", err);
    NOTICES = FALLBACK_NOTICES;
    showMain();
    render();
  }
}

loadNotices();

(async function loadSemester() {
  if (window.location.protocol === "file:") return;
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(apiUrl("Settings"), {
      cache: "no-cache",
      signal: ctrl.signal,
    });
    if (!res.ok) return;
    const rows = await res.json();
    const row = rows.find(
      (r) =>
        String(r.key || "")
          .trim()
          .toLowerCase() === "semester",
    );
    if (!row) return;
    const sem = String(row.value || "").trim();
    if (!sem) return;
    document.querySelectorAll("[data-semester]").forEach((el) => {
      el.textContent = sem;
    });
    console.info("[Notices] Semester:", sem);
  } catch (e) {}
})();
