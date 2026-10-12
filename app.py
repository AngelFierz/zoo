
import os

from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    abort
)
from sqlalchemy import text
from database.connection import engine

app = Flask(__name__)

# Necesario para mostrar mensajes después de las operaciones.
app.secret_key = os.getenv(
    "FLASK_SECRET_KEY",
    "clave-solo-para-desarrollo"
)


def obtener_creepypastas():
    """Consultar todos los registros."""
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT id, nombre, descripcion, imagen, video_url
                FROM creepypastas
                ORDER BY id
            """)
        )
        return resultado.mappings().all()


def obtener_creepypasta(registro_id):
    """Consultar un registro por su ID."""
    with engine.connect() as connection:
        resultado = connection.execute(
            text("""
                SELECT id, nombre, descripcion, imagen, video_url
                FROM creepypastas
                WHERE id = :id
            """),
            {"id": registro_id}
        )
        return resultado.mappings().first()


@app.route("/")
def index():
    return render_template(
        "index.html",
        creepypastas=obtener_creepypastas(),
        registro_editar=None
    )


# CREATE: agregar una creepypasta
@app.route("/agregar", methods=["POST"])
def agregar():
    nombre = request.form.get("nombre", "").strip()
    descripcion = request.form.get("descripcion", "").strip()
    imagen = request.form.get("imagen", "").strip() or None
    video_url = request.form.get("video_url", "").strip() or None

    if not nombre or not descripcion:
        flash("El nombre y la descripción son obligatorios.", "error")
        return redirect(url_for("index"))

    with engine.begin() as connection:
        connection.execute(
            text("""
                INSERT INTO creepypastas
                    (nombre, descripcion, imagen, video_url)
                VALUES
                    (:nombre, :descripcion, :imagen, :video_url)
            """),
            {
                "nombre": nombre,
                "descripcion": descripcion,
                "imagen": imagen,
                "video_url": video_url
            }
        )

    flash("La creepypasta se agregó correctamente.", "success")
    return redirect(url_for("index"))


# UPDATE: mostrar el formulario y guardar los cambios
@app.route("/editar/<int:registro_id>", methods=["GET", "POST"])
def editar(registro_id):
    if request.method == "POST":
        nombre = request.form.get("nombre", "").strip()
        descripcion = request.form.get("descripcion", "").strip()
        imagen = request.form.get("imagen", "").strip() or None
        video_url = request.form.get("video_url", "").strip() or None

        if not nombre or not descripcion:
            flash("El nombre y la descripción son obligatorios.", "error")
            return redirect(
                url_for("editar", registro_id=registro_id)
            )

        with engine.begin() as connection:
            connection.execute(
                text("""
                    UPDATE creepypastas
                    SET nombre = :nombre,
                        descripcion = :descripcion,
                        imagen = :imagen,
                        video_url = :video_url
                    WHERE id = :id
                """),
                {
                    "id": registro_id,
                    "nombre": nombre,
                    "descripcion": descripcion,
                    "imagen": imagen,
                    "video_url": video_url
                }
            )

        flash("La creepypasta se actualizó correctamente.", "success")
        return redirect(url_for("index"))

    registro = obtener_creepypasta(registro_id)

    if registro is None:
        abort(404)

    return render_template(
        "index.html",
        creepypastas=obtener_creepypastas(),
        registro_editar=registro
    )


# DELETE: eliminar una creepypasta
@app.route("/eliminar/<int:registro_id>", methods=["POST"])
def eliminar(registro_id):
    with engine.begin() as connection:
        resultado = connection.execute(
            text("""
                DELETE FROM creepypastas
                WHERE id = :id
            """),
            {"id": registro_id}
        )

    if resultado.rowcount > 0:
        flash("La creepypasta se eliminó correctamente.", "success")
    else:
        flash("No se encontró esa creepypasta.", "error")

    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
