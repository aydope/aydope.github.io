(function () {
  const portfolioData = [
    {
      id: "snakid",
      title: "Snakid",
      subtitle: "Classic Snake Game",
      description:
        "A modern take on the classic Snake game with smooth animations, mobile-friendly touch controls, swipe gestures, and real-time FPS counter. Built with HTML5 Canvas and jQuery.",
      technologies: ["HTML5", "CSS3", "Tailwind CSS", "jQuery", "Canvas API"],
      features: [
        "Smooth 60 FPS gameplay",
        "Mobile-friendly touch controls",
        "Swipe gesture support",
        "Keyboard controls (WASD/Arrow keys)",
        "High score saved locally",
        "Responsive design",
      ],
      images: ["src/assets/images/image2.png", "src/assets/images/image3.png"],
      link: "https://aydope.github.io/Snakid/",
      thumbnail: "src/assets/images/image1.png",
      color: "#030712",
    },
  ];

  const testimonialsData = [
    {
      text: "Aydope delivered a clean API and polished UI. Great junior talent!",
      author: "John Doe",
      role: "Tech Lead",
      initial: "J",
      rating: 5,
    },
    {
      text: "Very dedicated to best practices. A pleasure to work with.",
      author: "Jane Doe",
      role: "Senior Developer",
      initial: "J",
      rating: 5,
    },
  ];

  function renderSkills() {
    const container = document.getElementById("skillsGrid");
    if (!container) return;

    // Skills data - based on actual skills
    const skills = [
      { name: "HTML", level: "intermediate", icon: "bi-filetype-html" },
      { name: "CSS", level: "intermediate", icon: "bi-filetype-css" },
      { name: "JavaScript", level: "advanced", icon: "bi-filetype-js" },
      { name: "TypeScript", level: "advanced", icon: "bi-filetype-tsx" },
      { name: "React", level: "beginner", icon: "bi-react" },
      { name: "Node.js", level: "intermediate", icon: "bi-node-plus" },
      { name: "Express.js", level: "advanced", icon: "bi-diagram-3" },
      { name: "Fastify", level: "advanced", icon: "bi-lightning-charge" },
      { name: "Nest.js", level: "beginner", icon: "bi-box" },
      { name: "MongoDB", level: "intermediate", icon: "bi-database" },
      { name: "Git", level: "advanced", icon: "bi-git" },
      { name: "GitHub", level: "advanced", icon: "bi-github" },
      { name: "GitLab", level: "advanced", icon: "bi-gitlab" },
      { name: "REST APIs", level: "advanced", icon: "bi-globe2" },
      { name: "PWA", level: "advanced", icon: "bi-phone" },
      { name: "WebSocket", level: "intermediate", icon: "bi-ethernet" },
      { name: "Socket.io", level: "intermediate", icon: "bi-chat-dots" },
      { name: "Service Workers", level: "learning", icon: "bi-gear" },
      { name: "Sequelize", level: "beginner", icon: "bi-stack" },
    ];

    // Level colors
    const levelColors = {
      expert: "#10b981",
      advanced: "#0ea5e9",
      intermediate: "#f59e0b",
      beginner: "#f97316",
      learning: "#6366f1",
    };

    // Render skills
    container.innerHTML = skills
      .map(
        (skill) => `
            <div class="skill-card">
              <span class="skill-dot" style="background: ${levelColors[skill.level]}; color: ${levelColors[skill.level]};"></span>
              <i class="bi ${skill.icon} text-sm" style="color: ${levelColors[skill.level]}; opacity: 0.8;"></i>
              <span class="skill-name">${skill.name}</span>
            </div>
          `,
      )
      .join("");
  }

  function renderPortfolio() {
    const c = document.getElementById("portfolioGrid");
    if (!c) return;
    if (portfolioData.length === 0) {
      c.innerHTML = `<div class="col-span-full text-center py-16 opacity-50"><i class="bi bi-folder2-open text-5xl block mb-3"></i><p>No projects yet</p></div>`;
      return;
    }
    c.innerHTML = portfolioData
      .map(
        (p) => `
          <div class="project-card-new group cursor-pointer" data-project-id="${p.id}">
            <div class="card-image" style="background-image:url('${p.thumbnail}')"></div>
            <div class="p-5 flex flex-col flex-grow">
              <div class="flex items-center gap-2 mb-2"><span class="w-2 h-2 rounded-full" style="background:${p.color || "#0ea5e9"}"></span><span class="text-xs text-white/30">${p.technologies[0]}</span></div>
              <h3 class="font-bold text-lg mb-1 group-hover:text-sky-400 transition">${p.title}</h3>
              <p class="text-white/40 text-xs mb-4 flex-grow">${p.subtitle}</p>
              <div class="flex items-center justify-between"><span class="text-xs text-sky-400 font-medium flex items-center gap-1">Details <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i></span><span class="text-[10px] text-white/20">${p.technologies.length} techs</span></div>
            </div>
          </div>`,
      )
      .join("");
  }

  function renderTestimonials() {
    const c = document.getElementById("testimonialsGrid");
    if (!c) return;
    if (testimonialsData.length === 0) {
      c.innerHTML = `<div class="col-span-full text-center py-16 opacity-50"><i class="bi bi-chat-square-text text-5xl block mb-3"></i><p>No testimonials yet</p></div>`;
      return;
    }
    c.innerHTML = testimonialsData
      .map(
        (t) => `
          <div class="liquid-glass !rounded-[1.5rem] p-6 relative group">
            <div class="flex gap-0.5 mb-3 text-sky-400 text-sm">${'<i class="bi bi-star-fill"></i>'.repeat(t.rating || 5)}</div>
            <i class="bi bi-quote text-4xl text-sky-400/10 absolute top-4 right-4"></i>
            <p class="text-sm italic leading-relaxed text-white/60 mb-4">"${t.text}"</p>
            <div class="flex items-center gap-2.5 mt-auto pt-3 border-t border-white/5"><div class="w-9 h-9 rounded-full bg-sky-400/10 flex items-center justify-center text-sky-400 text-xs font-bold">${t.initial}</div><div><span class="text-sm font-medium">${t.author}</span><br><span class="text-white/30 text-xs">${t.role}</span></div></div>
          </div>`,
      )
      .join("");
  }

  function openProjectModal(pid) {
    const p = portfolioData.find((x) => x.id === pid);
    if (!p) return;
    const m = document.getElementById("projectModal"),
      ct = document.getElementById("projectModalContent");
    ct.innerHTML = `<div class="h-56 md:h-64 bg-cover bg-center relative" style="background-image:url('${p.images[0]}')"><div class="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent"></div></div><div class="p-6"><h3 class="text-2xl font-bold mb-1">${p.title}</h3><p class="text-sky-400 text-sm mb-4">${p.subtitle}</p><p class="text-white/60 text-sm leading-relaxed mb-5">${p.description}</p><div class="mb-5"><h4 class="text-xs uppercase tracking-wider text-white/30 mb-2">Technologies</h4><div class="flex flex-wrap gap-2">${p.technologies.map((t) => `<span class="text-[11px] bg-sky-400/10 text-sky-400 px-2.5 py-1 rounded-full">${t}</span>`).join("")}</div></div><div class="mb-5"><h4 class="text-xs uppercase tracking-wider text-white/30 mb-2">Features</h4><ul class="space-y-1.5 text-sm text-white/50">${p.features.map((f) => `<li class="flex items-start gap-2"><i class="bi bi-check2 text-sky-400 mt-0.5"></i> ${f}</li>`).join("")}</ul></div>${p.images.length > 1 ? `<div class="mb-5"><h4 class="text-xs uppercase tracking-wider text-white/30 mb-2">Screenshots</h4><div class="grid grid-cols-2 gap-2">${p.images.map((i) => `<div class="h-24 rounded-lg bg-cover bg-center" style="background-image:url('${i}')"></div>`).join("")}</div></div>` : ""}<a href="${p.link}" target="_blank" class="btn-primary text-sm w-full justify-center mt-2">View Live Project <i class="bi bi-box-arrow-up-right"></i></a></div>`;
    m.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function init() {
    renderSkills();
    renderPortfolio();
    renderTestimonials();

    const typingEl = document.getElementById("typing-text");
    const words = ["scalable", "modern", "robust", "elegant"];
    let wi = 0,
      ci = 0,
      del = false;
    function type() {
      if (!typingEl) return;
      const cur = words[wi];
      typingEl.textContent = cur.substring(0, ci);
      if (!del && ci < cur.length) {
        ci++;
        setTimeout(type, 100);
      } else if (del && ci > 0) {
        ci--;
        setTimeout(type, 50);
      } else if (!del && ci === cur.length) {
        del = true;
        setTimeout(type, 1800);
      } else {
        del = false;
        wi = (wi + 1) % words.length;
        setTimeout(type, 400);
      }
    }
    type();

    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            document.querySelectorAll(".counter").forEach((c) => {
              const t = parseInt(c.dataset.target);
              let n = 0;
              const iv = setInterval(() => {
                if (n >= t) {
                  clearInterval(iv);
                  c.textContent = t;
                } else {
                  n += Math.max(1, Math.ceil(t / 30));
                  c.textContent = n;
                }
              }, 30);
            });
            co.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );
    document.querySelectorAll(".counter").forEach((c) => co.observe(c));

    document
      .getElementById("portfolioGrid")
      ?.addEventListener("click", function (e) {
        const card = e.target.closest(".project-card-new");
        if (card) openProjectModal(card.dataset.projectId);
      });
    document
      .getElementById("closeProjectModal")
      ?.addEventListener("click", () => {
        document.getElementById("projectModal").classList.remove("active");
        document.body.style.overflow = "";
      });

    function om(id) {
      document.getElementById(id).classList.add("active");
    }
    function cm(id) {
      document.getElementById(id).classList.remove("active");
    }
    document
      .getElementById("hire-btn-header")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        om("hireModal");
      });
    document.getElementById("hire-sidebar")?.addEventListener("click", (e) => {
      e.preventDefault();
      om("hireModal");
      closeDesktopSidebar();
    });
    document
      .getElementById("hire-btn-contact")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        om("hireModal");
      });
    document.getElementById("resume-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      om("resumeModal");
    });
    document
      .getElementById("closeHireModal")
      ?.addEventListener("click", () => cm("hireModal"));
    document
      .getElementById("closeResumeModal")
      ?.addEventListener("click", () => cm("resumeModal"));
    document.querySelectorAll(".modal-overlay").forEach((m) =>
      m.addEventListener("click", function (e) {
        if (e.target === this) {
          this.classList.remove("active");
          document.body.style.overflow = "";
        }
      }),
    );

    function openDesktopSidebar() {
      document.getElementById("desktopSidebar").classList.add("open");
      document.getElementById("sidebarOverlay").classList.add("active");
    }
    function closeDesktopSidebar() {
      document.getElementById("desktopSidebar").classList.remove("open");
      document.getElementById("sidebarOverlay").classList.remove("active");
    }
    document
      .getElementById("menuToggle")
      ?.addEventListener("click", openDesktopSidebar);
    document
      .getElementById("closeSidebar")
      ?.addEventListener("click", closeDesktopSidebar);
    document
      .getElementById("sidebarOverlay")
      ?.addEventListener("click", closeDesktopSidebar);
    document.querySelectorAll(".sidebar-link").forEach((l) => {
      l.addEventListener("click", function (e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute("href"));
        if (t) {
          closeDesktopSidebar();
          setTimeout(
            () =>
              window.scrollTo({
                top: t.offsetTop - 70,
                behavior: "smooth",
              }),
            300,
          );
        }
      });
    });
    document.querySelectorAll(".section-dot").forEach((d) => {
      d.addEventListener("click", function () {
        const t = document.getElementById(this.dataset.section);
        if (t) window.scrollTo({ top: t.offsetTop - 70, behavior: "smooth" });
      });
    });

    const sb = document.getElementById("scrollTopBtn");
    sb?.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
    window.addEventListener("scroll", () => {
      if (sb) sb.style.display = window.scrollY > 400 ? "flex" : "none";
      let cur = "";
      document.querySelectorAll("section").forEach((s) => {
        const top = s.offsetTop - 120;
        if (window.scrollY >= top && window.scrollY <= top + s.offsetHeight)
          cur = s.id;
      });
      document
        .querySelectorAll(".section-dot")
        .forEach((d) =>
          d.classList.toggle("active", d.dataset.section === cur),
        );
    });

    // STICKY HEADER ANIMATION
    const mainHeader = document.getElementById("mainHeader");
    let lastScroll = 0;
    let scrollTimeout;

    window.addEventListener(
      "scroll",
      () => {
        const currentScroll = window.scrollY;

        if (currentScroll <= 0) {
          mainHeader.classList.remove("header-hidden", "header-scrolled");
          return;
        }

        if (currentScroll > lastScroll && currentScroll > 200) {
          mainHeader.classList.add("header-hidden");
          mainHeader.classList.remove("header-scrolled");
        } else if (currentScroll < lastScroll) {
          mainHeader.classList.remove("header-hidden");
          if (currentScroll > 100) {
            mainHeader.classList.add("header-scrolled");
          } else {
            mainHeader.classList.remove("header-scrolled");
          }
        }

        lastScroll = currentScroll;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (
            currentScroll > 100 &&
            !mainHeader.classList.contains("header-hidden")
          ) {
            mainHeader.classList.add("header-scrolled");
          }
        }, 100);
      },
      { passive: true },
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document
          .querySelectorAll(".modal-overlay")
          .forEach((m) => m.classList.remove("active"));
        closeDesktopSidebar();
        document.body.style.overflow = "";
      }
    });
    window.dispatchEvent(new Event("scroll"));
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
