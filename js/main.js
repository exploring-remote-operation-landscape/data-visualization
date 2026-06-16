"use strict";

// ── Shared mutable state ──────────────────────────────────────────────────────
// Declared with var so they are window-level globals accessible from all scripts
// (filters.js, map.js) without needing ES modules.
var allData     = []; // geocoded rows; set once in initWithData()
var displayCols = []; // columns shown in the data table
var catCols     = []; // categorical columns used for filters and color-by

// ── CSV utilities ─────────────────────────────────────────────────────────────

// Strips leading/trailing whitespace from all keys and string values in a row.
function trimRow(row) {
  const out = {};
  for (const [k, v] of Object.entries(row))
    out[k.trim()] = typeof v === "string" ? v.trim() : v;
  return out;
}

// Parses the embedded semicolon-delimited CSV via PapaParse.
function parseCSV(text) {
  const result = Papa.parse(text.trim(), {
    header: true,
    skipEmptyLines: true,
    delimiter: ";",
  });
  return result.data.map(trimRow);
}

// ── Location expansion ────────────────────────────────────────────────────────
// Some rows list multiple semicolon-separated locations (e.g. "Linköping; Vadstena").
// This splits each into its own row with a _location field used throughout the app.
// The "Multiple X; Y" prefix (legacy format) is stripped before splitting.
function expandLocations(rows) {
  const out = [];
  for (const row of rows) {
    const loc = (row["Location"] || "")
      .replace(/^Multiple\s+/i, "")
      .replace(/\.+$/, "")
      .trim();
    const parts = loc.split(";").map(s => s.trim()).filter(Boolean);
    for (const part of parts) out.push({ ...row, _location: part, Country: LOCATION_TO_COUNTRY[part] || "" });
  }
  return out;
}

// ── App initialisation ────────────────────────────────────────────────────────
// Called once on DOMContentLoaded. Parses CSV → expands locations → geocodes →
// builds UI → renders map. Everything downstream depends on this completing.
async function initWithData(csvText) {
  document.getElementById("loading-section").style.display = "block";

  const rows     = parseCSV(csvText);
  const expanded = expandLocations(rows);
  const { geocoded, skipped } = await geocodeAll(expanded);

  allData = geocoded;

  // Columns used for filtering and the color-by selector.
  // "Country" is derived (not in the CSV) so it's appended separately.
  const origCols = Object.keys(rows[0] || {});
  const csvCols  = ["Organization", "Transport domains", "remote operation control mode"];
  catCols     = [...csvCols.filter(c => origCols.includes(c)), "Country"];
  displayCols = ["_location", ...catCols];

  buildFilters(allData, catCols);
  // Country is useful as a filter but not as a color-by dimension.
  buildColorBy(catCols.filter(c => c !== "Country"));

  if (skipped) {
    const wb = document.getElementById("warning-box");
    wb.textContent   = `${skipped} row(s) could not be geocoded and were skipped.`;
    wb.style.display = "block";
  }

  document.getElementById("loading-section").style.display = "none";
  document.getElementById("app-layout").style.display      = "flex";

  renderMap();

  // Wire map click → detail modal (registered here because #map doesn't exist
  // as a Plotly element until renderMap() has been called above).
  document.getElementById("map").on("plotly_click", data => {
    const rows = data.points[0].customdata;
    if (rows.length === 1) showDetail(rows[0]);
    else showMultiDetail(rows);
  });

  const overlay = document.getElementById("detail-overlay");
  document.getElementById("detail-close").addEventListener("click", () =>
    overlay.classList.remove("open")
  );
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.classList.remove("open");
  });
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => initWithData(DATA_CSV));

// ── Data table toggle ─────────────────────────────────────────────────────────
document.getElementById("table-toggle").addEventListener("click", () => {
  const body  = document.getElementById("table-body");
  const arrow = document.getElementById("table-arrow");
  body.classList.toggle("open");
  arrow.innerHTML = body.classList.contains("open") ? "&#9660;" : "&#9654;";
});

// ── Clear all filters ─────────────────────────────────────────────────────────
document.getElementById("clear-all-filters").addEventListener("click", () => {
  document.querySelectorAll("[data-col]").forEach(sel => {
    [...sel.options].forEach(o => (o.selected = true));
  });
  renderMap();
});

// ── Map panel toggles (Filters / Display) ────────────────────────────────────
// Each button opens its floating panel; clicking the same button again closes it.
// Opening one panel closes the other. Clicking outside both closes both.
const filterPanel   = document.getElementById("filter-panel");
const displayPanel  = document.getElementById("display-panel");
const filterToggle  = document.getElementById("filter-toggle");
const displayToggle = document.getElementById("display-toggle");

function togglePanel(panel, btn) {
  const isOpen = panel.classList.contains("open");
  filterPanel.classList.remove("open");
  displayPanel.classList.remove("open");
  filterToggle.classList.remove("active");
  displayToggle.classList.remove("active");
  if (!isOpen) {
    panel.classList.add("open");
    btn.classList.add("active");
  }
}

filterToggle.addEventListener("click",  e => { e.stopPropagation(); togglePanel(filterPanel,  filterToggle);  });
displayToggle.addEventListener("click", e => { e.stopPropagation(); togglePanel(displayPanel, displayToggle); });

document.addEventListener("click", e => {
  if (!e.target.closest(".map-controls") && !e.target.closest(".map-panel")) {
    filterPanel.classList.remove("open");
    displayPanel.classList.remove("open");
    filterToggle.classList.remove("active");
    displayToggle.classList.remove("active");
  }
});
