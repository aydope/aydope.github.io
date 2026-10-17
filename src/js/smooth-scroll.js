// Lenis-style inertial scrolling for mouse wheels and anchor links. Touch devices and
// users who prefer reduced motion keep native scrolling.
(() => {
  const LERP = 0.1;
  const root = document.documentElement;
  const wantsSmooth =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!wantsSmooth) return;

  // The CSS smooth behavior would animate every scrollTo call and fight the loop.
  root.style.scrollBehavior = "auto";

  let current = window.scrollY;
  let target = current;
  let lastSet = current;
  let lastTime = 0;
  let frame = 0;

  const clamp = (y) =>
    Math.min(Math.max(y, 0), Math.max(root.scrollHeight - window.innerHeight, 0));

  function step(time) {
    // Scrollbar drag, keyboard or find-in-page moved the page: stop and follow it.
    if (Math.abs(window.scrollY - lastSet) > 2) {
      current = target = window.scrollY;
      frame = 0;
      return;
    }
    const dt = Math.min(time - lastTime, 50);
    lastTime = time;
    current += (target - current) * (1 - Math.pow(1 - LERP, dt / 16.67));
    if (Math.abs(target - current) < 0.5) current = target;
    window.scrollTo(0, current);
    lastSet = window.scrollY;
    frame = current === target ? 0 : requestAnimationFrame(step);
  }

  function start() {
    if (frame) return;
    current = lastSet = window.scrollY;
    lastTime = performance.now();
    frame = requestAnimationFrame(step);
  }

  // Let inner scroll areas (modals, textareas) handle their own wheel events.
  function scrollsInside(el, deltaY) {
    for (; el && el !== document.body; el = el.parentElement) {
      if (!/(auto|scroll)/.test(getComputedStyle(el).overflowY)) continue;
      if (el.scrollHeight <= el.clientHeight) continue;
      const canGoDown = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
      if (deltaY > 0 ? canGoDown : el.scrollTop > 0) return true;
    }
    return false;
  }

  window.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey || e.shiftKey || e.defaultPrevented) return;
      if (document.body.style.overflow === "hidden") return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (scrollsInside(e.target, e.deltaY)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1;
      target = clamp((frame ? target : window.scrollY) + e.deltaY * unit);
      start();
    },
    { passive: false },
  );

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey)
      return;
    const section =
      link.hash.length > 1 && document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!section) return;
    e.preventDefault();
    const header = document.querySelector("header");
    target = clamp(
      section.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0),
    );
    history.pushState(null, "", link.hash);
    section.setAttribute("tabindex", "-1");
    section.focus({ preventScroll: true });
    start();
  });

  window.addEventListener("scroll", () => {
    if (!frame) current = target = window.scrollY;
  });
  window.addEventListener("resize", () => {
    target = clamp(target);
  });
})();
