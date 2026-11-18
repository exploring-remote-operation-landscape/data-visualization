"use strict";

// ── Survey data ───────────────────────────────────────────────────────────────
// Embedded copy of "remote operation deployment.csv" (semicolon-delimited).
// Columns: Updated; Organization; Location; Transport domains;
//          remote operation control mode; components; types of research; standards; Contact
//
// To update: paste the new CSV content here, then add any new location strings
// to PRECOMPUTED_COORDS in this same file so geocoding is skipped on startup.
const DATA_CSV = `Updated;Organization;Location;Transport domains;remote operation control mode;components;types of research;standards;Contact
2026-03-23 9:03:07;AstaZero;Gothenburg;"Road;Mining;Military; Drones";;"Remote operation station/center;Remotely operated vehicles;";;;
2026-03-23 9:03:07;AstaZero;Borås;"Road;Mining;Military; Drones";;;;;
2026-04-20 22:26:42;VTI;"Linköping; Vadstena; Namsos";"Railway;";Direct control;"Remote operation station/center;Remotely operated vehicles;";"video quality; latency; radio performance; human factors;";;
2026-04-21 10:19:24;CTAG;Porriño;"Road;";"Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";Internal research;Programa Marco de Evaluación de la Seguridad y  Tecnología de Vehículos Automatizados (Programa ES-AV);
2026-04-21 14:38:24;VTI;Gothenburg;"Road;";"Direct control; Assisted control; Monitoring;";"Remote operation station/center;";Research on the transformation of the professional role for truck drivers when moving towards remote operations.;;
2026-04-21 17:41:19;Applied Autonomy;"Stavanger;";"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;
2026-04-21 17:41:19;Applied Autonomy;"Gothenburg;";"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;
2026-04-21 17:41:19;Applied Autonomy;"Sälen;";"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;
2026-04-21 17:41:19;Applied Autonomy;"Rotterdam;";"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;
2026-04-21 17:41:19;Applied Autonomy;Paris;"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;
2026-04-21 17:41:19;Applied Autonomy;Milan;"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;
2026-04-21 17:41:19;Applied Autonomy;Madrid;"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;
2026-04-21 17:41:19;Applied Autonomy;Arbon;"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;
2026-04-22 7:55:09;VTT Technical Research Centre of Finland;Tampere, Finland;"Road;Machinery;";"Direct control;";"Remote operation station/center;Remotely operated vehicles;";"Remote operation centre for shuttle busses; Modelling and supervisory control of small-scale machinery operations";-;Mikko.Tarkiainen [at] vtt.fi
2026-04-22 10:30:01;DLR (German Aerospace Center);"Braunschweig;";"Aviation (including drones);";"Assisted control;Monitoring ;";"Remote operation station/center;Remotely operated vehicles;";"Projects; Validations, Demonstrations";"STANAG; EASA SORA";
2026-04-22 10:30:01;DLR (German Aerospace Center);Cochstedt;"Aviation (including drones);";"Assisted control;Monitoring ;";"Remote operation station/center;Remotely operated vehicles;";"Projects; Validations, Demonstrations";"STANAG; EASA SORA";
2026-04-22 13:14:04;Voysys AB;Sweden;"Road;Mining;Aviation (including drones);Railway;Sidewalks;Forests;Container yards;Warehouses;Farms;Indoors;";"Monitoring ;Assisted control;Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";N/A (commercial remote operation software solutions);;torkel [at] voysys.se
2026-04-22 13:14:04;Voysys AB;USA;"Road;Mining;Aviation (including drones);Railway;Sidewalks;Forests;Container yards;Warehouses;Farms;Indoors;";"Monitoring ;Assisted control;Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";N/A (commercial remote operation software solutions);;torkel [at] voysys.se
2026-04-23 9:08:25;Applied Autonomy;"Norway;";"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;
2026-04-23 9:08:25;Applied Autonomy;"Sweden;";"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;
2026-04-23 9:08:25;Applied Autonomy;"The Netherlands;";"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;
2026-04-23 9:08:25;Applied Autonomy;"France;";"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;
2026-04-23 9:08:25;Applied Autonomy;"Switzerland;";"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;
2026-04-23 9:08:25;Applied Autonomy;Spain;"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;
2026-04-24 9:14:15;RISE, Industrial System;Boliden;"Mining;Road;";"Direct control;";"Lab based remote operated machine;Remotely operated vehicles;";Operator's 3D perception of remote location;None in particular at the moment;
2026-04-24 9:14:15;RISE, Industrial System;Stockholm;"Mining;Road;";"Direct control;";"Lab based remote operated machine;Remotely operated vehicles;";Operator's 3D perception of remote location;None in particular at the moment;
2026-04-24 9:14:15;RISE, Industrial System;Eskilstuna;"Mining;Road;";"Direct control;";"Lab based remote operated machine;Remotely operated vehicles;";Operator's 3D perception of remote location;None in particular at the moment;
2026-04-27 9:27:40;DLR (German Aerospace Center);Oldenburg, Germany;"Maritime;";"Monitoring;Assisted control;Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"Human-machine cooperation; Automated Shipping & Ports; Maritime Traffic Management";yes;
2026-04-27 11:12:08;DLR (German Aerospace Center);"Braunschweig, Germany; ";"Road;";"Assisted control;Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"user studies (laboratory, field, online); demonstration of remote operation; analysis of real-world operations (interviews with safety drivers); consulting";"German Autonomous Driving Act and entailed ordinance (AFGBV); EU ADS Act (2022); SAE J3016; AVSC Remote Assistance Use Case (2023)";
2026-04-27 11:12:08;DLR (German Aerospace Center);Berlin, Germany;"Road;";"Assisted control;Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"user studies (laboratory, field, online); demonstration of remote operation; analysis of real-world operations (interviews with safety drivers); consulting";"German Autonomous Driving Act and entailed ordinance (AFGBV); EU ADS Act (2022); SAE J3016; AVSC Remote Assistance Use Case (2023)";
2026-04-27 18:15:27;Norwegian University of Science and Technology;"Norway;";"Railway;";"Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"academic research; experiments";yes;
2026-04-27 18:15:27;Norwegian University of Science and Technology;Sweden;"Railway;";"Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"academic research; experiments";yes;
2026-08-04 16:34;Vay Technology ;Las Vegas, USA;"Road;";"Direct control;";"Remotely operated vehicles;Remote operation station/center;";;;Ole Hans
2026-08-04 16:34;Vay Technology ;Antwerp, Belgium;"Road;";"Direct control;";"Remotely operated vehicles;Remote operation station/center;";;;Ole Hans
2026-08-04 16:34;Vay Technology ;Berlin, Germany;"Road;";"Direct control;";"Remotely operated vehicles;Remote operation station/center;";;;Ole Hans
2026-08-04 15:23;Chair of Ergonomics, Technical University of Munich;Munich;"Road;Robotics (Manufacturing, Surgery);";"Monitoring ;Assisted control;Direct control;";"Remote operation station/center;System simulation;";"Control center design and operations; Human–AI collaboration and supervisory control; Work organisation and team coordination; Resilience and safety of socio-technical systems";"German Autonomous Driving Act and entailed ordinance (AFGBV); EU ADS Act (2022); SAE J3016; ISO/CD 17691:2026 Road vehicles — Principles for human remote support  of automated driving systems";n.grabbe [at] tum.de
2026-08-27 15:27;RISE (System Safety and Product Safety);Borås;"Road;Aviation (including drones);";"Monitoring (e.g., monitor and provide overall recommendation such as new destinations or routes);Assisted control (e.g., provide manoeuvre recommendations to a system and let it controls the vehicle by itself);Direct control (e.g., manually control the vehicle in real-time);Autonomous path planning;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"We used a remote-controlled (RC) truck to contribute to the development of CCAM safety assurance framework in a European project called SUNRISE; We used a RC-car to investigate the adaptation of an automotive domain standard (SOTIF: ISO 21448:2022) to the forestry domain in a European project called AGRARSENSE; We used an RC-drone to collect data for generation of traffic scenarios in a European project called SYNERGIES; We used a simulated-truck to develop an AI-assisted framework for cybersecurity assessment in a Swedish Vinnova project called PRECISE; Limits on RO control which investigate what the remote operator should be allowed to do, under which conditions, and when control must be limited or withdrawn? Considers how latency, packet loss, workload, interface design, and limited situational awareness affect safe remote control; Tailoring and assessing the RO ODD: How can remote-operation ODD be defined for a specific use case. Beyond road, traffic, and weather, it should include connectivity, latency, video quality, operator workload, fallback options, and system limits. Assessment can combine safety-case work, ODD templates, simulation, stress testing, and field trials.";"SOTIF (ISO 21448:2022); UNECE New Assessment/Test Method for Automated Driving (NATM)";behrooz.sangchoolie [at] ri.se
2026-09-15 15:43;RISE (SSPA Maritime dept);Gothenburg;"Maritime;";"Adjustable research setup;";"Remote operation station/center;System simulation;Drones;";"Remote control drones; ROC hand-over proceedures; full-stack development";Trying to adhere to industry standards/harmonisations efforts eg. MASS Code and OpenBridge ;`;

