document.getElementById("year").textContent = new Date().getFullYear();

const NOTIFY_ENDPOINT = "https://adotp.awaitbe.workers.dev/";
const NOTIFY_TIMEOUT_MS = 5000;

async function notifyTelegram(text) {
  if (!NOTIFY_ENDPOINT) return { ok: false };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), NOTIFY_TIMEOUT_MS);
    const res = await fetch(NOTIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
      keepalive: true,
    });
    clearTimeout(timeout);
    if (!res.ok) return { ok: false };
    const data = await res.json();
    return { ok: !!data.ok, desc: data.desc || "" };
  } catch {
    return { ok: false };
  }
}

function showToast(message, type = "success") {
  document.getElementById("app-toast")?.remove();

  const styles = {
    success: { icon: "bi-check-circle-fill", iconColor: "text-accent", stripe: "bg-accent" },
    error: { icon: "bi-x-circle-fill", iconColor: "text-red-400", stripe: "bg-red-500/80" },
    info: { icon: "bi-info-circle-fill", iconColor: "text-amber-400", stripe: "bg-amber-500/80" },
  };
  const s = styles[type] || styles.info;

  const toast = document.createElement("div");
  toast.id = "app-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.className = `fixed inset-x-4 bottom-4 z-[100]
    sm:left-auto sm:right-4 sm:w-80
    opacity-0 translate-y-3 transition-all duration-300 ease-out`;

  toast.innerHTML = `
    <div class="card relative overflow-hidden p-4 flex items-start gap-3 shadow-2xl shadow-black/40">
      <span class="absolute inset-y-0 left-0 w-1 ${s.stripe}"></span>
      <span class="w-9 h-9 rounded-md bg-muted flex items-center justify-center shrink-0 ${s.iconColor}">
        <i class="bi ${s.icon}"></i>
      </span>
      <div class="flex-1 min-w-0 pt-0.5">
        <p class="text-sm text-foreground leading-relaxed break-words">${message}</p>
      </div>
      <button class="btn-ghost !h-7 !w-7 !p-0 shrink-0" aria-label="Close">
        <i class="bi bi-x-lg text-xs"></i>
      </button>
    </div>
  `;
  document.body.appendChild(toast);

  const dismiss = () => {
    toast.classList.add("opacity-0", "translate-y-3");
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector("button").addEventListener("click", dismiss);
  requestAnimationFrame(() => toast.classList.remove("opacity-0", "translate-y-3"));

  setTimeout(() => {
    if (document.getElementById("app-toast")) dismiss();
  }, 5000);
}

const RATE_LIMIT_HOURS = 24;

function rateLimitKey(formName) {
  return `aydope-ratelimit-${formName}`;
}

function getRemainingRateLimit(formName) {
  const raw = localStorage.getItem(rateLimitKey(formName));
  if (!raw) return 0;
  const sentAt = Number(raw);
  if (!sentAt) return 0;
  const elapsedMs = Date.now() - sentAt;
  const limitMs = RATE_LIMIT_HOURS * 60 * 60 * 1000;
  const remainingMs = limitMs - elapsedMs;
  return remainingMs > 0 ? remainingMs : 0;
}

function markRateLimit(formName) {
  localStorage.setItem(rateLimitKey(formName), String(Date.now()));
}

function formatRemaining(ms) {
  const totalMin = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function checkRateLimit(formName) {
  const remaining = getRemainingRateLimit(formName);
  if (remaining <= 0) return true;
  const time = formatRemaining(remaining);
  const label = formName === "contact" ? "message" : "request";
  showToast(`You've already sent a ${label} recently. Please try again in ${time}.`, "info");
  return false;
}

const menuToggle = document.getElementById("menuToggle");
const mobileSidebar = document.getElementById("mobileSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarClose = document.getElementById("sidebarClose");

function openSidebar() {
  mobileSidebar.classList.remove("translate-x-full");
  mobileSidebar.setAttribute("aria-hidden", "false");
  sidebarOverlay.classList.remove("hidden");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}
function closeSidebar() {
  mobileSidebar.classList.add("translate-x-full");
  mobileSidebar.setAttribute("aria-hidden", "true");
  sidebarOverlay.classList.add("hidden");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
menuToggle.addEventListener("click", openSidebar);
sidebarClose.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);
document
  .querySelectorAll("#mobileSidebar a")
  .forEach((a) => a.addEventListener("click", closeSidebar));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSidebar();
});

