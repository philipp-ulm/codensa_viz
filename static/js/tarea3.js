/* global d3 */

/*Author: Oscar Acero*/

function getSliderValue(list, eleDom) {
    var value = list.filter(obj => obj.electrodomestico == eleDom);
    return value;
}

function  updateData(data) {
  var list_h = [];
  var nevera_h = d3.select("#slNevera")._groups[0][0].valueAsNumber;
  var lavadora_h = d3.select("#slLavadora")._groups[0][0].valueAsNumber;
  var televisor_h = d3.select("#slTelevisor")._groups[0][0].valueAsNumber;
  var computador_h = d3.select("#slComputador")._groups[0][0].valueAsNumber;
  var bombillo_h = d3.select("#slBombillo")._groups[0][0].valueAsNumber;
  var aireAcond_h = d3.select("#slAireAcond")._groups[0][0].valueAsNumber;
  var ducha_h = d3.select("#slDucha")._groups[0][0].valueAsNumber;
  var placha_h = d3.select("#slPlancha")._groups[0][0].valueAsNumber;
  var aspiradora_h = d3.select("#slAspiradora")._groups[0][0].valueAsNumber;
  var cargador_h = d3.select("#slCargador")._groups[0][0].valueAsNumber;

  nevera_h = {"electrodomestico": "Nevera", "horas": nevera_h};
  lavadora_h = {"electrodomestico": "Lavadora", "horas": lavadora_h};
  televisor_h  = {"electrodomestico": "Televisor", "horas": televisor_h};
  computador_h = {"electrodomestico": "Computador", "horas": computador_h};
  bombillo_h = {"electrodomestico": "Bombillo", "horas": bombillo_h };
  aireAcond_h = {"electrodomestico": "Aire acondicionado", "horas": aireAcond_h};
  ducha_h = {"electrodomestico": "Ducha eléctrica", "horas": ducha_h};
  placha_h = {"electrodomestico": "Plancha", "horas": placha_h};
  aspiradora_h = {"electrodomestico": "Aspiradora", "horas": aspiradora_h};
  cargador_h = {"electrodomestico": "Cargador celular", "horas": cargador_h};

  list_h.push(nevera_h);
  list_h.push(lavadora_h);
  list_h.push(televisor_h);
  list_h.push(computador_h);
  list_h.push(bombillo_h);
  list_h.push(aireAcond_h);
  list_h.push(ducha_h);
  list_h.push(placha_h);
  list_h.push(aspiradora_h);
  list_h.push(cargador_h);

  console.log("horas electrodomesticos: ", list_h);

  for (var i=0; i<data.length; i++){
      var eleDom = data[i].electrodomestico;
      var horas =  getSliderValue(list_h, eleDom);
      if (horas.length > 0) {
        h =  horas[0].horas;
        var tarifa = data[i].valorConsumo_Hora * h
        data[i]["tarifa"] = tarifa;
        data[i]["horas"] = h;
        data[i]["consumo_kw"] = data[i].consumo_kwH * h;
        console.log("electrodomestico :", eleDom, "tarifa: ", data[i]["tarifa"]);
      }else{
          data[i]["tarifa"] = 0;
          data[i]["horas"] = 0;
      }

  }


  const data_f = data.filter(obj => obj.tarifa > 0)
    .sort((a,b) => d3.ascending(a.tarifa, b.tarifa));
  return data_f

}

function tarea3(data) {
  console.log("Data loaded", data);

  d3.select("#chart").html("");
  d3.select("#chart").append("H6")
    .style('align', 'center')
    .text("Tarifa por electrodoméstico");
  d3.select("#chart").append("br");

  data_filtered = updateData(data);

  const width = 700;
  const height = 400;

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Tarifa: </strong> <span style='color:white'>" + d3.format("($.2f")(d.tarifa) + "</span><br>" +
    "<strong>Horas: </strong> <span style='color:white'>" + (d.horas) + "</span><br>" +
    "<strong>Consumo Kw: </strong> <span style='color:white'>" + d3.format("(.2f")(d.consumo_kw) + "</span><br>";
  });

  svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  const margin = ({top: 20, right: 100, bottom: 50, left: 100}),
  iwidth = width - margin.left - margin.right,
  iheight = height - margin.top - margin.bottom;

  const gBase = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg.call(tip);

  const x = d3.scaleLinear()
  .domain([0, d3.max(data_filtered, d => d.tarifa) ])
  .range([0, iwidth])
  .nice();

  const y = d3.scaleBand()
  .domain(d3.set(data_filtered.map(d => d.electrodomestico)).values())
  .range([iheight, 0])
  .padding(0.3);

  gBase.append("g")
  .attr('class', 'grid')
  .attr("transform", `translate(0, ${iheight})`)
  .call(d3.axisBottom(x)
  //  .scale(x)
  //  .tickSize(-height, 0, 0)
    .tickFormat(d3.format("$.2s"))
  )
  .style("font", "10px times");

  // Add X axis label:
  svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", (width/2)+100)
  .attr("y", iheight +  60)
  .text("Valor tarifa(pesos)");

  gBase.append("g")
  .call(d3.axisLeft(y))
  .style("font", "10px times");



  function onMouseOver() {
    let text = "Valor consumo: " + d.tarifa;
    console.log("Text tooltip ", text);
    d3.select(this)
    .style("fill", "red");
    tip.show;
  }


  function onMouseOut() {
  d3.select(this)
  .style("fill", "#1F90CE");
  tip.hide;
  }


  gBase.selectAll(".item")
  .data(data_filtered)
  .join("rect")
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide)
  .attr("class", "item")
  .transition()
  .duration(750)
  .delay((d, i) => { return i * 150; })
  .attr("x", 0 )
  .attr("y", d => y(d.electrodomestico) )
  .attr("width", d => x(d.tarifa ) )
  .attr("height", y.bandwidth() )
  .style("opacity", 1.0)
  .style("fill", "#1F90CE");


  var total_tarifa = 0
  data_filtered.forEach(function (obj) {
    total_tarifa += obj.tarifa;
  });
  console.log("total tarifa: ", total_tarifa);

  var total_consumo = 0
  data_filtered.forEach(function (obj) {
    total_consumo += obj.consumo_kw;
  });
  console.log("total consumo: ", total_consumo);

  var total_tarifa_text = "Total tarifa: " + d3.format("($.2f")(total_tarifa);
  var total_consumo_text = "Total consumo: " + d3.format("(.2f")(total_consumo) + " Kw";

  d3.select("#chart").append("H6")
    .style('align', 'center')
    .text(total_tarifa_text);
  d3.select("#chart").append("H6")
      .style('align', 'center')
      .text(total_consumo_text);
}
