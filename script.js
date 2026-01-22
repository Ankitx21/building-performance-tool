/*************************************************
 * CONSTANTS
 *************************************************/
const ASSURE_EPI_TARGET = 75;
const DEFAULT_SPECIFIC_YIELD = 1500;
const NBC_LPCD = 45;

/*************************************************
 * BEE STAR RATING EQUATIONS (SAMPLE – WORKING)
 * Replace with official BEE equations later
 *************************************************/
const beeEquations = {
  "Composite": {
    "Large": {
      "5Star": { a: 0.75, c: 20 },
      "4Star": { a: 0.80, c: 30 },
      "3Star": { a: 0.85, c: 40 },
      "2Star": { a: 0.90, c: 50 },
      "1Star": { a: 0.95, c: 60 }
    },
    "Medium": {
      "5Star": { a: 0.9, c: 20 },
      "4Star": { a: 0.95, c: 30 },
      "3Star": { a: 1.0, c: 40 },
      "2Star": { a: 1.05, c: 50 },
      "1Star": { a: 1.1, c: 60 }
    },
    "Small": {
      "5Star": { a: 0.45, c: 20 },
      "4Star": { a: 0.5, c: 30 },
      "3Star": { a: 0.55, c: 40 },
      "2Star": { a: 0.6, c: 50 },
      "1Star": { a: 0.65, c: 60 }
    }
  },

  "Warm & Humid": {
    "Large": {
      "5Star": { a: 0.7, c: 25 },
      "4Star": { a: 0.75, c: 35 },
      "3Star": { a: 0.8, c: 45 },
      "2Star": { a: 0.85, c: 55 },
      "1Star": { a: 0.9, c: 65 }
    },
    "Medium": {
      "5Star": { a: 0.7, c: 25 },
      "4Star": { a: 0.75, c: 35 },
      "3Star": { a: 0.8, c: 45 },
      "2Star": { a: 0.85, c: 55 },
      "1Star": { a: 0.9, c: 65 }
    },
    "Small": {
      "5Star": { a: 0.5, c: 25 },
      "4Star": { a: 0.55, c: 35 },
      "3Star": { a: 0.6, c: 45 },
      "2Star": { a: 0.65, c: 55 },
      "1Star": { a: 0.7, c: 65 }
    }
  },

  "Hot & Dry": {
    "Large": {
      "5Star": { a: 0.9, c: 15 },
      "4Star": { a: 0.95, c: 25 },
      "3Star": { a: 1.0, c: 35 },
      "2Star": { a: 1.05, c: 45 },
      "1Star": { a: 1.1, c: 55 }
    },
    "Medium": {
      "5Star": { a: 1.05, c: 15 },
      "4Star": { a: 1.1, c: 25 },
      "3Star": { a: 1.15, c: 35 },
      "2Star": { a: 1.2, c: 45 },
      "1Star": { a: 1.25, c: 55 }
    },
    "Small": {
      "5Star": { a: 1.55, c: 15 },
      "4Star": { a: 0.6, c: 25 },
      "3Star": { a: 0.65, c: 35 },
      "2Star": { a: 0.7, c: 45 },
      "1Star": { a: 0.75, c: 55 }
    }
  },

  "Temperate": {
    "Large": {
      "5Star": { a: 0.9, c: 15 },
      "4Star": { a: 0.95, c: 25 },
      "3Star": { a: 1.0, c: 35 },
      "2Star": { a: 1.05, c: 45 },
      "1Star": { a: 1.1, c: 55 }
    },
    "Medium": {
      "5Star": { a: 1.05, c: 15 },
      "4Star": { a: 1.1, c: 25 },
      "3Star": { a: 1.15, c: 35 },
      "2Star": { a: 1.2, c: 45 },
      "1Star": { a: 1.25, c: 55 }
    },
    "Small": {
      "5Star": { a: 1.55, c: 15 },
      "4Star": { a: 0.6, c: 25 },
      "3Star": { a: 0.65, c: 35 },
      "2Star": { a: 0.7, c: 45 },
      "1Star": { a: 0.75, c: 55 }
    }
  }
};


/*************************************************
 * CITY → CLIMATE MAP
 *******************

/*************************************************
 * CLIMATE + STATE + CITY DATA (SINGLE SOURCE)
 *************************************************/
let climateRawData = [];
let cityClimateMap = {};

