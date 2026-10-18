(() => {
  const grid = document.getElementById("projectGrid");
  const overlay = document.getElementById("projectOverlay");
  const closeBtn = document.getElementById("projectClose");
  const parts = {
    icon: document.getElementById("projectIcon"),
    kind: document.getElementById("projectKind"),
    title: document.getElementById("projectTitle"),
    preview: document.getElementById("projectPreview"),
    description: document.getElementById("projectDescription"),
    highlights: document.getElementById("projectHighlights"),
    stack: document.getElementById("projectStack"),
    links: document.getElementById("projectLinks"),
  };
  let lastTrigger = null;

  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const badges = (items) => items.map((x) => `<span class="badge">${esc(x)}</span>`).join("");

  grid.innerHTML = PROJECTS.map(
    (
      p,
    ) => `<button type="button" class="card p-6 text-left flex flex-col hover:bg-muted transition focus-visible:ring-2 focus-visible:ring-ring" data-slug="${esc(p.slug)}" aria-haspopup="dialog">
      <div class="flex items-center justify-between mb-4">
        <span class="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-accent"><i class="bi ${esc(p.icon)}"></i></span>
        <span class="badge">${esc(p.kind)}</span>
      </div>
      <h3 class="font-semibold text-lg mb-2">${esc(p.name)}</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-4">${esc(p.summary)}</p>
      <div class="flex flex-wrap gap-1.5 mb-5">${badges(p.stack)}</div>
      <span class="mt-auto inline-flex items-center gap-1.5 text-sm font-medium">View details <i class="bi bi-arrow-right"></i></span>
    </button>`,
  ).join("");

  function previewMarkup(p) {
    if (p.demo && p?.showDemoAsIframe) {
      return `<iframe src="${esc(p.demo)}" title="${esc(p.name)} live preview" class="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`;
    }
    if (p.image) {
      return `<img src="${esc(p.image)}" alt="${esc(p.name)} screenshot" class="w-full h-full object-cover object-top">`;
    }
    return `<div class="h-full flex items-center justify-center px-6 text-center text-sm text-muted-foreground">No live preview yet. The source code is linked below.</div>`;
  }

  function openProject(p, trigger) {
    lastTrigger = trigger;
    parts.icon.className = `bi ${p.icon}`;
    parts.kind.textContent = p.kind;
    parts.title.textContent = p.name;
    parts.description.textContent = p.description;
    parts.highlights.innerHTML = p.highlights.map((x) => `<li>${esc(x)}</li>`).join("");
    parts.stack.innerHTML = badges(p.stack);
    parts.preview.innerHTML = previewMarkup(p);
    parts.links.innerHTML = [
      p.demo &&
        `<a href="${esc(p.demo)}" class="btn btn-primary" target="_blank" rel="noopener noreferrer"><span>Open live demo</span><i class="bi bi-arrow-up-right"></i></a>`,
      p.repo &&
        `<a href="${esc(p.repo)}" class="btn btn-outline" target="_blank" rel="noopener noreferrer"><span>Source code</span><i class="bi bi-github"></i></a>`,
    ]
      .filter(Boolean)
      .join("");

    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeProject() {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
    document.body.style.overflow = "";
    parts.preview.innerHTML = "";
    if (lastTrigger) lastTrigger.focus();
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-slug]");
    if (btn)
      openProject(
        PROJECTS.find((p) => p.slug === btn.dataset.slug),
        btn,
      );
  });
  closeBtn.addEventListener("click", closeProject);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeProject();
  });
  document.addEventListener("keydown", (e) => {
    if (overlay.classList.contains("hidden")) return;
    if (e.key === "Escape") return closeProject();
    if (e.key !== "Tab") return;
    const items = [...overlay.querySelectorAll("a[href], button:not([disabled])")];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Built from PROJECTS so the structured data never drifts from what the page shows.
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projects by Amin Sadeghi",
    itemListElement: PROJECTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: p.name,
        description: p.summary,
        programmingLanguage: p.stack,
        codeRepository: p.repo || undefined,
        url: p.demo ? new URL(p.demo, "https://aydope.github.io/").href : p.repo || undefined,
        author: { "@id": "https://aydope.github.io/#person" },
      },
    })),
  });
  document.head.appendChild(ld);
})();
