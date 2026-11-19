"use strict";

// ── Survey data ───────────────────────────────────────────────────────────────
// Embedded copy of "remote operation deployment.csv" (semicolon-delimited).
// Columns: Updated; Organization; Location; Transport domains;
//          remote operation control mode; components; types of research; standards; Contact;
//          Source (how the entry was collected, e.g. "online form")
//
// To update: paste the new CSV content here, then add any new location strings
// to PRECOMPUTED_COORDS in this same file so geocoding is skipped on startup.
const DATA_CSV = `Updated;Organization;Location;Transport domains;remote operation control mode;components;types of research;standards;Contact;Source
2026-03-23 09:03;AstaZero;Gothenburg;"Road;Mining;Military; Drones";;"Remote operation station/center;Remotely operated vehicles;";;;;online form
2026-03-23 09:03;AstaZero;Borås;"Road;Mining;Military; Drones";;;;;;online form
2026-04-20 22:26;VTI;"Linköping; Vadstena; Namsos";"Railway;";Direct control;"Remote operation station/center;Remotely operated vehicles;";"video quality; latency; radio performance; human factors;";;;online form
2026-04-21 10:19;CTAG;Porriño;"Road;";"Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";Internal research;Programa Marco de Evaluación de la Seguridad y  Tecnología de Vehículos Automatizados (Programa ES-AV);;online form
2026-04-21 14:38;VTI;Gothenburg;"Road;";"Direct control; Assisted control; Monitoring;";"Remote operation station/center;";Research on the transformation of the professional role for truck drivers when moving towards remote operations.;;;online form
2026-04-21 17:41;Applied Autonomy;"Stavanger;";"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;;online form
2026-04-21 17:41;Applied Autonomy;"Gothenburg;";"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;;online form
2026-04-21 17:41;Applied Autonomy;"Sälen;";"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;;online form
2026-04-21 17:41;Applied Autonomy;"Rotterdam;";"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;;online form
2026-04-21 17:41;Applied Autonomy;Paris;"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;;online form
2026-04-21 17:41;Applied Autonomy;Milan;"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;;online form
2026-04-21 17:41;Applied Autonomy;Madrid;"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;;online form
2026-04-21 17:41;Applied Autonomy;Arbon;"Road;";"Monitoring ; Assisted control; Dispatch;";"Remote operation station/center;System simulation;";"Regulations, Large scale piloting; Remote Assist; Guiding to external mobility actors; Logistics; Public Transport; End user acceptance; ";Mandatory ones based on EU 2022/1426 regulations;;online form
2026-04-22 07:55;VTT Technical Research Centre of Finland;Tampere, Finland;"Road;Machinery;";"Direct control;";"Remote operation station/center;Remotely operated vehicles;";"Remote operation centre for shuttle busses; Modelling and supervisory control of small-scale machinery operations";-;Mikko.Tarkiainen [at] vtt.fi;online form
2026-04-22 10:30;DLR (German Aerospace Center);"Braunschweig;";"Aviation (including drones);";"Assisted control;Monitoring ;";"Remote operation station/center;Remotely operated vehicles;";"Projects; Validations, Demonstrations";"STANAG; EASA SORA";;online form
2026-04-22 10:30;DLR (German Aerospace Center);Cochstedt;"Aviation (including drones);";"Assisted control;Monitoring ;";"Remote operation station/center;Remotely operated vehicles;";"Projects; Validations, Demonstrations";"STANAG; EASA SORA";;online form
2026-04-22 13:14;Voysys AB;Sweden;"Road;Mining;Aviation (including drones);Railway;Sidewalks;Forests;Container yards;Warehouses;Farms;Indoors;";"Monitoring ;Assisted control;Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";N/A (commercial remote operation software solutions);;torkel [at] voysys.se;online form
2026-04-22 13:14;Voysys AB;USA;"Road;Mining;Aviation (including drones);Railway;Sidewalks;Forests;Container yards;Warehouses;Farms;Indoors;";"Monitoring ;Assisted control;Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";N/A (commercial remote operation software solutions);;torkel [at] voysys.se;online form
2026-04-23 09:08;Applied Autonomy;"Norway;";"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;;online form
2026-04-23 09:08;Applied Autonomy;"Sweden;";"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;;online form
2026-04-23 09:08;Applied Autonomy;"The Netherlands;";"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;;online form
2026-04-23 09:08;Applied Autonomy;"France;";"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;;online form
2026-04-23 09:08;Applied Autonomy;"Switzerland;";"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;;online form
2026-04-23 09:08;Applied Autonomy;Spain;"Road;";"Monitoring ;Assisted control;";"Remote operation station/center;";"Testing autonomous technology on public roads; legislation in different countries; integrating into regular public transport, trust from passengers and other road users, passenger assistance; certification and type approvals";yes;;online form
2026-04-24 09:14;RISE, Industrial System;Boliden;"Mining;Road;";"Direct control;";"Lab based remote operated machine;Remotely operated vehicles;";Operator's 3D perception of remote location;None in particular at the moment;;online form
2026-04-24 09:14;RISE, Industrial System;Stockholm;"Mining;Road;";"Direct control;";"Lab based remote operated machine;Remotely operated vehicles;";Operator's 3D perception of remote location;None in particular at the moment;;online form
2026-04-24 09:14;RISE, Industrial System;Eskilstuna;"Mining;Road;";"Direct control;";"Lab based remote operated machine;Remotely operated vehicles;";Operator's 3D perception of remote location;None in particular at the moment;;online form
2026-04-27 09:27;DLR (German Aerospace Center);Oldenburg, Germany;"Maritime;";"Monitoring;Assisted control;Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"Human-machine cooperation; Automated Shipping & Ports; Maritime Traffic Management";yes;;online form
2026-04-27 11:12;DLR (German Aerospace Center);"Braunschweig, Germany; ";"Road;";"Assisted control;Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"user studies (laboratory, field, online); demonstration of remote operation; analysis of real-world operations (interviews with safety drivers); consulting";"German Autonomous Driving Act and entailed ordinance (AFGBV); EU ADS Act (2022); SAE J3016; AVSC Remote Assistance Use Case (2023)";;online form
2026-04-27 11:12;DLR (German Aerospace Center);Berlin, Germany;"Road;";"Assisted control;Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"user studies (laboratory, field, online); demonstration of remote operation; analysis of real-world operations (interviews with safety drivers); consulting";"German Autonomous Driving Act and entailed ordinance (AFGBV); EU ADS Act (2022); SAE J3016; AVSC Remote Assistance Use Case (2023)";;online form
2026-04-27 18:15;Norwegian University of Science and Technology;"Norway;";"Railway;";"Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"academic research; experiments";yes;;online form
2026-04-27 18:15;Norwegian University of Science and Technology;Sweden;"Railway;";"Direct control;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"academic research; experiments";yes;;online form
2026-08-04 16:34;Vay Technology ;Las Vegas, USA;"Road;";"Direct control;";"Remotely operated vehicles;Remote operation station/center;";;;Ole Hans;online form
2026-08-04 16:34;Vay Technology ;Antwerp, Belgium;"Road;";"Direct control;";"Remotely operated vehicles;Remote operation station/center;";;;Ole Hans;online form
2026-08-04 16:34;Vay Technology ;Berlin, Germany;"Road;";"Direct control;";"Remotely operated vehicles;Remote operation station/center;";;;Ole Hans;online form
2026-08-04 15:23;Chair of Ergonomics, Technical University of Munich;Munich;"Road;Robotics (Manufacturing, Surgery);";"Monitoring ;Assisted control;Direct control;";"Remote operation station/center;System simulation;";"Control center design and operations; Human–AI collaboration and supervisory control; Work organisation and team coordination; Resilience and safety of socio-technical systems";"German Autonomous Driving Act and entailed ordinance (AFGBV); EU ADS Act (2022); SAE J3016; ISO/CD 17691:2026 Road vehicles — Principles for human remote support  of automated driving systems";n.grabbe [at] tum.de;online form
2026-08-27 15:27;RISE (System Safety and Product Safety);Borås;"Road;Aviation (including drones);";"Monitoring (e.g., monitor and provide overall recommendation such as new destinations or routes);Assisted control (e.g., provide manoeuvre recommendations to a system and let it controls the vehicle by itself);Direct control (e.g., manually control the vehicle in real-time);Autonomous path planning;";"Remote operation station/center;Remotely operated vehicles;System simulation;";"We used a remote-controlled (RC) truck to contribute to the development of CCAM safety assurance framework in a European project called SUNRISE; We used a RC-car to investigate the adaptation of an automotive domain standard (SOTIF: ISO 21448:2022) to the forestry domain in a European project called AGRARSENSE; We used an RC-drone to collect data for generation of traffic scenarios in a European project called SYNERGIES; We used a simulated-truck to develop an AI-assisted framework for cybersecurity assessment in a Swedish Vinnova project called PRECISE; Limits on RO control which investigate what the remote operator should be allowed to do, under which conditions, and when control must be limited or withdrawn? Considers how latency, packet loss, workload, interface design, and limited situational awareness affect safe remote control; Tailoring and assessing the RO ODD: How can remote-operation ODD be defined for a specific use case. Beyond road, traffic, and weather, it should include connectivity, latency, video quality, operator workload, fallback options, and system limits. Assessment can combine safety-case work, ODD templates, simulation, stress testing, and field trials.";"SOTIF (ISO 21448:2022); UNECE New Assessment/Test Method for Automated Driving (NATM)";behrooz.sangchoolie [at] ri.se;online form
2026-09-15 15:43;RISE (SSPA Maritime dept);Gothenburg;"Maritime;";"Adjustable research setup;";"Remote operation station/center;System simulation;Drones;";"Remote control drones; ROC hand-over proceedures; full-stack development";Trying to adhere to industry standards/harmonisations efforts eg. MASS Code and OpenBridge ;;online form
2026-11-19 11:05;Tesla;Austin, Texas, USA;"Road;";"Assisted control; Direct control;";"Remotely operated vehicles; Remote operation station/center;";;;;manual entry based on https://www.markey.senate.gov/imo/media/doc/company_responses_to_rao_letter.pdf
2026-11-19 11:05;Tesla;Palo Alto, California, USA;"Road;";"Assisted control; Direct control;";"Remote operation station/center;";;;;manual entry based on https://www.markey.senate.gov/imo/media/doc/company_responses_to_rao_letter.pdf
2026-11-19 11:15;Waymo;Arizona, USA;"Road;";"Assisted control;";"Remote operation station/center;";;;;manual entry based on https://www.markey.senate.gov/imo/media/doc/company_responses_to_rao_letter.pdf
2026-11-19 11:15;Waymo;Michigan, USA;"Road;";"Assisted control;";"Remote operation station/center;";;;;manual entry based on https://www.markey.senate.gov/imo/media/doc/company_responses_to_rao_letter.pdf
2026-11-19 11:15;Waymo;Philippines;"Road;";"Assisted control;";"Remote operation station/center;";;;;manual entry based on https://www.markey.senate.gov/imo/media/doc/company_responses_to_rao_letter.pdf
2026-11-19 11:15;Aurora;Coppell, Texas, USA;"Road;";"Assisted control;";"Remote operation station/center;";;;;manual entry based on https://www.markey.senate.gov/imo/media/doc/company_responses_to_rao_letter.pdf
2026-11-19 11:15;Aurora;Pittsburgh, Pennsylvania, USA;"Road;";"Assisted control;";"Remote operation station/center;";;;;manual entry based on https://www.markey.senate.gov/imo/media/doc/company_responses_to_rao_letter.pdf`;

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
  "Austin, Texas, USA":            "USA",
  "Palo Alto, California, USA":    "USA",
  "Arizona, USA":                  "USA",
  "Michigan, USA":                 "USA",
  "Coppell, Texas, USA":           "USA",
  "Pittsburgh, Pennsylvania, USA": "USA",
  "Philippines":                   "Philippines",
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
  "Austin, Texas, USA":            { lat: 30.26715, lon:  -97.74306 },
  "Palo Alto, California, USA":    { lat: 37.44188, lon: -122.14302 },
  "Arizona, USA":                  { lat: 34.39534, lon: -111.76327 }, // state centre
  "Michigan, USA":                 { lat: 43.62120, lon:  -84.68243 }, // state centre
  "Coppell, Texas, USA":           { lat: 32.95457, lon:  -96.98920 },
  "Pittsburgh, Pennsylvania, USA": { lat: 40.44062, lon:  -79.99589 },
  "Philippines":                   { lat: 12.75035, lon:  122.73121 }, // country centre
};
