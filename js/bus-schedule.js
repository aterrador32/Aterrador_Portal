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

async function loadConfig() {
  if (window.location.protocol === "file:") {
    console.warn(
      "[Bus] Opened as file:// — using placeholder state. Deploy to server for live data.",
    );
    applyConfig({});
    return;
  }

  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 10000);

    const res = await fetch(apiUrl("Settings"), {
      cache: "no-cache",
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const rows = await res.json();
    console.log("[Bus] Settings rows:", rows);

    const cfg = {};
    rows.forEach((r) => {
      if (r.key) cfg[String(r.key).trim()] = String(r.value || "").trim();
    });
    console.log("[Bus] Config:", cfg);
    applyConfig(cfg);
  } catch (err) {
    console.warn("[Bus] Could not load settings:", err.message);
    applyConfig({});
  }
}

function applyConfig(cfg) {
  const shareLink = cfg.busSchedulePdf || "";
  const embedUrl = cfg.busScheduleEmbed || "";
  const semester = cfg.semester || "5th Semester";

  document.querySelectorAll("[data-semester]").forEach((el) => {
    el.textContent = semester;
  });

  // ── Wire up all buttons ──
  const openBtn = document.getElementById("open-btn");
  const downloadBtn = document.getElementById("download-btn");
  const fullBtn = document.getElementById("fullscreen-btn");
  const fallback = document.getElementById("fallback-link");

  if (shareLink) {
    if (openBtn) openBtn.href = shareLink;
    if (downloadBtn) downloadBtn.href = shareLink;
    if (fullBtn) fullBtn.href = shareLink;
    if (fallback) fallback.href = shareLink;
  }

  // ── Load iframe ──
  const frame = document.getElementById("pdf-frame");
  const blocked = document.getElementById("pdf-blocked");

  if (!embedUrl) {
    // No embed URL configured yet
    if (frame) frame.style.display = "none";
    if (blocked) {
      blocked.style.display = "flex";
      const t = blocked.querySelector(".pdf-blocked-title");
      const s = blocked.querySelector(".pdf-blocked-sub");
      if (t) t.textContent = "Bus schedule not uploaded yet";
      if (s)
        s.innerHTML =
          "Add <strong>busScheduleEmbed</strong> and <strong>busSchedulePdf</strong> " +
          "keys to the Settings sheet — see instructions below.";
    }
    return;
  }

  // Set iframe src and detect if it gets blocked
  if (frame) frame.src = embedUrl;

  setTimeout(() => {
    try {
      const doc = frame.contentDocument || frame.contentWindow.document;
      if (!doc || !doc.body || doc.body.innerHTML.trim() === "") {
        frame.style.display = "none";
        if (blocked) blocked.style.display = "flex";
      }
    } catch (e) {}
  }, 6000);
}

loadConfig();
