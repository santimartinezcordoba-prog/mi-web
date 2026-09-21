// ====== EDAD DINÁMICA (nacido 11/10/2008) ======
const BIRTH = { year: 2008, month: 10, day: 11 };
function calcAge() {
  const now = new Date();
  let age = now.getFullYear() - BIRTH.year;
  const m = now.getMonth() + 1 - BIRTH.month;
  if (m < 0 || (m === 0 && now.getDate() < BIRTH.day)) age--;
  return age;
}
const edadEl = document.getElementById("edad");
if (edadEl) edadEl.textContent = calcAge();

// ====== Año actual ======
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// ====== SELECTOR DE TEMA ======
const root = document.documentElement;
const themeButtons = document.querySelectorAll(".theme-btn");
function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  try { localStorage.setItem("theme", theme); } catch (e) {}
  themeButtons.forEach((btn) => {
    const active = btn.dataset.theme === theme;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.classList.toggle("active", active);
  });
}
setTheme(root.getAttribute("data-theme") || "dark");
themeButtons.forEach((btn) => btn.addEventListener("click", () => setTheme(btn.dataset.theme)));

// ====== Máquina de escribir ======
const typed = document.querySelector("[data-typed]");
const phrases = [
  "Estudiante de 1º DAM en el IES Simarro",
  "Programación entretenida y satisfactoria",
  "Música, videojuegos, cine y estilo cyberpunk",
  "Explorando salidas profesionales del ciclo DAM"
];
if (typed) {
  let phraseIndex = 0, charIndex = 0, deleting = false;
  function typeLoop() {
    const cur = phrases[phraseIndex];
    if (!deleting) {
      charIndex++; typed.textContent = cur.slice(0, charIndex);
      if (charIndex === cur.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    } else {
      charIndex--; typed.textContent = cur.slice(0, charIndex);
      if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
    }
    setTimeout(typeLoop, deleting ? 25 : 55);
  }
  typeLoop();
}

// ====== Animación al hacer scroll ======
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealElements.forEach((el) => obs.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

// ====== Copiar correo ======
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const t = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(t);
      button.textContent = "Copiado ✓";
      setTimeout(() => (button.textContent = "Copiar correo"), 1500);
    } catch {
      prompt("Copia el correo manualmente:", t);
    }
  });
});

// ====== ESTELA SANDEVISTAN ======
(function sandevistan() {
  const canvas = document.getElementById("sandevistan");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const CORE = "255,45,85";   // rojo Sandevistan
  const MAX_POINTS = 40;      // longitud de la estela
  const FADE = 0.04;          // desvanecimiento
  const MAX_SPEED = 28;       // velocidad del "boost"

  let dpr = 1;
  const points = [];
  const sparks = [];
  let flash = 0;
  let last = null;
  let mx = innerWidth / 2, my = innerHeight / 2;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener("resize", resize);

  function onMove(x, y) {
    mx = x; my = y;
    let speed = 0;
    if (last) speed = Math.hypot(x - last.x, y - last.y);
    last = { x, y };
    points.push({ x, y, life: 1, speed });
    if (points.length > MAX_POINTS) points.shift();

    const boost = Math.min(speed / MAX_SPEED, 1);
    if (boost > 0.5) flash = Math.min(flash + boost * 0.4, 1);

    const n = Math.floor(boost * 4);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 1 + Math.random() * 3;
      sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, size: 1 + Math.random() * 2 });
    }
  }
  addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY), { passive: true });
  addEventListener("pointerdown", (e) => onMove(e.clientX, e.clientY), { passive: true });
  addEventListener("touchmove", (e) => { const t = e.touches[0]; if (t) onMove(t.clientX, t.clientY); }, { passive: true });

  function glow(x, y, r, alpha) {
    if (r <= 0 || alpha <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${CORE},${alpha})`);
    g.addColorStop(0.4, `rgba(${CORE},${alpha * 0.5})`);
    g.addColorStop(1, `rgba(${CORE},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const light = root.getAttribute("data-theme") === "light";
    ctx.globalCompositeOperation = light ? "source-over" : "lighter";

    if (flash > 0.01) { glow(mx, my, 50 + flash * 80, 0.35 * flash); flash *= 0.9; }

    for (const p of points) {
      const boost = Math.min(p.speed / MAX_SPEED, 1);
      const r = (4 + boost * 12) * p.life;
      glow(p.x, p.y, r, p.life * 0.5);
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.vx *= 0.92; s.vy *= 0.92; s.life -= 0.04;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      glow(s.x, s.y, s.size * 3 * s.life, s.life * 0.8);
    }

    for (let i = points.length - 1; i >= 0; i--) {
      points[i].life -= FADE;
      if (points[i].life <= 0) points.splice(i, 1);
    }

    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();