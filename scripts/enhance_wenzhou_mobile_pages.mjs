import fs from "node:fs";
import path from "node:path";

const files = [
  "dist/lp95-study/wenzhou-chinese.html",
  "dist/lp95-study/wenzhou-math.html",
  "dist/lp95-study/wenzhou-english.html",
  "dist/lp95-study/wenzhou-science.html"
];

const cssStart = "/* mobile-foldable-study-start */";
const cssEnd = "/* mobile-foldable-study-end */";
const jsStart = "<!-- mobile-foldable-study-start -->";
const jsEnd = "<!-- mobile-foldable-study-end -->";

const mobileCss = `${cssStart}
    @media (max-width: 760px) {
      body.mobile-table-cards .table-wrap {
        overflow: visible;
      }

      body.mobile-table-cards .mobile-fold {
        border: 1px solid var(--line);
        border-radius: 10px;
        background: #fbfcfe;
        margin: 10px 0;
        overflow: hidden;
      }

      body.mobile-table-cards .mobile-fold > summary {
        list-style: none;
        cursor: pointer;
        min-height: 48px;
        padding: 12px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px;
        align-items: center;
        color: #174ea6;
        font-size: 15px;
        font-weight: 900;
      }

      body.mobile-table-cards .mobile-fold > summary::-webkit-details-marker {
        display: none;
      }

      body.mobile-table-cards .mobile-fold > summary::after {
        content: "收起";
        border: 1px solid #cfe0ff;
        border-radius: 999px;
        background: var(--blue-soft, #eaf2ff);
        color: #174ea6;
        padding: 3px 8px;
        font-size: 11px;
        font-weight: 800;
      }

      body.mobile-table-cards .mobile-fold:not([open]) > summary::after {
        content: "展开";
      }

      body.mobile-table-cards .mobile-fold-body {
        padding: 0 10px 10px;
      }

      body.mobile-table-cards .mobile-fold .group-title,
      body.mobile-table-cards .mobile-fold > h3 {
        display: none;
      }

      body.mobile-table-cards .mobile-fold .table-wrap {
        border: 0;
        border-radius: 0;
        margin: 0;
      }

      body.mobile-table-cards .mobile-fold table,
      body.mobile-table-cards .mobile-fold thead,
      body.mobile-table-cards .mobile-fold tbody,
      body.mobile-table-cards .mobile-fold tr,
      body.mobile-table-cards .mobile-fold th,
      body.mobile-table-cards .mobile-fold td {
        display: block;
        width: 100%;
        min-width: 0;
      }

      body.mobile-table-cards .mobile-fold table {
        border: 0;
        background: transparent;
      }

      body.mobile-table-cards .mobile-fold thead {
        display: none;
      }

      body.mobile-table-cards .mobile-fold tbody {
        display: grid;
        gap: 8px;
      }

      body.mobile-table-cards .mobile-fold tr {
        position: relative;
        border: 1px solid var(--line);
        border-radius: 10px;
        background: #fff;
        padding: 10px 10px 10px 40px;
        box-shadow: 0 2px 8px rgba(20, 32, 43, .04);
      }

      body.mobile-table-cards .mobile-fold td {
        border: 0;
        padding: 0;
        text-align: left;
      }

      body.mobile-table-cards .mobile-fold td:first-child {
        position: absolute;
        left: 10px;
        top: 12px;
        width: 20px;
      }

      body.mobile-table-cards .mobile-fold td:nth-child(2) {
        color: #1d6443;
        font-size: 12px;
        font-weight: 900;
        line-height: 1.35;
      }

      body.mobile-table-cards .mobile-fold td:nth-child(3) {
        color: var(--ink);
        font-size: 15px;
        font-weight: 900;
        line-height: 1.45;
        margin-top: 3px;
      }

      body.mobile-table-cards .mobile-fold td:nth-child(n+4) {
        color: var(--muted);
        font-size: 13px;
        line-height: 1.55;
        margin-top: 6px;
      }

      body.mobile-table-cards .mobile-fold td:nth-child(n+4)::before {
        content: attr(data-label);
        display: block;
        color: #506070;
        font-size: 11px;
        font-weight: 900;
        line-height: 1.25;
        margin-bottom: 2px;
      }
    }
${cssEnd}`;

const mobileJs = `${jsStart}
  <script>
    (function () {
      const mobileQuery = window.matchMedia("(max-width: 760px)");
      if (!mobileQuery.matches) return;

      document.body.classList.add("mobile-table-cards");

      document.querySelectorAll("table").forEach(table => {
        const labels = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent.trim());
        table.querySelectorAll("tbody tr").forEach(row => {
          Array.from(row.children).forEach((cell, index) => {
            cell.setAttribute("data-label", labels[index] || "");
          });
        });
      });

      document.querySelectorAll("section").forEach(section => {
        Array.from(section.querySelectorAll(":scope > .table-wrap")).forEach((tableWrap, index) => {
          if (tableWrap.closest(".mobile-fold")) return;

          const previous = tableWrap.previousElementSibling;
          const titleNode = previous && previous.tagName === "H3" ? previous : null;
          const title = (titleNode?.textContent || section.querySelector(".section-head h2, h2")?.textContent || "章节").trim();

          const details = document.createElement("details");
          details.className = "mobile-fold";
          details.open = true;

          const summary = document.createElement("summary");
          summary.textContent = title;

          const body = document.createElement("div");
          body.className = "mobile-fold-body";

          const anchor = titleNode || tableWrap;
          anchor.before(details);
          details.append(summary, body);
          if (titleNode) body.appendChild(titleNode);
          body.appendChild(tableWrap);
        });
      });
    })();
  </script>
${jsEnd}`;

function replaceBetween(source, start, end, replacement) {
  const from = source.indexOf(start);
  const to = source.indexOf(end);
  if (from === -1 || to === -1 || to < from) return source;
  return `${source.slice(0, from)}${replacement}${source.slice(to + end.length)}`;
}

function ensureCss(html) {
  if (html.includes(cssStart) && html.includes(cssEnd)) {
    return replaceBetween(html, cssStart, cssEnd, mobileCss);
  }
  return html.replace("</style>", `\n${mobileCss}\n  </style>`);
}

function ensureJs(html) {
  if (html.includes(jsStart) && html.includes(jsEnd)) {
    return replaceBetween(html, jsStart, jsEnd, mobileJs);
  }
  return html.replace("</body>", `${mobileJs}\n</body>`);
}

for (const file of files) {
  const target = path.resolve(file);
  const html = fs.readFileSync(target, "utf8");
  const updated = ensureJs(ensureCss(html));
  fs.writeFileSync(target, updated, "utf8");
  console.log(`enhanced ${file}`);
}
