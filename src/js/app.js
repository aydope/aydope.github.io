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

  const isSuccess = type === "success";
  const isError = type === "error";

  const borderColor = isSuccess
    ? "border-l-emerald-400"
    : isError
      ? "border-l-red-400"
      : "border-l-amber-400";

  const iconColor = isSuccess ? "text-emerald-400" : isError ? "text-red-400" : "text-amber-400";

  const icon = isSuccess
    ? "bi-check-circle-fill"
    : isError
      ? "bi-x-circle-fill"
      : "bi-info-circle-fill";

  const toast = document.createElement("div");
  toast.id = "app-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]
    w-[92%] max-w-sm
    bg-card border border-border ${borderColor} border-l-4
    rounded-lg shadow-2xl shadow-black/40
    px-4 py-3.5
    flex items-start gap-3
    opacity-0 translate-y-4 transition-all duration-300 ease-out`;

  toast.innerHTML = `
    <i class="bi ${icon} ${iconColor} text-lg shrink-0 mt-0.5"></i>
    <div class="flex-1 min-w-0">
      <p class="text-sm text-foreground leading-relaxed break-words">${message}</p>
    </div>
    <button class="btn-ghost !h-6 !w-6 !p-0 shrink-0 -mt-0.5" aria-label="Close">
      <i class="bi bi-x-lg text-xs"></i>
    </button>
  `;
  document.body.appendChild(toast);

  const dismiss = () => {
    toast.classList.add("opacity-0", "translate-y-4");
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector("button").addEventListener("click", dismiss);
  requestAnimationFrame(() => toast.classList.remove("opacity-0", "translate-y-4"));

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
  const lang = document.documentElement.lang === "fa" ? "fa" : "en";
  if (lang === "fa") {
    if (hours > 0) return `${hours} ساعت و ${minutes} دقیقه`;
    return `${minutes} دقیقه`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function checkRateLimit(formName) {
  const remaining = getRemainingRateLimit(formName);
  if (remaining <= 0) return true;
  const time = formatRemaining(remaining);
  const key = formName === "contact" ? "contact.rateLimited" : "consult.rateLimited";
  showToast(t(key).replace("{time}", time), "info");
  return false;
}

const LANG_KEY = "aydope-lang";
const translations = {
  en: {
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.education": "Education",
    "nav.work": "Work",
    "nav.github": "GitHub",
    "nav.now": "Now",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "header.resume": "Resume",
    "header.getInTouch": "Get in touch",
    "resume.title": "Which resume?",
    "resume.subtitle": "Pick the version that fits the role.",
    "resume.backend": "Backend",
    "resume.frontend": "Frontend",
    "resume.back": "Back",
    "resume.step2Title": "Choose a language",
    "resume.step2SubBackend": "Backend resume — pick a language.",
    "resume.step2SubFrontend": "Frontend resume — pick a language.",
    "install.title": "Install this app",
    "install.desc": "Add Aydope to your home screen for quick, offline-friendly access.",
    "install.install": "Install",
    "install.notNow": "Not now",
    "update.title": "A new version is available",
    "update.desc": "This site was updated. Reload to get the latest version.",
    "update.reload": "Reload now",
    "update.later": "Later",
    "consult.title": "Request a consultation",
    "consult.desc":
      "Tell me a bit about it — this opens your email client so you can review and send.",
    "consult.name": "Name",
    "consult.phone": "Phone",
    "consult.area": "Work area",
    "consult.areaSelect": "Select an area",
    "consult.area1": "Frontend development",
    "consult.area2": "Backend development",
    "consult.area3": "Full-stack project",
    "consult.area4": "API / backend consulting",
    "consult.area5": "Other",
    "consult.send": "Send request",
    "consult.sending": "Sending…",
    "consult.sentViaTelegram": "Request sent successfully",
    "consult.rateLimited": "You've already sent a request recently. Please try again in {time}.",
    "contact.sending": "Sending…",
    "contact.sentViaTelegram": "Message sent successfully",
    "contact.rateLimited": "You've already sent a message recently. Please try again in {time}.",
    "hero.badge": "Open to full-stack roles",
    "hero.h1": "Amin Sadeghi, a full-stack developer working in the MERN stack.",
    "hero.p":
      "I build web applications end to end — REST APIs and data models on the back end, React interfaces on the front end. Based in Iran, currently learning Nest.js to go deeper on structured, production-style back ends.",
    "hero.viewProjects": "View projects",
    "hero.viewResume": "View resume",
    "hero.requestConsult": "Request consultation",
    "about.h2": "About",
    "about.p1":
      "I'm Amin, a web developer from Iran who enjoys building things end to end. I work across both front end and back end, and I've spent more time on the back end — it's where I'm most comfortable.",
    "about.p2":
      "I don't have professional work experience yet, so my focus is continuous, hands-on learning — every project I build teaches me something I take into the next one.",
    "about.stat1": "year learning",
    "about.stat2": "projects built",
    "about.stat3": "learning mode",
    "about.location": "Remote / Tehran, Iran",
    "about.timeline1.title": "Building projects",
    "about.timeline1.desc":
      "Building full-stack apps with React, Node.js, Express and MongoDB — learning through hands-on, real-world projects.",
    "about.timeline2.title": "Back-end deep dive",
    "about.timeline2.desc":
      "Strengthened Express.js and Fastify, built REST APIs with proper database design in MongoDB, and I'm now learning Nest.js.",
    "about.timeline3.title": "Web dev beginnings",
    "about.timeline3.desc":
      "Started with HTML, CSS and JavaScript, and built my first static sites.",
    "skills.h2": "Skills",
    "skills.p": "Technologies I work with regularly.",
    "skills.frontend": "Frontend",
    "skills.backend": "Backend",
    "skills.restfulApi": "RESTful API Design",
    "skills.database": "Database",
    "skills.schemaDesign": "Schema Design",
    "skills.crud": "CRUD Operations",
    "skills.authSecurity": "Auth & Security",
    "skills.jwt": "JWT Authentication",
    "skills.sessionAuth": "Session-Based Auth",
    "skills.passwordHashing": "Password Hashing",
    "skills.inputValidation": "Input Validation",
    "skills.architecture": "Architecture & Patterns",
    "skills.mvc": "MVC Architecture",
    "skills.modular": "Modular Architecture",
    "skills.serviceRepo": "Service/Repository Pattern",
    "skills.singleton": "Singleton Pattern",
    "skills.errorHandling": "Centralized Error Handling",
    "skills.realtime": "Real-Time",
    "skills.toolsDeploy": "Tools & Deployment",
    "skills.other": "Other Skills",
    "skills.pwa": "Progressive Web Apps (PWA)",
    "skills.sw": "Service Workers",
    "skills.regex": "Regular Expressions (RegEx)",
    "education.h2": "Education & certificates",
    "education.p": "Self-taught, with structured courses along the way.",
    "education.item1.title": "Self-directed MERN stack study",
    "education.item1.date": "2025 — present",
    "education.item1.desc":
      "Learning full-stack development through documentation, courses and building real projects.",
    "education.item2.title": "Certificates",
    "education.item2.date": "Add yours here",
    "education.item2.desc":
      "Placeholder card — replace with any course or certificate you've completed.",
    "work.h2": "Work",
    "work.p": "A project I've been building — more in progress.",
    "work.personalProject": "Personal project",
    "work.snakidDesc":
      "An advanced todo app with a storage-management feature, built to practice state handling and persistence patterns.",
    "work.viewOnGithub": "View on GitHub",
    "work.moreTitle": "More on GitHub",
    "work.moreDesc":
      "I'm actively building new projects. Check my profile for what I'm currently working on.",
    "github.h2": "GitHub activity",
    "github.p": "Pulled live from the GitHub API.",
    "github.repos": "public repos",
    "github.followers": "followers",
    "github.following": "following",
    "github.since": "member since",
    "github.error": "Couldn't reach the GitHub API right now — refresh to try again.",
    "now.h2": "Now",
    "now.p": "What I'm focused on at the moment.",
    "now.card1.title": "Learning Nest.js",
    "now.card1.desc": "Going deeper into structured, production-style back ends.",
    "now.card2.title": "REST APIs & WebSockets",
    "now.card2.desc": "Practicing real-time features with Socket.io.",
    "now.card3.title": "Looking for my next role",
    "now.card3.desc": "Open to full-stack roles, freelance work and collaborations.",
    "faq.h2": "FAQ",
    "faq.p": "Common questions I get asked.",
    "faq.q1": "Are you available for work right now?",
    "faq.a1":
      "Yes — I'm open to full-stack roles, freelance projects and collaborations, remote or in Tehran.",
    "faq.q2": "Do you work more on frontend or backend?",
    "faq.a2":
      "Both, but I have more experience on the backend with Node.js, Express and MongoDB. I use React and Tailwind CSS for the frontend.",
    "faq.q3": "Do you have a resume I can download?",
    "faq.a3":
      'Yes — use the "Resume" button in the header or hero. You can choose a backend- or frontend-focused version, in English or Persian.',
    "faq.q4": "What's the best way to reach you?",
    "faq.a4": "Email is fastest, or send a message on LinkedIn — both are checked daily.",
    "contact.h2": "Get in touch",
    "contact.p": "Have a project in mind, or a role that fits? I'd like to hear about it.",
    "contact.orConsult": "Or request a consultation",
    "contact.form.name": "Name",
    "contact.form.namePlaceholder": "Your name",
    "contact.form.email": "Email",
    "contact.form.message": "Message",
    "contact.form.messagePlaceholder": "What are you building?",
    "contact.form.send": "Send message",
    "contact.form.note": "This opens your email client — replace with a form backend when ready.",
    "footer.rights": "Amin Sadeghi. All rights reserved.",
    "footer.builtWith": "built with tailwind, no framework",
  },
  fa: {
    "nav.about": "درباره",
    "nav.skills": "مهارت‌ها",
    "nav.education": "تحصیلات",
    "nav.work": "نمونه‌کارها",
    "nav.github": "گیت‌هاب",
    "nav.now": "الان",
    "nav.faq": "سوالات متداول",
    "nav.contact": "تماس",
    "header.resume": "رزومه",
    "header.getInTouch": "تماس بگیرید",
    "resume.title": "کدوم رزومه؟",
    "resume.subtitle": "نسخه‌ای که مناسب موقعیت شغلیه رو انتخاب کن.",
    "resume.backend": "بک‌اند",
    "resume.frontend": "فرانت‌اند",
    "resume.back": "بازگشت",
    "resume.step2Title": "زبان رو انتخاب کن",
    "resume.step2SubBackend": "رزومه‌ی بک‌اند — یه زبان انتخاب کن.",
    "resume.step2SubFrontend": "رزومه‌ی فرانت‌اند — یه زبان انتخاب کن.",
    "install.title": "این اپ رو نصب کن",
    "install.desc": "آیدوپ رو به صفحه‌ی اصلی گوشیت اضافه کن، برای دسترسی سریع‌تر و آفلاین.",
    "install.install": "نصب",
    "install.notNow": "فعلاً نه",
    "update.title": "نسخه‌ی جدیدی در دسترسه",
    "update.desc": "این سایت آپدیت شده. برای گرفتن آخرین نسخه، صفحه رو رفرش کن.",
    "update.reload": "الان رفرش کن",
    "update.later": "بعداً",
    "consult.title": "درخواست مشاوره",
    "consult.desc": "یکم درباره‌ش بگو — این کار ایمیلت رو باز می‌کنه تا بررسی و ارسال کنی.",
    "consult.name": "نام",
    "consult.phone": "شماره تماس",
    "consult.area": "حوزه‌ی کاری",
    "consult.areaSelect": "یه حوزه انتخاب کن",
    "consult.area1": "توسعه‌ی فرانت‌اند",
    "consult.area2": "توسعه‌ی بک‌اند",
    "consult.area3": "پروژه‌ی فول‌استک",
    "consult.area4": "مشاوره‌ی API / بک‌اند",
    "consult.area5": "سایر",
    "consult.send": "ارسال درخواست",
    "consult.sending": "در حال ارسال…",
    "consult.sentViaTelegram": "درخواست با موفقیت ارسال شد",
    "consult.rateLimited":
      "شما به‌تازگی درخواستی ارسال کرده‌اید. لطفاً {time} دیگر دوباره تلاش کنید.",
    "contact.sending": "در حال ارسال…",
    "contact.sentViaTelegram": "پیام با موفقیت ارسال شد",
    "contact.rateLimited": "شما به‌تازگی پیامی ارسال کرده‌اید. لطفاً {time} دیگر دوباره تلاش کنید.",
    "hero.badge": "آماده برای همکاری فول‌استک",
    "hero.h1": "امین صادقی، توسعه‌دهنده‌ی فول‌استک با تخصص در استک MERN.",
    "hero.p":
      "اپلیکیشن‌های وب رو از صفر تا صد می‌سازم — API و مدل داده در بک‌اند، رابط کاربری با ری‌اکت در فرانت‌اند. ساکن ایران، و الان دارم Nest.js یاد می‌گیرم تا بک‌اندهای ساختاریافته‌تر و آماده‌ی پروداکشن بسازم.",
    "hero.viewProjects": "مشاهده‌ی پروژه‌ها",
    "hero.viewResume": "مشاهده‌ی رزومه",
    "hero.requestConsult": "درخواست مشاوره",
    "about.h2": "درباره‌ی من",
    "about.p1":
      "من امین هستم، یه توسعه‌دهنده‌ی وب از ایران که از ساختن چیزها از صفر تا صد لذت می‌برم. هم روی فرانت‌اند کار می‌کنم هم بک‌اند، ولی بیشتر وقتم رو صرف بک‌اند کردم — جایی که راحت‌ترم.",
    "about.p2":
      "هنوز تجربه‌ی کاری حرفه‌ای ندارم، برای همین تمرکزم روی یادگیری مداوم و عملیه — هر پروژه‌ای که می‌سازم یه چیزی یادم می‌ده که توی پروژه‌ی بعدی به کار می‌برم.",
    "about.stat1": "سال یادگیری",
    "about.stat2": "پروژه‌ی ساخته‌شده",
    "about.stat3": "حالت یادگیری",
    "about.location": "دورکار / تهران، ایران",
    "about.timeline1.title": "ساخت پروژه‌ها",
    "about.timeline1.desc":
      "ساخت اپلیکیشن‌های فول‌استک با React، Node.js، Express و MongoDB — یادگیری از طریق پروژه‌های واقعی و عملی.",
    "about.timeline2.title": "تمرکز عمیق روی بک‌اند",
    "about.timeline2.desc":
      "تسلط بیشتر روی Express.js و Fastify، ساخت REST API با طراحی درست دیتابیس در MongoDB، و الان دارم Nest.js یاد می‌گیرم.",
    "about.timeline3.title": "شروع توسعه‌ی وب",
    "about.timeline3.desc": "شروع با HTML، CSS و جاوااسکریپت، و ساخت اولین سایت‌های استاتیکم.",
    "skills.h2": "مهارت‌ها",
    "skills.p": "تکنولوژی‌هایی که مرتب باهاشون کار می‌کنم.",
    "skills.frontend": "فرانت‌اند",
    "skills.backend": "بک‌اند",
    "skills.restfulApi": "طراحی RESTful API",
    "skills.database": "دیتابیس",
    "skills.schemaDesign": "طراحی اسکیما",
    "skills.crud": "عملیات CRUD",
    "skills.authSecurity": "احراز هویت و امنیت",
    "skills.jwt": "احراز هویت JWT",
    "skills.sessionAuth": "احراز هویت مبتنی بر Session",
    "skills.passwordHashing": "هش کردن رمز عبور",
    "skills.inputValidation": "اعتبارسنجی ورودی",
    "skills.architecture": "معماری و الگوها",
    "skills.mvc": "معماری MVC",
    "skills.modular": "معماری ماژولار",
    "skills.serviceRepo": "الگوی Service/Repository",
    "skills.singleton": "الگوی Singleton",
    "skills.errorHandling": "مدیریت متمرکز خطا",
    "skills.realtime": "بلادرنگ",
    "skills.toolsDeploy": "ابزارها و استقرار",
    "skills.other": "سایر مهارت‌ها",
    "skills.pwa": "اپلیکیشن‌های وب پیشرو (PWA)",
    "skills.sw": "Service Worker",
    "skills.regex": "عبارات باقاعده (RegEx)",
    "education.h2": "تحصیلات و گواهینامه‌ها",
    "education.p": "خودآموخته، همراه با دوره‌های آموزشی ساختاریافته.",
    "education.item1.title": "یادگیری خودخوانده‌ی استک MERN",
    "education.item1.date": "۲۰۲۵ — تاکنون",
    "education.item1.desc":
      "یادگیری توسعه‌ی فول‌استک از طریق مستندات، دوره‌ها و ساخت پروژه‌های واقعی.",
    "education.item2.title": "گواهینامه‌ها",
    "education.item2.date": "مال خودت رو اینجا اضافه کن",
    "education.item2.desc": "کارت نمونه — با هر دوره یا گواهینامه‌ای که گذروندی جایگزینش کن.",
    "work.h2": "نمونه‌کارها",
    "work.p": "پروژه‌ای که در حال ساختشم — بیشترش در حال انجامه.",
    "work.personalProject": "پروژه‌ی شخصی",
    "work.snakidDesc":
      "یه اپلیکیشن پیشرفته‌ی لیست کارها با قابلیت مدیریت ذخیره‌سازی، برای تمرین مدیریت state و الگوهای پایداری داده.",
    "work.viewOnGithub": "مشاهده در گیت‌هاب",
    "work.moreTitle": "بیشتر توی گیت‌هاب",
    "work.moreDesc":
      "دارم فعالانه پروژه‌های جدید می‌سازم. برای دیدن کاری که الان روش کار می‌کنم، پروفایلم رو ببین.",
    "github.h2": "فعالیت گیت‌هاب",
    "github.p": "به‌صورت زنده از GitHub API گرفته شده.",
    "github.repos": "ریپوی عمومی",
    "github.followers": "فالوور",
    "github.following": "دنبال‌شونده",
    "github.since": "عضو از",
    "github.error": "الان نتونستم به GitHub API وصل شم — برای امتحان دوباره رفرش کن.",
    "now.h2": "الان",
    "now.p": "چیزی که الان روش تمرکز کردم.",
    "now.card1.title": "یادگیری Nest.js",
    "now.card1.desc": "عمیق‌تر شدن توی بک‌اندهای ساختاریافته و آماده‌ی پروداکشن.",
    "now.card2.title": "REST API و وب‌ساکت",
    "now.card2.desc": "تمرین قابلیت‌های بلادرنگ با Socket.io.",
    "now.card3.title": "دنبال موقعیت شغلی بعدی‌ام",
    "now.card3.desc": "آماده برای موقعیت‌های فول‌استک، کار فریلنس و همکاری‌ها.",
    "faq.h2": "سوالات متداول",
    "faq.p": "سوالاتی که معمولاً ازم پرسیده می‌شه.",
    "faq.q1": "الان برای کار در دسترسی؟",
    "faq.a1":
      "بله — برای موقعیت‌های فول‌استک، پروژه‌های فریلنس و همکاری‌ها آماده‌ام، چه دورکار چه توی تهران.",
    "faq.q2": "بیشتر روی فرانت‌اند کار می‌کنی یا بک‌اند؟",
    "faq.a2":
      "هر دو، ولی تجربه‌ی بیشترم توی بک‌اند با Node.js، Express و MongoDB هست. برای فرانت‌اند از React و Tailwind CSS استفاده می‌کنم.",
    "faq.q3": "رزومه‌ای داری که بتونم دانلود کنم؟",
    "faq.a3":
      "بله — از دکمه‌ی «رزومه» توی هدر یا بخش اصلی استفاده کن. می‌تونی نسخه‌ی بک‌اند یا فرانت‌اند رو، به فارسی یا انگلیسی انتخاب کنی.",
    "faq.q4": "بهترین راه برای تماس باهات چیه؟",
    "faq.a4": "ایمیل سریع‌ترین راهه، یا توی لینکدین پیام بده — هر دو رو هر روز چک می‌کنم.",
    "contact.h2": "در تماس باش",
    "contact.p": "پروژه‌ای تو ذهنته یا یه موقعیت شغلی مناسب داری؟ دوست دارم بشنوم.",
    "contact.orConsult": "یا درخواست مشاوره بده",
    "contact.form.name": "نام",
    "contact.form.namePlaceholder": "نامت",
    "contact.form.email": "ایمیل",
    "contact.form.message": "پیام",
    "contact.form.messagePlaceholder": "چی داری می‌سازی؟",
    "contact.form.send": "ارسال پیام",
    "contact.form.note":
      "این کار ایمیلت رو باز می‌کنه — وقتی آماده بودی، با یه بک‌اند واقعی برای فرم جایگزینش کن.",
    "footer.rights": "امین صادقی. تمامی حقوق محفوظ است.",
    "footer.builtWith": "ساخته‌شده با Tailwind، بدون فریم‌ورک",
  },
};

function t(key) {
  const lang = document.documentElement.lang === "fa" ? "fa" : "en";
  return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = translations[lang][key];
    if (val !== undefined) el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const val = translations[lang][key];
    if (val !== undefined) el.setAttribute("placeholder", val);
  });
  localStorage.setItem(LANG_KEY, lang);
}

function initLanguage() {
  const saved = localStorage.getItem(LANG_KEY);
  const lang = saved === "fa" || saved === "en" ? saved : "en";
  applyLanguage(lang);
}
initLanguage();

["langToggle", "langToggleMobile"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("click", () => {
      const next = document.documentElement.lang === "fa" ? "en" : "fa";
      applyLanguage(next);
    });
  }
});

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
  submitBtn.innerHTML = `<span class="spinner"></span>${t("contact.sending")}`;

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
    showToast(t("contact.sentViaTelegram"), "success");
    e.target.reset();
  } else {
    const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
    window.location.href = `mailto:amin0xa1b@gmail.com?subject=${encodeURIComponent(
      "Portfolio contact from " + name,
    )}&body=${body}`;
  }
});

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
    resumeStep2Sub.setAttribute(
      "data-i18n",
      selectedTrack === "backend" ? "resume.step2SubBackend" : "resume.step2SubFrontend",
    );
    resumeStep2Sub.textContent = t(
      selectedTrack === "backend" ? "resume.step2SubBackend" : "resume.step2SubFrontend",
    );
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
      .register("sw.js", { updateViaCache: "none" })
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
  submitBtn.innerHTML = `<span class="spinner"></span>${t("consult.sending")}`;

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
    showToast(t("consult.sentViaTelegram"), "success");
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
