/* https://www.youtube.com/watch?v=424eiD9mVYY */
/* https://www.youtube.com/watch?v=d7wTA9F-l8c */

// get img elements from DOM for handleAnatomy()
const scales = document.querySelector("#scales");
const shell = document.querySelector("#shell");
const nervous = document.querySelector("#nervous");
const circulatory = document.querySelector("#circulatory");
const anat_stack = [scales, shell, nervous, circulatory];

// get img elements from DOM for handleWaterColumn()
const wc_zones = document.querySelector("#zones");
const wc_phyto = document.querySelector("#phyto");
const wc_carbon = document.querySelector("#carbon");
const wc_snail = document.querySelector("#snail");
const wc_stack = [wc_zones, wc_phyto, wc_carbon, wc_snail];

// get img elements from DOM for handleSclerite()
const sclerite_sulfur = document.querySelector("#sclerite_sulfur");
const sclerite_bacteria = document.querySelector("#sclerite_bacteria");
const sclerite_iron = document.querySelector("#sclerite_iron");
const sclerite_delta = document.querySelector("#sclerite_delta");
const sclerite_compare = document.querySelector("#sclerite_compare");
const sclerite_final = document.querySelector("#sclerite_final");
const sclerite_stack = [
  sclerite_sulfur,
  sclerite_bacteria,
  sclerite_iron,
  sclerite_delta,
  sclerite_compare,
  sclerite_final,
];

async function getJSON(url) {
  let response = await fetch(url);
  json = await response.json();
  return json;
}

async function getLeafletConfig() {
  let config = await getJSON("leaflet_config.json");
  config.layers = [
    new L.TileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "© Esri © OpenStreetMap Contributors",
      }
    ),
  ];
  return config;
}

// ============ Leaflet drawing functions ============ //
function plotCoords(coords, color, radius) {
  for (const [key, value] of Object.entries(coords)) {
    point = L.circle(coords[key], {
      color: color,
      fillColor: color,
      fillOpacity: 0.5,
      radius: radius,
    });
    map.addLayer(point);
  }
}

function plotPolyLines(coords, color) {
  for (const [key, value] of Object.entries(coords)) {
    polyline = L.polyline(coords[key], {
      color: color,
    });
    map.addLayer(polyline);
  }
}

function plotToolTips(coords) {
  for (const [key, value] of Object.entries(coords)) {
    tooltip = L.tooltip(coords[key].coords, {
      content: coords[key].content,
      direction: coords[key].direction,
      permanent: true,
    });
    map.addLayer(tooltip);
  }
}

function removeLayers() {
  map.eachLayer((layer) => {
    if (!(layer instanceof L.TileLayer)) {
      map.removeLayer(layer);
    }
  });
}

// =================================================== //

function resetVisible(stack) {
  // Make all images in stack invisible
  stack.forEach((cel) => cel.classList.remove("visible"));
}

// get .step divs from DOM for markActiveStep()
let steps = document.querySelectorAll(".step");

function markActiveStep(el) {
  steps.forEach((step) => step.classList.remove("active"));
  el.classList.add("active");
}

function handleAnatomy(stepData) {
  if (stepData == "anat_b") {
    resetVisible(anat_stack);
    scales.classList.add("visible");
  } else if (stepData == "anat_c") {
    resetVisible(anat_stack);
    shell.classList.add("visible");
  } else if (stepData == "anat_d") {
    resetVisible(anat_stack);
    nervous.classList.add("visible");
  } else if (stepData == "anat_e") {
    resetVisible(anat_stack);
    circulatory.classList.add("visible");
  } else {
    resetVisible(anat_stack);
  }
}

function handleWaterColumn(stepData) {
  if (stepData == "wc_a") {
    resetVisible(wc_stack);
    wc_zones.classList.add("visible");
  } else if (stepData == "wc_b") {
    resetVisible(wc_stack);
    wc_phyto.classList.add("visible");
  } else if (stepData == "wc_c") {
    resetVisible(wc_stack);
    wc_carbon.classList.add("visible");
  } else if (stepData == "wc_d") {
    resetVisible(wc_stack);
    wc_snail.classList.add("visible");
  } else {
    resetVisible(wc_stack);
    wc_zones.classList.add("visible");
  }
}

