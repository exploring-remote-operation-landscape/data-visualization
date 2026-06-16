"use strict";

// ── Multi-value columns ───────────────────────────────────────────────────────
// These CSV columns contain semicolon-separated lists of values (e.g. "Road;Railway").
// Filter options are derived by splitting and deduplicating each cell's values,
// and a row passes a filter if ANY of its values match the selection.
const EXPANDED_COLS = new Set([
  "Transport domains",
  "remote operation control mode",
]);

// ── Build filter UI ───────────────────────────────────────────────────────────
// Populates #filters-container with one <select multiple> per column in `cols`.
// Each select carries a data-col attribute used by getFilteredData().
function buildFilters(data, cols) {
  const container = document.getElementById("filters-container");
  container.innerHTML = "";

  for (const col of cols) {
    // Expand semicolon-separated cells for EXPANDED_COLS; use raw values otherwise.
    const values = EXPANDED_COLS.has(col)
      ? [...new Set(data.flatMap(r => (r[col] || "").split(";").map(s => s.trim()).filter(Boolean)))].sort()
      : [...new Set(data.map(r => r[col]).filter(v => v != null))].sort();

    const div      = document.createElement("div");
    div.className  = "filter-group";

    const labelRow      = document.createElement("div");
    labelRow.className  = "filter-label-row";

    const lbl           = document.createElement("label");
    lbl.textContent     = col;

    const toggles       = document.createElement("div");
    toggles.className   = "filter-toggles";

    const allBtn        = document.createElement("button");
    allBtn.textContent  = "All";
    allBtn.addEventListener("click", () => {
      [...sel.options].forEach(o => (o.selected = true));
      renderMap();
    });

    const noneBtn       = document.createElement("button");
    noneBtn.textContent = "None";
    noneBtn.addEventListener("click", () => {
      [...sel.options].forEach(o => (o.selected = false));
      renderMap();
    });

    toggles.appendChild(allBtn);
    toggles.appendChild(noneBtn);
    labelRow.appendChild(lbl);
    labelRow.appendChild(toggles);

    const sel = document.createElement("select");
    sel.multiple = true;
    sel.setAttribute("data-col", col);
    values.forEach(v => {
      const opt = new Option(v, v, true, true); // selected by default
      sel.appendChild(opt);
    });
    sel.addEventListener("change", renderMap);

    div.appendChild(labelRow);
    div.appendChild(sel);
    container.appendChild(div);
  }
}

// ── Build "Color by" dropdown ─────────────────────────────────────────────────
function buildColorBy(cols) {
  const sel = document.getElementById("color-by-select");
  sel.innerHTML = "";
  cols.forEach(col => {
    const opt = new Option(col.charAt(0).toUpperCase() + col.slice(1), col);
    sel.appendChild(opt);
  });
  sel.addEventListener("change", renderMap);
}

// ── Apply active filters ──────────────────────────────────────────────────────
// Reads every [data-col] select and removes rows that don't match the selection.
// For EXPANDED_COLS, a row is kept if at least one of its semicolon-values is selected.
function getFilteredData() {
  let filtered = allData.slice();

  document.querySelectorAll("[data-col]").forEach(sel => {
    const col    = sel.getAttribute("data-col");
    const chosen = new Set([...sel.selectedOptions].map(o => o.value));

    if (chosen.size < sel.options.length) { // skip filter if everything is selected
      if (EXPANDED_COLS.has(col)) {
        filtered = filtered.filter(r => {
          const vals = (r[col] || "").split(";").map(s => s.trim()).filter(Boolean);
          return vals.some(v => chosen.has(v));
        });
      } else {
        filtered = filtered.filter(r => chosen.has(r[col]));
      }
    }
  });

  return filtered;
}
