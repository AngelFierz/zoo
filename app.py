from flask import Flask, render_template
from sqlalchemy import text
from database.connection import engine

app = Flask(__name__)

@app.route("/")
def index():
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT id, nombre, descripcion, imagen, video_url
                FROM creepypastas
                ORDER BY id
            """)
        )

        creepypastas = resultado.mappings().all()

    return render_template(
        "index.html",
        creepypastas=creepypastas
    )

if __name__ == "__main__":
    app.run(debug=True)