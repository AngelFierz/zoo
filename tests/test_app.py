from app import app


def test_agregar_sin_datos_redirige():
	response = app.test_client().post("/agregar", data={})
	assert response.status_code == 302