fetch("Location_CZ_Latitude.json")
  .then(res => res.json())
  .then(data => {
    climateRawData = data;

    data.forEach(item => {
      cityClimateMap[item.City.trim().toLowerCase()] = {
        zone: item.Climate_Zone.trim(),
        state: item.State,
        lat: item.Lat,
        lon: item.Longitude
      };
    });

    console.log("✅ Climate JSON loaded");
  })
  .catch(err => console.error("❌ Climate JSON load error", err));



/*************************************************
 * SAFE INPUT READERS (CRITICAL)
 *************************************************/
function readNumber(id) {
  const el = document.getElementById(id);
  if (!el) return NaN;
  const v = el.value;
  if (v === null || v === undefined || v.trim() === "") return NaN;
  return Number(v);
}

function readText(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

/*************************************************
 * STATE → CITY DROPDOWN (FIXED)
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {

  let climateRawData = [];

  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");

  if (!stateSelect || !citySelect) {
    console.error("State or City select not found in DOM");
    return;
  }

  fetch("Location_CZ_Latitude.json")
    .then(res => {
      if (!res.ok) throw new Error("JSON not loaded");
      return res.json();
    })
    .then(data => {
      console.log("✅ Climate JSON loaded:", data.length, "rows");

      climateRawData = data;

      // Populate States
      const states = [...new Set(data.map(d => d.State))].sort();

      states.forEach(state => {
        const opt = document.createElement("option");
        opt.value = state;
        opt.textContent = state;
        stateSelect.appendChild(opt);
      });

      console.log("✅ States populated:", stateSelect.options.length);
    })
    .catch(err => console.error("❌ Climate JSON error:", err));

  stateSelect.addEventListener("change", () => {
    citySelect.innerHTML = `<option value="">Select City</option>`;
    citySelect.disabled = true;

    if (!stateSelect.value) return;

    climateRawData
      .filter(d => d.State === stateSelect.value)
      .forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.City;
        opt.textContent = d.City;
        citySelect.appendChild(opt);
      });

    citySelect.disabled = false;
  });

});


/*************************************************
 * BUILDING SIZE
 *************************************************/
function getBuildingSize(areaSqm) {
  if (areaSqm <= 10000) return "Small";
  if (areaSqm <= 30000) return "Medium";
  return "Large";
}

/*************************************************
 * CORE CALCULATION (FINAL)
 *************************************************/
function calculateBuildingPerformance(inputs) {

  const {
    city,
    areaSqm,
    energyKWh,
    energyPeriod,
    coolingTR,
    contractDemandKVA,
    dgSize,
    renewableValue,
    acAreaPercentage,
    waterKL,      // ✅ ADD
    occupants,
    // lpcd
  } = inputs;


  /* ---------- ENERGY ---------- */
  const energyAnnualKWh =
    energyPeriod === "monthly" ? energyKWh * 12 : energyKWh;

  /* ---------- AREA ---------- */
  const areaSqft = areaSqm / 0.092903;

  /* ---------- CLIMATE ---------- */
 const climateZone =
  cityClimateMap[city.toLowerCase()]?.zone || "Unknown";


  /* ---------- BUILDING SIZE ---------- */
  const buildingSize = getBuildingSize(areaSqm);

  /* ---------- EPI ---------- */
  const epi = energyAnnualKWh / areaSqm;

  /* ---------- ASSURE EPI ---------- */
  const assureStatus =
    epi <= ASSURE_EPI_TARGET
      ? { text: "Within target", class: "metric-good" }
      : { text: "Above target", class: "metric-bad" };

/* ---------- NET ENERGY (FINAL & CORRECT) ---------- */

  // Annual demand
  const annualEnergyDemand =
    energyPeriod === "monthly"
      ? energyKWh * 12
      : energyKWh;

  // Renewable generation (already annual kWh)
  const renewableGenKWh =
    !isNaN(renewableValue) && renewableValue > 0
      ? renewableValue
      : 0;

  // Net balance
  const netEnergy = renewableGenKWh - annualEnergyDemand;

  // Tolerance
  const EPS = Math.max(1, 0.005 * annualEnergyDemand);

  let netStatus = {
    text: "Net Negative — More energy used than produced",
    class: "badge-negative"
  };

  if (renewableGenKWh > 0) {
    if (netEnergy > EPS) {
      netStatus = {
        text: "Your building generates more energy than it consumes — extra energy can be exported for savings.",
        class: "badge-positive"
      };
    } else if (Math.abs(netEnergy) <= EPS) {
      netStatus = {
        text: "Net Zero — Your building generation and consumption are nearly equal",
        class: "badge-neutral"
      };
    }
  }


  /* ================= BEE STAR RATING ================= */
/* ================= BEE STAR RATING (USER-GUIDED) ================= */
let starRating = {
  text: "Input required",
  note: "",
  class: "badge-warn"
};

/* Missing prerequisites */
if (!city || climateZone === "Unknown") {
  starRating.note = "Select a valid City (climate zone required)";
}
else if (isNaN(areaSqm) || areaSqm <= 0) {
  starRating.note = "Enter Built-up Area";
}
else if (isNaN(energyKWh) || energyKWh <= 0) {
  starRating.note = "Enter Electricity Consumption";
}
else if (isNaN(acAreaPercentage) || acAreaPercentage <= 0 || acAreaPercentage > 100) {
  starRating.note = "Enter Air-conditioned Area (%)";
}
else {
  const zoneKey = climateZone.trim();
  const eqByZone = beeEquations[zoneKey];
  const eq = eqByZone ? eqByZone[buildingSize] : null;

  if (!eq) {
    starRating.note = "BEE equation not available for this climate";
  }
  else {
    const acPct = acAreaPercentage;

    const epi5 = (eq["5Star"].a * acPct) + eq["5Star"].c;
    const epi4 = (eq["4Star"].a * acPct) + eq["4Star"].c;
    const epi3 = (eq["3Star"].a * acPct) + eq["3Star"].c;
    const epi2 = (eq["2Star"].a * acPct) + eq["2Star"].c;
    const epi1 = (eq["1Star"].a * acPct) + eq["1Star"].c;

    if (epi <= epi5)
      starRating = { text: "★★★★★ (5 Star)", note: "Excellent performance", class: "badge-good" };
    else if (epi <= epi4)
      starRating = { text: "★★★★☆ (4 Star)", note: "Very good performance", class: "badge-good" };
    else if (epi <= epi3)
      starRating = { text: "★★★☆☆ (3 Star)", note: "Average performance", class: "badge-warn" };
    else if (epi <= epi2)
      starRating = { text: "★★☆☆☆ (2 Star)", note: "Below average", class: "badge-bad" };
    else if (epi <= epi1)
      starRating = { text: "★☆☆☆☆ (1 Star)", note: "Poor performance", class: "badge-bad" };
    else
      starRating = { text: "No Star", note: "Does not meet BEE criteria", class: "badge-bad" };
  }
}


/* ================= HVAC SIZING KPI ================= */
let hvacSizing = {
  value: "",
  status: "Input required",
  note: "Enter Built-up Area and AC Capacity",
  class: "rating-fair"
};

if (areaSqft <= 0 || isNaN(areaSqft)) {
  hvacSizing.note = "Enter Built-up Area";
}
else if (isNaN(coolingTR) || coolingTR <= 0) {
  hvacSizing.note = "Enter Installed AC Capacity (TR)";
}
else {
  const sfPerTR = areaSqft / coolingTR;

  if (sfPerTR >= 700 && sfPerTR <= 800) {
    hvacSizing = {
      value: `${sfPerTR.toFixed(0)} sqft/TR`,
      status: "Efficient sizing",
      note: "Within recommended range",
      class: "rating-excellent"
    };
  }
  else if (sfPerTR < 700) {
    hvacSizing = {
      value: `${sfPerTR.toFixed(0)} sqft/TR`,
      status: "Oversized",
      note: "Low sqft/TR",
      class: "rating-poor"
    };
  }
  else {
    hvacSizing = {
      value: `${sfPerTR.toFixed(0)} sqft/TR`,
      status: "Possibly undersized",
      note: "High sqft/TR",
      class: "rating-fair"
    };
  }
}




/* ================= CONTRACT / DG SIZING KPI (STRUCTURED) ================= */
const PF = 0.9;

let demandSizing = {
  contract: "—",
  dg: "—",
  status: "—",
  class: "rating-fair"
};

if (areaSqft > 0) {

  const cdKW = !isNaN(contractDemandKVA) ? contractDemandKVA * PF : NaN;
  const dgKW = !isNaN(dgSize) ? dgSize * PF : NaN;

  const cdWsf = !isNaN(cdKW) ? (cdKW * 1000) / areaSqft : NaN;
  const dgWsf = !isNaN(dgKW) ? (dgKW * 1000) / areaSqft : NaN;

  const cdOk = !isNaN(cdWsf) && cdWsf < 5;
  const dgOk = !isNaN(dgWsf) && dgWsf < 5;

  demandSizing.contract = !isNaN(cdWsf)
    ? `${cdWsf.toFixed(2)} W/sqft`
    : "Not provided";

  demandSizing.dg = !isNaN(dgWsf)
    ? `${dgWsf.toFixed(2)} W/sqft`
    : "Not provided";

  if (cdOk && dgOk) {
    demandSizing.status = "Efficient";
    demandSizing.class = "rating-excellent";
  } else {
    demandSizing.status = "Above target";
    demandSizing.class = "rating-poor";
  }
}

console.log("DEMAND DEBUG:", demandSizing);

/* ================= LPCD CALCULATION ================= */
let lpcd = NaN;

if (
  !isNaN(waterKL) &&
  waterKL > 0 &&
  !isNaN(occupants) &&
  occupants > 0
) {
  // Annual kL → litres
  const annualLitres = waterKL * 1000;

  // LPCD calculation (220 working days)
  lpcd = annualLitres / (occupants * 220);
}

console.log("WATER DEBUG:", {
  waterKL,
  occupants,
  lpcd
});




  /* ---------- WATER ---------- */
/* ================= WATER (NBC LPCD ONLY) ================= */
let waterStatus = {
  text: `Not provided enter water consumption and occupants`,
  class: "rating-fair"
};

if (!isNaN(lpcd)) {
  if (lpcd <= NBC_LPCD) {
    waterStatus = {
      text: `${lpcd.toFixed(1)} lpcd — Within NBC`,
      class: "rating-excellent"
    };
  } else {
    waterStatus = {
      text: `${lpcd.toFixed(1)} lpcd — Above NBC`,
      class: "rating-poor"
    };
  }
}

  /* ---------- DEBUG (KEEP FOR NOW) ---------- */
  console.log("DEBUG:", {
    areaSqm,
    energyAnnualKWh,
    // renewableKwp,
    // renewablePct,
    // renewableGenKWh,
    // hasRenewables,
    epi
  });

  return {
    city,
    climateZone,
    buildingSize,
    epi,
    assureStatus,
    netStatus,
    starRating,
    hvacSizing,
    demandSizing,
    // hvacResult,
    waterStatus
  };
}

/*************************************************
 * ASSESS BUTTON (FINAL – VALIDATED)
 *************************************************/
document.getElementById("assessBtn").addEventListener("click", () => {

  /* ========= COLLECT INPUTS ========= */
  const inputs = {
    city: readText("city"),
    areaSqm: readNumber("area"),
    energyKWh: readNumber("energy"),
    energyPeriod: readText("energyPeriod"),
    coolingTR: readNumber("acCapacity"),
    contractDemandKVA: readNumber("contractDemand"),
    dgSize: readNumber("dgSize"),
    renewableValue: readNumber("renewableValue"), 
    acAreaPercentage: readNumber("acArea"),
    waterKL: readNumber("water"),        // ✅ ADD
    occupants: readNumber("occupants"),  // ✅ ADD
    // lpcd: readNumber("lpcd")
  };

  /* ========= BASIC REQUIRED CHECK ========= */
/* ========= CITY REQUIRED (ONLY POPUP CASE) ========= */
if (!inputs.city) {
  alert("Please select State and City to continue");
  return;
}


  /* ========= RUN CALCULATION ========= */
  const results = calculateBuildingPerformance(inputs);
  renderResults(results);
});

/*************************************************
 * RENDER RESULTS (MATCHES HTML EXACTLY)
 *************************************************/
function renderResults(r) {


  const beeEl = document.getElementById("outStarRating");

  if (r.starRating.text === "Input required") {
    beeEl.innerHTML = `
      <span class="rating-fair">
        Input required —
        <b>City</b>,
        <b>Built-up Area</b>,
        <b>Electricity</b>,
        <b>AC Area (%)</b>
      </span>
    `;
  } else {
    beeEl.innerHTML = `
      <span class="badge ${r.starRating.class}">
        ${r.starRating.text}
      </span>
    `;
  }


  const epiEl = document.getElementById("outEpiValue");

  if (isNaN(r.epi)) {
    epiEl.innerHTML = `
      <span class="rating-fair">
        Input required — Enter <b>Built-up Area</b> and <b>Electricity Consumption</b>
      </span>
    `;
  } else {
    epiEl.textContent = `${Math.round(r.epi)} kWh/m²/year`;
  }



  const assureEl = document.getElementById("outAssureEpi");

  if (isNaN(r.epi)) {
    assureEl.innerHTML = `
      <span class="rating-fair">
        Cannot evaluate — EPI not available
      </span>
    `;
    assureEl.className = "metric-value";
  } else {
    const within = r.epi <= ASSURE_EPI_TARGET;

    assureEl.textContent = within
      ? `${Math.round(r.epi)} — ✅ Within target`
      : `${Math.round(r.epi)} — ❌ Above target`;

    assureEl.className = within
      ? "metric-value metric-good"
      : "metric-value metric-bad";
  }


  document.getElementById("outNetEnergy").innerHTML =
    `<span class="${r.netStatus.class}">
      ${r.netStatus.text}
    </span>`;


/* ================= HVAC & ELECTRICAL ================= */
document.getElementById("outHvac").innerHTML = `
  <div class="kpi-row">
    <div class="kpi-left">
      <span class="kpi-icon">❄️</span>
      <div>
        <div class="kpi-title">
          HVAC sizing
          <span class="kpi-ref">(Assure KPI: 700–800 sqft/TR)</span>
        </div>
      </div>
    </div>

    <div class="kpi-right ${r.hvacSizing.class}">
      ${r.hvacSizing.value}
      ${r.hvacSizing.status !== "—" ? ` — ${r.hvacSizing.status}` : ""}
      ${r.hvacSizing.note ? ` (${r.hvacSizing.note})` : ""}
    </div>
  </div>
`;

const demandEl = document.getElementById("outDemand");

const contractProvided = r.demandSizing.contract !== "Not provided";
const dgProvided = r.demandSizing.dg !== "Not provided";

let contractLine = "";
let dgLine = "";
let statusLine = "";

if (contractProvided) {
  contractLine = `
    <div>
      <span class="kpi-label">Contract</span>
      <span class="kpi-value">${r.demandSizing.contract}</span>
    </div>
  `;
} else {
  contractLine = `
    <div class="kpi-missing">
      Enter Contract Demand (kVA)
    </div>
  `;
}

if (dgProvided) {
  dgLine = `
    <div>
      <span class="kpi-label">DG Set</span>
      <span class="kpi-value">${r.demandSizing.dg}</span>
    </div>
  `;
} else {
  dgLine = `
    <div class="kpi-missing">
      Enter DG Set Size (kVA)
    </div>
  `;
}

/* Status only if at least one input exists */
if (contractProvided || dgProvided) {
  statusLine = `
    <div class="kpi-status ${r.demandSizing.class}">
      ${r.demandSizing.status}
    </div>
  `;
}

demandEl.innerHTML = `
  <div class="kpi-row">
    <div class="kpi-left">
      <span class="kpi-icon">⚡</span>
      <div>
        <div class="kpi-title">
          Contract Demand / DG set sizing
          <span class="kpi-ref">(ASSURE KPI: &lt; 5 W/sqft)</span>
        </div>
      </div>
    </div>

    <div class="kpi-right">
      <div class="kpi-split ${r.demandSizing.class}">
        ${contractLine}
        ${dgLine}
        ${statusLine}
      </div>
    </div>
  </div>
`;






/* ================= WATER ================= */
document.getElementById("outWater").innerHTML = `
  <div class="kpi-row">
    <div class="kpi-left">
      <span class="kpi-icon">💧</span>
      <div>
        <div class="kpi-title">
          Water Efficiency
          <span class="kpi-ref">(NBC 45 lpcd)</span>
        </div>
      </div>
    </div>

    <div class="kpi-right ${r.waterStatus.class}">
      ${r.waterStatus.text}
    </div>
  </div>
`;




  /* ================= SHOW RESULTS ================= */
const resultsEl = document.getElementById("results");
  resultsEl.classList.remove("hidden");

  // Force refresh animation
  resultsEl.classList.remove("results-refresh");
  void resultsEl.offsetWidth; // 👈 forces reflow
  resultsEl.classList.add("results-refresh");
}

