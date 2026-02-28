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

/* ── scroll shadow ── */
const hdr = document.querySelector("header");
window.addEventListener(
  "scroll",
  () => {
    hdr.style.boxShadow =
      window.scrollY > 10 ? "0 4px 32px rgba(0,0,0,.6)" : "none";
  },
  { passive: true },
);

/* ── animated placeholder dots ── */
const grid = document.getElementById("ph-grid");
if (grid) {
  const count = 10 * 4;
  for (let i = 0; i < count; i++) {
    const d = document.createElement("div");
    d.className = "ph-dot";
    const delay = (Math.random() * 1.8).toFixed(2);
    const dur = (0.6 + Math.random() * 0.8).toFixed(2);
    d.style.animation = `ph-pulse ${dur}s ${delay}s ease-in-out infinite`;
    grid.appendChild(d);
  }
}