function handleMap(stepData) {
  if (stepData == "map_a") {
    map.flyTo([-19.946597, 62.654194], 3);
    removeLayers();
    plotPolyLines(ridgeCoords, "red");
    plotToolTips(tooltipCoords.ridges);
  } else if (stepData == "map_b") {
    map.flyTo([-17.808091, 65.355545], 3.5);
    removeLayers();
    plotCoords(ventCoords, "red", 50000);
  } else if (stepData == "map_c") {
    map.flyTo([-28.786227, 57.832342], 4);
    removeLayers();
    for (const [key, value] of Object.entries(ventsInfo)) {
      plotCoords({ key: ventsInfo[key].coords }, "red", 500000);
    }
    plotToolTips(tooltipCoords.vents);
  } else if (stepData == "map_d") {
    map.flyTo([-19.545, 65.85], 4.5);
    removeLayers();
    plotCoords({ key: ventsInfo.solitaire.coords }, "red", 500000);
    plotToolTips({ solitaire: tooltipCoords.vents.solitaire });
  } else if (stepData == "map_e") {
    map.flyTo([-28.786227, 57.832342], 4);
    removeLayers();
    for (const [key, value] of Object.entries(ventsInfo)) {
      if (ventsInfo[key].east) {
        plotCoords({ key: ventsInfo[key].coords }, "red", 500000);
      } else {
        plotCoords({ key: ventsInfo[key].coords }, "blue", 500000);
      }
    }
    plotToolTips(tooltipCoords.vents);
  } else {
    map.flyTo([5.236302, 79.006576], 2.5);
    removeLayers();
  }
}

function handleSclerite(stepData) {
  if (stepData == "sclerite_a") {
    resetVisible(sclerite_stack);
    sclerite_sulfur.classList.add("visible");
  } else if (stepData == "sclerite_b") {
    resetVisible(sclerite_stack);
    sclerite_sulfur.classList.add("visible");
    sclerite_bacteria.classList.add("visible");
  } else if (stepData == "sclerite_c") {
    resetVisible(sclerite_stack);
    sclerite_sulfur.classList.add("visible");
    sclerite_bacteria.classList.add("visible");
    sclerite_iron.classList.add("visible");
  } else if (stepData == "sclerite_d") {
    resetVisible(sclerite_stack);
    sclerite_sulfur.classList.add("visible");
    sclerite_bacteria.classList.add("visible");
    sclerite_delta.classList.add("visible");
  } else if (stepData == "sclerite_e") {
    resetVisible(sclerite_stack);
    sclerite_compare.classList.add("visible");
  } else if (stepData == "sclerite_f") {
    resetVisible(sclerite_stack);
    sclerite_final.classList.add("visible");
  } else {
    resetVisible(sclerite_stack);
  }
}

var map;
var ridgeCoords;
var ventCoords;
var tooltipCoords;
var ventsInfo;

async function main() {
  const leafletConfig = await getLeafletConfig();
  ridgeCoords = await getJSON("ridge_coords.json");
  ventCoords = await getJSON("vent_coords.json");
  tooltipCoords = await getJSON("tooltips.json");
  ventsInfo = await getJSON("vents_info.json");

  map = new L.Map("map", leafletConfig);

  // Instantiate Scrollama
  const scroller = scrollama();

  // Setup the instance, pass callback functions
  scroller
    .setup({
      step: ".step",
      offset: 0.5,
    })
    .onStepEnter((response) => {
      // Handle step enter
      console.log("enter", response);

      let el = response.element;
      let stepData = el.attributes["data-step"].value;

      markActiveStep(el);

      if (stepData.startsWith("anat_")) {
        handleAnatomy(stepData);
      } else if (stepData.startsWith("map_")) {
        handleMap(stepData);
      } else if (stepData.startsWith("wc_")) {
        handleWaterColumn(stepData);
      } else if (stepData.startsWith("sclerite_")) {
        handleSclerite(stepData);
      }
    })
    .onStepExit((response) => {
      console.log("exit", response);
      let el = response.element;
      el.classList.remove("active");
    });
  // end scroller
}

main();
