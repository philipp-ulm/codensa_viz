/* global vl */

/*Author: Philipp Freiherr von Ulm-Erbach*/

function tarea1(data) {
  const brush = vl.selectInterval().encodings('x'); // limit selection to x-axis (year) values
  const click = vl.selectMulti().encodings('x');

  // const displayData = 1;

  function getData(display) {
    if(display == 0){
      return 'Consumo';
    } else if (display == 1) {
      return 'Costo';
    }
  }

  function getLabel(display) {
    if(display == 0){
      return 'Consumo (KWh)';
    } else if (display == 1) {
      return 'Costo (COP)';
    }
  }

  function getColor(display) {
    if(display == 0){
      return '#EF3939';
    } else if (display == 1) {
      return '#EF3939';
    }
  }

  // ratings scatter plot
  const base = vl.markLine()
    .data(data)
    .encode(
      vl.x()
        .fieldT('Fecha')
        .title(null)
        .axis({format: '%a, %d %b %y', labelAngle: 45}),
      vl.y()
        .fieldQ(getData(0))
        .title(getLabel(0) + ' por Día'),
      vl.color()
        .value(getColor(0)),
      vl.opacity()
        .value(0.85),
      vl.tooltip([vl.timeYMD('Fecha'), vl.text(getData(0)).format(',.2f')])
    )
    .transform(
      vl.filter(click)
    )
    .width(850)
    .height(400);


  const numMonths = data.length / 30;

  // dynamic query histogram
  // const years = vl.markBar({width: (width / numMonths)/1.5})
  const years = vl.markBar({width: (800 / numMonths)/1.5})
    .data(data)
    .select(click)
    .encode(
      vl.x()
        .utcYM('Fecha')
        .title('Date')
        .axis({title: 'Fecha', labelAngle: 45}),
      vl.y()
        .sum(getData(1))
        .title(getLabel(1) + ' por Mes'),
      vl.opacity()
        .if(click, vl.value(0.85)).value(0.3),
      vl.color()
        .value(getColor(1)),
      vl.tooltip([vl.timeYM('Fecha'), vl.text(vl.sum(getData(1))).format(',.0f')])
    )
    .width(850)
    .height(100);


  const totalEnergia = vl.markText()
    .data(data)
    .encode(
      vl.text().sum(getData(0)).format(',.2f')
    )
    .transform(
      vl.filter(click)
    )

  return vl.vconcat(base, years, totalEnergia).spacing(5).toJSON();
}
