// Edit this list to add or change portfolio projects. Nothing else needs to be touched.
//
// slug         unique id, also used for the card button
// name         title shown on the card and in the modal
// icon         any Bootstrap Icons class name, for example "bi-terminal"
// kind         small badge on the card ("Personal project", "Open source", ...)
// summary      one or two sentences for the card
// description  longer text for the modal
// highlights   bullet list in the modal
// stack        technology badges
// repo         GitHub URL, or null to hide the Source code button
// demo         live URL, or null. When set, the modal embeds it as the preview.
// image        screenshot path used as the preview when there is no demo, or null
const PROJECTS = [
  {
    slug: "peek",
    name: "Peek",
    icon: "bi-folder2-open",
    kind: "Personal project",
    summary: "A static file explorer server with a web-based file explorer.",
    description:
      "Peek serves static files from a folder and lets you browse and manage them through a file explorer in the browser. It is a small Node.js server you run next to the files you want to share.",
    highlights: [
      "Serves static files over HTTP",
      "Browse and manage files from the browser",
      "Runs as a small standalone Node.js server",
    ],
    stack: ["Node.js", "JavaScript"],
    repo: "https://github.com/aydope/peek",
    demo: null,
    image: null,
  },
  {
    slug: "mokat",
    name: "Mokat",
    icon: "bi-terminal",
    kind: "Personal project",
    summary: "A logging and timeout utility for Node.js with Pino-Pretty style output.",
    description:
      "Mokat gives Node.js apps readable console logs and a timeout helper without any setup. It is written in TypeScript and ships with full type support.",
    highlights: [
      "Readable, Pino-Pretty style console logs",
      "Zero configuration",
      "Full TypeScript type support",
    ],
    stack: ["TypeScript", "Node.js"],
    repo: "https://github.com/aydope/mokat",
    demo: null,
    image: null,
  },
  {
    slug: "farmaan",
    name: "Farmaan",
    icon: "bi-check2-square",
    kind: "Personal project",
    summary: "A simple, focused task manager built for Persian speakers.",
    description:
      "Farmaan is a task manager with a Persian-first interface and a minimal flow: add a task, finish it, move on.",
    highlights: ["Persian-first interface", "Clean, minimal task flow"],
    stack: ["JavaScript"],
    repo: "https://github.com/aydope/farmaan",
    demo: null,
    image: null,
  },
  {
    slug: "id",
    name: "Digital ID",
    icon: "bi-person-vcard",
    kind: "Personal project",
    summary: "A digital identity card that works as a compact personal profile page.",
    description:
      "A single-page digital ID card with my name, links and contact details, built as plain HTML and CSS with no build step.",
    highlights: ["Single-page card layout", "Static, no build step"],
    stack: ["HTML", "CSS"],
    repo: "https://github.com/aydope/id",
    demo: "/id/",
    image: null,
  },
];