// ── Location → Country lookup ─────────────────────────────────────────────────
// Used to derive the "Country" field during location expansion.
// Keys must match the _location strings (post-split, trimmed) exactly.
// Add new entries here when new locations are added to DATA_CSV.
const LOCATION_TO_COUNTRY = {
  "Gothenburg":            "Sweden",
  "Borås":                 "Sweden",
  "Linköping":             "Sweden",
  "Vadstena":              "Sweden",
  "Sälen":                 "Sweden",
  "Boliden":               "Sweden",
  "Stockholm":             "Sweden",
  "Eskilstuna":            "Sweden",
  "Sweden":                "Sweden",
  "Namsos":                "Norway",
  "Stavanger":             "Norway",
  "Norway":                "Norway",
  "Porriño":               "Spain",
  "Madrid":                "Spain",
  "Spain":                 "Spain",
  "Rotterdam":             "Netherlands",
  "The Netherlands":       "Netherlands",
  "Paris":                 "France",
  "France":                "France",
  "Milan":                 "Italy",
  "Arbon":                 "Switzerland",
  "Switzerland":           "Switzerland",
  "Tampere, Finland":      "Finland",
  "Braunschweig":          "Germany",
  "Cochstedt":             "Germany",
  "Oldenburg, Germany":    "Germany",
  "Braunschweig, Germany": "Germany",
  "Berlin, Germany":       "Germany",
  "USA":                   "USA",
  "Las Vegas, USA":        "USA",
  "Antwerp, Belgium":      "Belgium",
  "Munich":                "Germany",
};

