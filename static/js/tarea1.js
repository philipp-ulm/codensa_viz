/* global vl */

function tarea1(data) {
    const brush = vl.selectInterval().encodings('x'); // limit selection to x-axis (year) values
    const click = vl.selectMulti().encodings('x');

    // ratings scatter plot
    const base = vl.markArea()
    .data(data)
    .encode(
      vl.x().fieldT('Fecha').title(null),
      vl.y().fieldQ('Consumo').title('Consumo Dia'),
      vl.tooltip().fieldN('Consumo'),
      vl.color().value('#2471A3')
    )
    .transform(
      vl.filter(brush)
    )
    .width(800)
    .height(300);

    // dynamic query histogram
    const years = vl.markBar({width: 30})
    .data(data)
    .select(brush)
    .encode(
      vl.x().yearmonth('Fecha').title('Date'),
      vl.y().sum('Consumo').title('Consumo Mes'),
      vl.opacity().if(brush, vl.value(1)).value(0.3),
      vl.color().value('#2471A3')
    )
    .width(800)
    .height(50);

    const textTitle = {color: 'black', fontSize: 22};
    const textEnergy = {color: 'darkgrey', fontSize: 22};

    const totalEnergia = vl.markText(textEnergy)
    .data(data)
    .encode(
      vl.text().sum('Consumo').format('.2f')
    )
    .transform(
      vl.filter(brush)
    )

    return vl.vconcat(totalEnergia, base, years).spacing(5).toJSON();
}