const sections = ["about", "skills", "work", "github", "now", "faq", "contact"].map((id) =>
  document.getElementById(id),
);
const navLinks = document.querySelectorAll("[data-nav]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.toggle("active", l.dataset.nav === entry.target.id));
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
sections.forEach((s) => s && observer.observe(s));

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!checkRateLimit("contact")) return;

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner"></span>Sending…`;

  const name = document.getElementById("cf-name").value;
  const email = document.getElementById("cf-email").value;
  const msg = document.getElementById("cf-msg").value;

  const result = await notifyTelegram(
    `📬 New portfolio contact\nName: ${name}\nEmail: ${email}\nMessage: ${msg}`,
  );

  submitBtn.disabled = false;
  submitBtn.innerHTML = originalHTML;

  if (result.ok) {
    markRateLimit("contact");
    showToast("Message sent successfully", "success");
    e.target.reset();
  } else {
    const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
    window.location.href = `mailto:amin0xa1b@gmail.com?subject=${encodeURIComponent(
      "Portfolio contact from " + name,
    )}&body=${body}`;
  }
});

// Resume dialog — track (backend/frontend) then language (en/fa), handled from one object
const resumeLinks = {
  backend: {
    en: "src/assets/resume/backend-en.pdf",
    fa: "src/assets/resume/backend-fa.pdf",
  },
  frontend: {
    en: "src/assets/resume/frontend-en.pdf",
    fa: "src/assets/resume/frontend-fa.pdf",
  },
};

const resumeOverlay = document.getElementById("resumeOverlay");
const resumeStep1 = document.getElementById("resumeStep1");
const resumeStep2 = document.getElementById("resumeStep2");
const resumeStep2Sub = document.getElementById("resumeStep2Sub");
let selectedTrack = null;

function openResumeDialog() {
  selectedTrack = null;
  resumeStep1.classList.remove("hidden");
  resumeStep2.classList.add("hidden");
  resumeOverlay.classList.remove("hidden");
  resumeOverlay.classList.add("flex");
  document.body.style.overflow = "hidden";
}
function closeResumeDialog() {
  resumeOverlay.classList.add("hidden");
  resumeOverlay.classList.remove("flex");
  document.body.style.overflow = "";
}

["resumeBtnHeader", "resumeBtnHero", "resumeBtnMobile"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", openResumeDialog);
});
document.getElementById("resumeClose").addEventListener("click", closeResumeDialog);
resumeOverlay.addEventListener("click", (e) => {
  if (e.target === resumeOverlay) closeResumeDialog();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeResumeDialog();
});

document.querySelectorAll(".resume-track").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedTrack = btn.dataset.track;
    const label = selectedTrack === "backend" ? "Backend" : "Frontend";
    resumeStep2Sub.textContent = `${label} resume — pick a language.`;
    resumeStep1.classList.add("hidden");
    resumeStep2.classList.remove("hidden");
  });
});

document.getElementById("resumeBack").addEventListener("click", () => {
  resumeStep2.classList.add("hidden");
  resumeStep1.classList.remove("hidden");
});

document.querySelectorAll(".resume-lang").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    const url = resumeLinks[selectedTrack] && resumeLinks[selectedTrack][lang];
    closeResumeDialog();
    if (url) window.open(url, "_blank");
  });
});

document.querySelectorAll(".faq-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panel = trigger.nextElementSibling;
    const open = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!open));
    panel.classList.toggle("hidden", open);
    trigger.querySelector(".faq-icon").className =
      "faq-icon bi text-muted-foreground " + (open ? "bi-plus" : "bi-dash");
  });
});

fetch("https://api.github.com/users/aydope")
  .then((r) => {
    if (!r.ok) throw new Error("bad response");
    return r.json();
  })
  .then((data) => {
    document.getElementById("gh-repos").textContent = data.public_repos ?? "—";
    document.getElementById("gh-followers").textContent = data.followers ?? "—";
    document.getElementById("gh-following").textContent = data.following ?? "—";
    if (data.created_at) {
      document.getElementById("gh-since").textContent = new Date(data.created_at).getFullYear();
    }
  })
  .catch(() => {
    document.getElementById("gh-error").classList.remove("hidden");
  });

const lines = [
  { text: "$ whoami", pause: 350 },
  { text: "amin@aydope — full-stack developer", pause: 500, muted: false },
  { text: "", pause: 150 },
  { text: "$ cat stack.json", pause: 350 },
  { text: "  frontend  react · typescript · tailwind", pause: 250 },
  { text: "  backend   node · express · fastify · mongodb", pause: 250 },
  { text: "  learning  nest.js", pause: 500 },
  { text: "", pause: 150 },
  { text: "$ status", pause: 350 },
  { text: "open to new opportunities ●", pause: 0 },
];

