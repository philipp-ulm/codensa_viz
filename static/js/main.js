/* global d3*/

console.log("Downloading data");

function update() {
  d3.json("/eleDom",d3.autoType).then(data => {
    tarea3(data);
  });
}

d3.csv("/data").then(data => {

  const T1 = tarea1(data);
  vegaEmbed('.chart1', T1);

  update();

  d3.select("#slLavadora").on("change", update);
  d3.select("#slTelevisor").on("change", update);
  d3.select("#slComputador").on("change", update);
  d3.select("#slBombillo").on("change", update);
  d3.select("#slNevera").on("change", update);
  d3.select("#slAireAcond").on("change", update);
  d3.select("#slDucha").on("change", update);
  d3.select("#slPlancha").on("change", update);
  d3.select("#slAspiradora").on("change", update);
  d3.select("#slCargador").on("change", update);
});
