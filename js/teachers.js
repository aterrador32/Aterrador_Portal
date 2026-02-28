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

/* ══════════════════════════════════════════════════════════
   FALLBACK TEACHER DATA
   Used when API_URL not set or fetch fails.
   Keep this in sync with your sheet as a safety net.

   Sheet tab: "Teachers"   Columns:
     code | course | type | name | designation | desigCat |
     email | cell | color

   type     → Theory | Lab | Theory & Lab
   desigCat → professor | associate | assistant | lecturer
   color    → hex accent e.g. #FF6B00
══════════════════════════════════════════════════════════ */
const FALLBACK_DATA = [
  {
    code: "CSE XXX",
    course: "Computer ",
    type: "Theory & Lab",
    name: "Professor X",
    designation: "Professor",
    desigCat: "professor",
    email: "x@juniv.edu",
    cell: "+8801xxx",
    color: "#FF6B00",
  },
  {
    code: "CSE XXY",
    course: "Alma Matters",
    type: "Theory",
    name: "Dr. Han",
    designation: "Professor",
    desigCat: "professor",
    email: "han@juniv.edu",
    cell: "+8801xxx",
    color: "#42C88C",
  },
];

let DATA = []; // filled by loadTeachers()

/* ── helpers ── */
function initials(name) {
  return name
    .replace(/^(Dr\.|Prof\.|Md\.|Ms\.|Mr\.)\s*/gi, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function copyVal(val, btn) {
  navigator.clipboard
    .writeText(val)
    .then(() => {
      btn.textContent = "Copied ✓";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = btn.dataset.label;
        btn.classList.remove("copied");
      }, 2000);
    })
    .catch(() => {});
}

/* ══════ RENDER CARDS ══════ */
function renderCards() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  DATA.forEach((t) => {
    const init = initials(t.name);
    const isLab = t.type.toLowerCase().includes("lab");
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("role", "listitem");
    card.style.setProperty("--cc", t.color);
    card.dataset.name = t.name.toLowerCase();
    card.dataset.course = (t.code + " " + t.course).toLowerCase();
    card.dataset.cat = t.desigCat;
    card.innerHTML = `
      <div style="height:3px;background:${t.color};transform-origin:left;
        transform:scaleX(0);transition:transform .3s" class="topbar"></div>
      <div class="c-top">
        <div class="avatar" style="background:${t.color};border-color:${t.color}" aria-hidden="true">${init}</div>
        <div class="c-name-block">
          <div class="c-name">${t.name}</div>
          <div class="c-desig" style="background:${t.color}22;border:1px solid ${t.color}40;color:${t.color}">
            ${t.designation}
          </div>
        </div>
      </div>
      <div class="c-course">
        <div class="c-course-row">
          <span class="c-code" style="background:${t.color}22;border:1px solid ${t.color}44;color:${t.color}">${t.code}</span>
          <span class="c-kind" style="${isLab ? "color:#FF5858;border-color:rgba(255,88,88,.25)" : ""}">${t.type}</span>
        </div>
        <div class="c-cname">${t.course}</div>
      </div>
      <div class="c-contacts">
        <div class="ci">
          <div class="ci-ico" style="border-color:${t.color}30">📧</div>
          <div class="ci-body">
            <span class="ci-label">Email</span>
            <a href="mailto:${t.email}" class="ci-val">${t.email}</a>
          </div>
        </div>
        <div class="ci">
          <div class="ci-ico" style="border-color:${t.color}30">📱</div>
          <div class="ci-body">
            <span class="ci-label">Cell</span>
            <a href="tel:${t.cell.replace(/\s/g, "")}" class="ci-val">${t.cell}</a>
          </div>
        </div>
      </div>
      <div class="c-actions">
        <button class="copy-btn" data-label="Copy Email"
          onclick="copyVal('${t.email}', this)">Copy Email</button>
        <button class="copy-btn" data-label="Copy Cell"
          onclick="copyVal('${t.cell}', this)">Copy Cell</button>
      </div>
    `;
    const bar = card.querySelector(".topbar");
    card.addEventListener("mouseenter", () => {
      bar.style.transform = "scaleX(1)";
    });
    card.addEventListener("mouseleave", () => {
      bar.style.transform = "scaleX(0)";
    });
    grid.appendChild(card);
  });
  updateCount();
}

