/* global vl */

/*Author: Philipp Freiherr von Ulm-Erbach*/

function tarea1(data) {
  const brush = vl.selectInterval().encodings('x'); // limit selection to x-axis (year) values
  const click = vl.selectMulti().encodings('x');

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
      return '#EC7063';
    } else if (display == 1) {
      return '#EC7063';
    }
  }

  const base = vl.markArea()
    .data(data)
    .encode(
      vl.x()
        .fieldT('Fecha_Formatted')
        .title(null)
        .axis({format: '%a, %d %b %y', labelAngle: 45}),
      vl.y()
        .fieldQ(getData(0))
        .title(getLabel(0) + ' por Día'),
      vl.color()
        .value(getColor(0)),
      vl.opacity()
        .value(0.85),
      vl.tooltip([vl.timeYMD('Fecha_Formatted'), vl.text(getData(0)).format(',.2f')])
    )
    .transform(
      vl.filter(brush)
    )
    .width(850)
    .height(400);


  const numMonths = data.length / 30;

  const years = vl.markBar({width: (800 / numMonths)/1.5})
    .data(data)
    .select(brush)
    .encode(
      vl.x()
        .utcYM('Fecha_Formatted')
        .title('Date')
        .axis({title: 'Fecha', labelAngle: 45}),
      vl.y()
        .sum(getData(1))
        .title(getLabel(1) + ' por Mes'),
      vl.opacity()
        .if(brush, vl.value(0.85)).value(0.3),
      vl.color()
        .value(getColor(1)),
      vl.tooltip([vl.timeYM('Fecha_Formatted'), vl.text(vl.sum(getData(1))).format(',.0f')])
    )
    .width(850)
    .height(100);


  const totalEnergia = vl.markText()
    .data(data)
    .encode(
      vl.text().sum(getData(0)).format(',.2f')
    )
    .transform(
      vl.filter(brush)
    )

  return vl.vconcat(base, years, totalEnergia).spacing(5).toJSON();
}
