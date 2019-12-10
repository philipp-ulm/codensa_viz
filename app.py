from flask import Flask, escape, request, make_response, render_template,  jsonify
import io
import csv
import sqlite3
import json

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/data')
def hello():
    # conn = sqlite3.connect('main.db')
    # conn = sqlite3.connect('C1.db')
    # conn = sqlite3.connect('C2.db')
    conn = sqlite3.connect('C3.db')
    cursor = conn.cursor()
    csvList = list(cursor.execute("select * from consumo"))

    si = io.StringIO()
    cw = csv.writer(si)
    cw.writerows([("", "CLIENTE", "Fecha", "Consumo", "Periodo", "Clase", "Estrato", "Tipo Conex", "Localidad Lec", "Tarifa", "Sector", "Vigencia", "TARIFA_Subsidiada", "TARIFA_Plena", "TARIFA_TOTAL", "Fecha_Formatted", "Costo")] + csvList)

    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = "attachment; filename=export.csv"
    output.headers["Content-type"] = "text/csv"

    return output

@app.route('/eleDom')
def getElectrodomesticos():
    conn2 = sqlite3.connect('eleDom.db')
    conn2.row_factory = sqlite3.Row
    cursor2 = conn2.cursor()
    results = cursor2.execute("select * from eleDom where estrato = '3' ")


    electrodomesticos = list()
    for r in results:
        print(type(r), " ", r)
        row = dict(r)
        #row["valorConsumo_Hora"] = float(row["consumo_kwH"]) * float(row["valor_kwH"]);
        electrodomesticos.append(row)

    #si2 = io.StringIO()
    #cw2 = csv.writer(si2)
    #cw2.writerows([("electrodomestico", "consumo_kwH", "valor_kwH")] + csvList2)

    #output2 = make_response(si2.getvalue())
    #output2.headers["Content-Disposition"] = "attachment; filename=export.csv"
    #output2.headers["Content-type"] = "text/csv"

    return jsonify(electrodomesticos)
	
if __name__ == "__main__":
    app.run()