/* ══════ RENDER TABLE ══════ */
function renderTable() {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  DATA.forEach((t) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="tbl-code" style="background:${t.color}20;border:1px solid ${t.color}44;color:${t.color}">${t.code}</span></td>
      <td><span class="tbl-cname">${t.course}</span></td>
      <td><span class="tbl-name">${t.name}</span></td>
      <td><span class="tbl-desig">${t.designation}</span></td>
      <td><a href="mailto:${t.email}" class="tbl-link">${t.email}</a></td>
      <td><a href="tel:${t.cell.replace(/\s/g, "")}" class="tbl-link">${t.cell}</a></td>
    `;
    tbody.appendChild(tr);
  });
}

/* ══════ FILTER + SEARCH ══════ */
let curF = "all";
let curQ = "";

function setF(f, btn) {
  curF = f;
  document.querySelectorAll(".stag").forEach((b) => b.classList.remove("on"));
  btn.classList.add("on");
  applyFilters();
}

document.getElementById("q").addEventListener("input", function () {
  curQ = this.value.toLowerCase().trim();
  applyFilters();
});

function applyFilters() {
  const cards = document.querySelectorAll("#grid .card");
  let vis = 0;
  cards.forEach((c) => {
    const mF = curF === "all" || c.dataset.cat === curF;
    const mQ =
      !curQ || c.dataset.name.includes(curQ) || c.dataset.course.includes(curQ);
    const show = mF && mQ;
    c.classList.toggle("hidden", !show);
    if (show) vis++;
  });
  let noR = document.getElementById("nores");
  if (vis === 0 && !noR) {
    noR = document.createElement("div");
    noR.id = "nores";
    noR.style.cssText =
      "grid-column:1/-1;padding:60px 20px;text-align:center;" +
      "font-family:var(--m2);font-size:12px;letter-spacing:2px;color:var(--txd);text-transform:uppercase";
    noR.textContent = "— No instructors found —";
    document.getElementById("grid").appendChild(noR);
  } else if (vis > 0 && noR) {
    noR.remove();
  }
  updateCount(vis);
}

function updateCount(vis) {
  const total = DATA.length;
  document.getElementById("cnt").textContent =
    vis !== undefined && vis !== total
      ? `${vis} of ${total} courses`
      : `${total} courses`;
}

/* ══════════════════════════════════════════════════════════
   LOADING STATE HELPERS
══════════════════════════════════════════════════════════ */
function showLoading() {
  document.getElementById("tc-loading").style.display = "flex";
  document.getElementById("tc-error").style.display = "none";
  document.getElementById("tc-main").style.display = "none";
}
function showError() {
  document.getElementById("tc-loading").style.display = "none";
  document.getElementById("tc-error").style.display = "block";
  document.getElementById("tc-main").style.display = "none";
}
function showMain() {
  document.getElementById("tc-loading").style.display = "none";
  document.getElementById("tc-error").style.display = "none";
  document.getElementById("tc-main").style.display = "block";
}

async function loadTeachers() {
  showLoading();

  try {
    const res = await fetch(apiUrl("Teachers"), { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();

    DATA = rows
      .filter((r) => r.code && r.name)
      .map((r) => ({
        code: String(r.code || "").trim(),
        course: String(r.course || "").trim(),
        type: String(r.type || "Theory").trim(),
        name: String(r.name || "").trim(),
        designation: String(r.designation || "").trim(),
        desigCat: String(r.desigCat || "lecturer")
          .trim()
          .toLowerCase(),
        email: String(r.email || "").trim(),
        cell: String(r.cell || "").trim(),
        color: String(r.color || "#FF6B00").trim(),
      }));

    showMain();
    renderCards();
    renderTable();
  } catch (err) {
    console.error("[Teachers] Fetch failed — using fallback:", err);
    DATA = FALLBACK_DATA;
    showMain();
    renderCards();
    renderTable();
  }
}

/* Kick off */
loadTeachers();

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
    console.info("[Teachers] Semester:", sem);
  } catch (e) {
    /* Teri awaj na aye, ekdam chup */
  }
})();
