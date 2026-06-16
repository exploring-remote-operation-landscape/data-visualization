"use strict";

// ── Detail panel columns ──────────────────────────────────────────────────────
// Controls which fields appear in the click-to-open detail card, and their order.
// Add or remove column names here to customise the detail view.
const DETAIL_COLS = [
  "Organization",
  "Transport domains",
  "remote operation control mode",
  "components",
  "types of research",
  "standards",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

// Renders a field value: single values as plain text, multiple semicolon-separated
// values as a bullet list.
function formatDetailValue(val) {
  const items = String(val).split(";").map(s => s.trim()).filter(Boolean);
  if (items.length <= 1) return `<span>${items[0] ?? ""}</span>`;
  return `<ul class="detail-list">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
}

// Returns a contact line if the row has a non-empty Contact field, otherwise "".
function contactLine(row) {
  const val = (row["Contact"] || "").trim();
  return val ? `<p class="detail-contact">Contact: ${val}</p>` : "";
}

// Formats the Updated timestamp (MM-DD-YY HH:MM:SS) as "D Month YYYY".
function updatedLine(row) {
  const raw = (row["Updated"] || "").trim();
  if (!raw) return "";
  const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const [m, d, y] = raw.split(" ")[0].split("-").map(Number);
  return `<p class="detail-updated">last updated: ${d} ${MONTHS[m - 1]} ${2000 + y}</p>`;
}

// ── Single-org detail ─────────────────────────────────────────────────────────
function showDetail(row) {
  const content = document.getElementById("detail-content");
  content.innerHTML =
    `<h3>${row._location}</h3>` +
    DETAIL_COLS
      .filter(c => row[c] != null && String(row[c]).trim() !== "")
      .map(c => `<div class="detail-row"><strong>${c}</strong>${formatDetailValue(row[c])}</div>`)
      .join("") +
    contactLine(row) +
    updatedLine(row);
  document.getElementById("detail-overlay").classList.add("open");
}

// ── Multi-org detail (tabbed) ─────────────────────────────────────────────────
// Used when multiple organisations share a location. Renders one tab per org;
// clicking a tab swaps in that org's data without closing the modal.
function showMultiDetail(rows) {
  const content  = document.getElementById("detail-content");
  const tabsHtml = rows.map((r, i) =>
    `<button class="detail-tab${i === 0 ? " active" : ""}" data-idx="${i}">${r.Organization}</button>`
  ).join("");

  content.innerHTML =
    `<h3>${rows[0]._location}</h3>` +
    `<div class="detail-tabs">${tabsHtml}</div>` +
    `<div id="detail-tab-content"></div>`;

  renderTabContent(rows[0]);

  content.querySelectorAll(".detail-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      content.querySelectorAll(".detail-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderTabContent(rows[parseInt(btn.dataset.idx)]);
    });
  });

  document.getElementById("detail-overlay").classList.add("open");
}

function renderTabContent(row) {
  document.getElementById("detail-tab-content").innerHTML =
    DETAIL_COLS
      .filter(c => row[c] != null && String(row[c]).trim() !== "")
      .map(c => `<div class="detail-row"><strong>${c}</strong>${formatDetailValue(row[c])}</div>`)
      .join("") +
    contactLine(row) +
    updatedLine(row);
}
