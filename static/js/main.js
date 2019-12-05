/* global d3*/

console.log("Downloading data");

d3.csv("/eleDom").then(data => {
  console.log("Data loaded", data);
});

d3.csv("/data").then(data => {

  console.log("Data loaded", data);

  const T1 = tarea1(data);
  vegaEmbed('.chart1', T1);

  // const T2 = tarea2(data);
  // vegaEmbed('.chart2', T2);
  //
  // const T3 = tarea3(data);
  // vegaEmbed('.chart3', T3);
});