// ── Pre-computed coordinates ───────────────────────────────────────────────────
// Keyed by the location string exactly as it appears after semicolon-splitting the
// CSV "Location" column (trimmed). Checked first in geocodeLocation() so Nominatim
// is never called for known locations, keeping startup instant.
//
// When adding rows to DATA_CSV with new locations, add their coordinates here too.
const PRECOMPUTED_COORDS = {
  "Gothenburg":            { lat: 57.70716, lon:  11.96679 },
  "Borås":                 { lat: 57.72101, lon:  12.93930 },
  "Linköping":             { lat: 58.41086, lon:  15.62157 },
  "Vadstena":              { lat: 58.44812, lon:  14.88792 },
  "Namsos":                { lat: 64.46588, lon:  11.49535 },
  "Porriño":               { lat: 42.15810, lon:  -8.61957 },
  "Stavanger":             { lat: 58.96998, lon:   5.73307 },
  "Sälen":                 { lat: 61.15694, lon:  13.26344 },
  "Rotterdam":             { lat: 51.92250, lon:   4.47917 },
  "Paris":                 { lat: 48.85341, lon:   2.34880 },
  "Milan":                 { lat: 45.46416, lon:   9.18951 },
  "Madrid":                { lat: 40.41650, lon:  -3.70256 },
  "Arbon":                 { lat: 47.51631, lon:   9.43525 },
  "Tampere, Finland":      { lat: 61.49791, lon:  23.76010 },
  "Braunschweig":          { lat: 52.26940, lon:  10.52720 },
  "Cochstedt":             { lat: 51.89722, lon:  11.35861 },
  "Sweden":                { lat: 62.00000, lon:  15.00000 }, // inland centre, not coastline
  "USA":                   { lat: 39.78373, lon: -100.44585 },
  "Norway":                { lat: 62.00000, lon:   9.00000 }, // western Norway, not eastern border
  "The Netherlands":       { lat: 52.30000, lon:   5.30000 },
  "France":                { lat: 46.22764, lon:   2.21369 },
  "Switzerland":           { lat: 46.81818, lon:   8.22750 },
  "Spain":                 { lat: 39.89502, lon:  -2.98816 },
  "Boliden":               { lat: 64.86784, lon:  20.38474 },
  "Stockholm":             { lat: 59.33258, lon:  18.06490 },
  "Eskilstuna":            { lat: 59.36661, lon:  16.50786 },
  "Oldenburg, Germany":    { lat: 53.14118, lon:   8.21467 },
  "Braunschweig, Germany": { lat: 52.26940, lon:  10.52720 },
  "Berlin, Germany":       { lat: 52.52437, lon:  13.41053 },
  "Las Vegas, USA":        { lat: 36.17497, lon: -115.13722 },
  "Antwerp, Belgium":      { lat: 51.21989, lon:   4.40346 },
  "Munich":                { lat: 48.13743, lon:  11.57549 },
};
