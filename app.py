from flask import Flask, escape, request, make_response, render_template
import io
import csv
import sqlite3

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == "__main__":
    app.run()

@app.route('/data')
def hello():
    conn = sqlite3.connect('main.db')
    cursor = conn.cursor()
    csvList = list(cursor.execute("select * from ejemplo"))

    si = io.StringIO()
    cw = csv.writer(si)
    cw.writerows([("Fecha", "Hora", "Consumo")] + csvList)

    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = "attachment; filename=export.csv"
    output.headers["Content-type"] = "text/csv"

    return output

@app.route('/eleDom')
def hello2():
    conn2 = sqlite3.connect('eleDom.db')
    cursor2 = conn2.cursor()
    csvList2 = list(cursor2.execute("select * from electrodomesticos"))

    si2 = io.StringIO()
    cw2 = csv.writer(si2)
    cw2.writerows([("electrodomestico", "consumo_kwH", "valor_kwH")] + csvList2)

    output2 = make_response(si2.getvalue())
    output2.headers["Content-Disposition"] = "attachment; filename=export.csv"
    output2.headers["Content-type"] = "text/csv"

    return output2