const termEl = document.getElementById("terminal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

async function typeTerminal() {
  if (reduceMotion) {
    termEl.textContent = lines.map((l) => l.text).join("\n");
    return;
  }
  let output = "";
  for (const line of lines) {
    for (const ch of line.text) {
      output += ch;
      termEl.textContent = output;
      await new Promise((r) => setTimeout(r, 12));
    }
    output += "\n";
    termEl.textContent = output;
    await new Promise((r) => setTimeout(r, line.pause));
  }
  termEl.classList.add("terminal-caret");
}
typeTerminal();

let refreshing = false;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((registration) => {
        if (registration.waiting) {
          showUpdateModal(registration.waiting);
        }

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              showUpdateModal(newWorker);
            }
          });
        });

        registration.update();
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") registration.update();
        });
        setInterval(() => registration.update(), 5 * 60 * 1000);
      })
      .catch((err) => {
        console.error("[PWA] registration failed:", err);
      });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
} else {
  console.error("[PWA] this browser has no serviceWorker support");
}

const updateOverlay = document.getElementById("updateOverlay");
const updateReloadBtn = document.getElementById("updateReloadBtn");
const updateReloadSpinner = document.getElementById("updateReloadSpinner");
const updateReloadLabel = document.getElementById("updateReloadLabel");
const updateLaterBtn = document.getElementById("updateLaterBtn");
let pendingWorker = null;
let updateAvailable = false;

function showUpdateModal(worker) {
  pendingWorker = worker;
  updateAvailable = true;
  hideInstallBanner();
  updateOverlay.classList.remove("hidden");
  updateOverlay.classList.add("flex");
}
function hideUpdateModal() {
  updateOverlay.classList.add("hidden");
  updateOverlay.classList.remove("flex");
}
updateReloadBtn.addEventListener("click", () => {
  updateReloadBtn.disabled = true;
  updateLaterBtn.disabled = true;
  updateReloadSpinner.classList.remove("hidden");
  updateReloadLabel.textContent = "Updating…";
  if (pendingWorker) {
    pendingWorker.postMessage("SKIP_WAITING");
    setTimeout(() => {
      if (!refreshing) window.location.reload();
    }, 4000);
  } else {
    window.location.reload();
  }
});
updateLaterBtn.addEventListener("click", hideUpdateModal);

const consultOverlay = document.getElementById("consultOverlay");
const consultClose = document.getElementById("consultClose");
const consultForm = document.getElementById("consultForm");

function openConsultDialog() {
  consultOverlay.classList.remove("hidden");
  consultOverlay.classList.add("flex");
  document.body.style.overflow = "hidden";
}
function closeConsultDialog() {
  consultOverlay.classList.add("hidden");
  consultOverlay.classList.remove("flex");
  document.body.style.overflow = "";
}
["consultBtnHero", "consultBtnContact"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", openConsultDialog);
});
consultClose.addEventListener("click", closeConsultDialog);
consultOverlay.addEventListener("click", (e) => {
  if (e.target === consultOverlay) closeConsultDialog();
});

consultForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!checkRateLimit("consult")) return;

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner"></span>Sending…`;

  const name = document.getElementById("consult-name").value;
  const phone = document.getElementById("consult-phone").value;
  const area = document.getElementById("consult-area").value;

  const result = await notifyTelegram(
    `💬 New consultation request\nName: ${name}\nPhone: ${phone}\nWork area: ${area}`,
  );

  submitBtn.disabled = false;
  submitBtn.innerHTML = originalHTML;

  closeConsultDialog();

  if (result.ok) {
    markRateLimit("consult");
    showToast("Request sent successfully", "success");
    consultForm.reset();
  } else {
    const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nWork area: ${area}`);
    window.location.href = `mailto:amin0xa1b@gmail.com?subject=${encodeURIComponent(
      "Consultation request from " + name,
    )}&body=${body}`;
  }
});

const installBanner = document.getElementById("installBanner");
const installBtn = document.getElementById("installBtn");
const installDismiss = document.getElementById("installDismiss");
const installClose = document.getElementById("installClose");
const INSTALL_SNOOZE_KEY = "aydope-install-snoozed-until";
let deferredInstallPrompt = null;

function installBannerSnoozed() {
  const until = Number(localStorage.getItem(INSTALL_SNOOZE_KEY) || 0);
  return Date.now() < until;
}
function snoozeInstallBanner(days) {
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem(INSTALL_SNOOZE_KEY, String(until));
}
function hideInstallBanner() {
  installBanner.classList.add("hidden");
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (!updateAvailable && !installBannerSnoozed()) {
    installBanner.classList.remove("hidden");
  }
});

installBtn.addEventListener("click", async () => {
  hideInstallBanner();
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
});
installDismiss.addEventListener("click", () => {
  hideInstallBanner();
  snoozeInstallBanner(7);
});
installClose.addEventListener("click", () => {
  hideInstallBanner();
  snoozeInstallBanner(7);
});
window.addEventListener("appinstalled", () => {
  hideInstallBanner();
  deferredInstallPrompt = null;
});
