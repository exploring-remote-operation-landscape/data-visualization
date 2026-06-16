"use strict";

// Plotly color sequence used for legend categories (cycles if > 10 values).
const COLOR_PALETTE = [
  "#636EFA","#EF553B","#00CC96","#AB63FA","#FFA15A",
  "#19D3F3","#FF6692","#B6E880","#FF97FF","#FECB52",
];

// ── Map rendering ─────────────────────────────────────────────────────────────
// Reads active filters and the "Color by" selection, then redraws the Plotly map.
//
// One marker is placed per unique _location (not per org). When multiple orgs
// share a location, they are grouped and their names shown stacked in the tooltip.
// The marker colour reflects the colorCol value; if orgs at the same location
// disagree on that value, the colour is set to grey with the label "Multiple".
function renderMap() {
  const filtered = getFilteredData();
  const colorCol = document.getElementById("color-by-select").value;

  // Group rows by location and sort orgs alphabetically within each group.
  const locMap = new Map();
  for (const row of filtered) {
    if (!locMap.has(row._location)) locMap.set(row._location, []);
    locMap.get(row._location).push(row);
  }
  for (const rows of locMap.values())
    rows.sort((a, b) => (a.Organization || "").localeCompare(b.Organization || ""));

  // Determine the color label per location.
  const locationPoints = [...locMap.entries()].map(([loc, rows]) => {
    const rawVals = rows.flatMap(r =>
      EXPANDED_COLS.has(colorCol)
        ? (r[colorCol] || "").split(";").map(s => s.trim()).filter(Boolean)
        : [(r[colorCol] || "").trim()]
    );
    const unique = [...new Set(rawVals.filter(Boolean))];
    // "Multiple" when orgs at this location have different values for colorCol.
    return { loc, rows, colorVal: unique.length === 1 ? unique[0] : "Multiple" };
  });

  // Sort color values alphabetically; always put "Multiple" last.
  const uniqueColorVals = [...new Set(locationPoints.map(p => p.colorVal))].sort(
    (a, b) => a === "Multiple" ? 1 : b === "Multiple" ? -1 : a.localeCompare(b)
  );
  const colorMap = Object.fromEntries(
    uniqueColorVals.map((v, i) =>
      [v, v === "Multiple" ? "#aaaaaa" : COLOR_PALETTE[i % COLOR_PALETTE.length]]
    )
  );

  // Layout is defined here so it is available to both the early-return path
  // (empty filters) and the normal path below.
  const layout = {
    height: 580,
    margin: { l: 0, r: 0, t: 10, b: 0 },
    showlegend: false, // legend is rendered as HTML in the display overlay
    geo: {
      projection:      { type: "natural earth" },
      showland:        true,  landcolor:      "#eaeaea",
      showocean:       true,  oceancolor:     "#cce5f5",
      showcoastlines:  true,  coastlinecolor: "#aaaaaa",
      showcountries:   true,  countrycolor:   "#cccccc",
      showframe: false,
    },
  };

  // When no data passes the filters, render the geo background with no markers
  // and clear the legend / caption.
  if (uniqueColorVals.length === 0) {
    Plotly.react("map", [{ type: "scattergeo", lat: [], lon: [], showlegend: false }], layout, { responsive: true });
    const el = document.getElementById("map-legend");
    if (el) el.innerHTML = "";
    document.getElementById("caption").textContent =
      `Showing 0 locations (0 organisations) of ${allData.length} total entries.`;
    renderTable([]);
    return;
  }

  // One Plotly trace per color value so the legend groups correctly.
  const traces = uniqueColorVals.map(val => {
    const points = locationPoints.filter(p => p.colorVal === val);
    return {
      type: "scattergeo",
      name: val,
      lat:        points.map(p => p.rows[0].lat),
      lon:        points.map(p => p.rows[0].lon),
      customdata: points.map(p => p.rows), // passed to the click handler
      text: points.map(p => {
        const orgs = p.rows.map(r => r.Organization).join("<br>");
        const transports = [...new Set(
          p.rows.flatMap(r => (r["Transport domains"] || "").split(";").map(s => s.trim()).filter(Boolean))
        )].sort().join(", ");
        return `<b>${p.loc}</b><br>${orgs}<br><i>${transports}</i>`;
      }),
      hovertemplate: "%{text}<extra></extra>",
      marker: {
        size: 14, opacity: 0.85,
        color: colorMap[val],
        line: { width: 1, color: "white" },
      },
    };
  });

  Plotly.react("map", traces, layout, { responsive: true });

  // Populate the HTML legend in the map sidebar.
  const legendEl = document.getElementById("map-legend");
  if (legendEl) {
    legendEl.innerHTML = uniqueColorVals.map(val =>
      `<div class="legend-item">
        <span class="legend-swatch" style="background:${colorMap[val]}"></span>
        <span class="legend-label">${val}</span>
      </div>`
    ).join("");
  }

  const locCount = locMap.size;
  const orgCount = filtered.length;
  document.getElementById("caption").textContent =
    `Showing ${locCount} location${locCount !== 1 ? "s" : ""} ` +
    `(${orgCount} organisation${orgCount !== 1 ? "s" : ""}) of ${allData.length} total entries.`;

  renderTable(filtered);
}

// ── Table rendering ───────────────────────────────────────────────────────────
// Rebuilds the raw data table below the map using the currently filtered rows.
function renderTable(data) {
  const table  = document.getElementById("data-table");
  table.innerHTML = "";

  const thead = document.createElement("thead");
  const hr    = document.createElement("tr");
  displayCols.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col === "_location" ? "Location" : col;
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  data.forEach(row => {
    const tr = document.createElement("tr");
    displayCols.forEach(col => {
      const td = document.createElement("td");
      td.textContent = row[col] ?? "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}
