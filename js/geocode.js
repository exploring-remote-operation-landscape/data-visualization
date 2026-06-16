"use strict";

// ── Geocode cache ─────────────────────────────────────────────────────────────
// Persisted to localStorage so any location geocoded via Nominatim is remembered
// across browser sessions, not just the current tab.
const geocodeCache = (() => {
  try { return JSON.parse(localStorage.getItem("geocodeCache") || "{}"); }
  catch { return {}; }
})();

function saveCache() {
  try { localStorage.setItem("geocodeCache", JSON.stringify(geocodeCache)); }
  catch { /* quota exceeded — silently skip */ }
}

// ── Single-location geocode ───────────────────────────────────────────────────
// Lookup order: PRECOMPUTED_COORDS → localStorage cache → Nominatim API.
// Returns { lat, lon } or null if the location cannot be resolved.
async function geocodeLocation(locStr) {
  if (PRECOMPUTED_COORDS[locStr])         return PRECOMPUTED_COORDS[locStr];
  if (geocodeCache[locStr] !== undefined) return geocodeCache[locStr];

  const q = encodeURIComponent(locStr);
  try {
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data   = await res.json();
    const coords = data.length
      ? { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
      : null;
    geocodeCache[locStr] = coords;
    saveCache();
    return coords;
  } catch {
    geocodeCache[locStr] = null;
    saveCache();
    return null;
  }
}

// ── Batch geocode ─────────────────────────────────────────────────────────────
// Resolves coordinates for every unique _location in `rows`.
// Nominatim's usage policy requires ≤1 request/second, so a 1.1 s delay is
// inserted after each *uncached* API call.
async function geocodeAll(rows) {
  const uniqueLocs = [...new Set(rows.map(r => r._location))];
  const coordsMap  = {};
  let i = 0;

  for (const loc of uniqueLocs) {
    document.getElementById("loading-msg").textContent =
      `Geocoding: ${loc}  (${++i} / ${uniqueLocs.length})`;
    const isCached = PRECOMPUTED_COORDS[loc] !== undefined || geocodeCache[loc] !== undefined;
    coordsMap[loc] = await geocodeLocation(loc);
    if (!isCached) await new Promise(r => setTimeout(r, 1100));
  }

  const geocoded = [];
  let skipped = 0;
  for (const row of rows) {
    const coords = coordsMap[row._location];
    if (coords) geocoded.push({ ...row, lat: coords.lat, lon: coords.lon });
    else skipped++;
  }
  return { geocoded, skipped };
}
