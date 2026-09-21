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