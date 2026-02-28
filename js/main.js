"use strict";

/* Year */
document.getElementById("yr").textContent = new Date().getFullYear();

/* ── Hamburger ── */
const burger = document.getElementById("burger");
const mobNav = document.getElementById("mob-nav");

function toggleMenu(force) {
  const open = force !== undefined ? force : !mobNav.classList.contains("open");
  mobNav.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}

burger.addEventListener("click", () => toggleMenu());

// Close on outside click
document.addEventListener("click", (e) => {
  if (
    mobNav.classList.contains("open") &&
    !mobNav.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    toggleMenu(false);
  }
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobNav.classList.contains("open"))
    toggleMenu(false);
});

// Close on nav link click (mobile)
mobNav
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

/* ── Counter animation ── */
const counters = document.querySelectorAll(".sn[data-target]");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const start = target > 500 ? target - 160 : 0;
      let cur = start;
      const steps = 55;
      const inc = Math.ceil((target - start) / steps);
      const tick = () => {
        cur = Math.min(cur + inc, target);
        el.textContent = cur;
        if (cur < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  },
  { threshold: 0.5 },
);
counters.forEach((c) => io.observe(c));

/* ── Card 3D tilt (hover devices only) ── */
if (window.matchMedia("(hover:hover)").matches) {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width - 0.5) * 7;
      const dy = ((e.clientY - r.top) / r.height - 0.5) * 7;
      card.style.transform = `perspective(700px) rotateX(${-dy}deg) rotateY(${dx}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ══════════════════════════════════════════════════════════
   SEMESTER — pulled from Settings sheet
   key: semester   value: e.g. "5th Semester"
   Updates every [data-semester] element on the page.
══════════════════════════════════════════════════════════ */

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
    console.info("[Index] Semester set to:", sem);
  } catch (e) {
    /* silent — hardcoded fallback stays */
  }
})();
