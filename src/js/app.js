// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile sidebar
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

// Active nav highlighting
const sections = [
  "about",
  "skills",
  "work",
  "github",
  "now",
  "faq",
  "contact",
].map((id) => document.getElementById(id));
const navLinks = document.querySelectorAll("[data-nav]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) =>
          l.classList.toggle("active", l.dataset.nav === entry.target.id),
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
sections.forEach((s) => s && observer.observe(s));

// Contact form -> mailto
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("cf-name").value;
  const email = document.getElementById("cf-email").value;
  const msg = document.getElementById("cf-msg").value;
  const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
  window.location.href = `mailto:amin0xa1b@gmail.com?subject=${encodeURIComponent("Portfolio contact from " + name)}&body=${body}`;
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
document
  .getElementById("resumeClose")
  .addEventListener("click", closeResumeDialog);
resumeOverlay.addEventListener("click", (e) => {
  if (e.target === resumeOverlay) closeResumeDialog();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeResumeDialog();
});

document.querySelectorAll(".resume-track").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedTrack = btn.dataset.track;
    resumeStep2Sub.textContent = `${selectedTrack === "backend" ? "Backend" : "Frontend"} resume — pick a language.`;
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

// FAQ accordion
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

// GitHub stats — live from the public API
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
      document.getElementById("gh-since").textContent = new Date(
        data.created_at,
      ).getFullYear();
    }
  })
  .catch(() => {
    document.getElementById("gh-error").classList.remove("hidden");
  });

// Terminal typewriter — single orchestrated hero animation
const lines = [
  { text: "$ whoami", pause: 350 },
  {
    text: "amin@aydope — mern developer",
    pause: 500,
    muted: false,
  },
  { text: "", pause: 150 },
  { text: "$ cat stack.json", pause: 350 },
  { text: "  frontend  react · typescript · tailwind", pause: 250 },
  { text: "  backend   node · express · mongodb", pause: 250 },
  { text: "  learning  nest.js · fastify", pause: 500 },
  { text: "", pause: 150 },
  { text: "$ status", pause: 350 },
  { text: "open to new opportunities ●", pause: 0 },
];

const termEl = document.getElementById("terminal");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

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

// PWA — register service worker + handle version updates
let refreshing = false;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("src/js/sw.js")
      .then((registration) => {
        // An update was already found and is waiting (e.g. user reopened the tab)
        if (registration.waiting) {
          showUpdateModal(registration.waiting);
        }

        // A new service worker is being installed right now
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            // "installed" + an existing controller means this is an update,
            // not the very first install
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              showUpdateModal(newWorker);
            }
          });
        });
      })
      .catch(() => {
        /* offline support is a progressive enhancement — fail silently */
      });

    // Reload once the new service worker takes control
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

const updateOverlay = document.getElementById("updateOverlay");
const updateReloadBtn = document.getElementById("updateReloadBtn");
const updateLaterBtn = document.getElementById("updateLaterBtn");
let pendingWorker = null;

function showUpdateModal(worker) {
  pendingWorker = worker;
  updateOverlay.classList.remove("hidden");
  updateOverlay.classList.add("flex");
}
function hideUpdateModal() {
  updateOverlay.classList.add("hidden");
  updateOverlay.classList.remove("flex");
}
updateReloadBtn.addEventListener("click", () => {
  if (pendingWorker) pendingWorker.postMessage("SKIP_WAITING");
  hideUpdateModal();
});
updateLaterBtn.addEventListener("click", hideUpdateModal);

// PWA — custom install prompt
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
  if (!installBannerSnoozed()) {
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
