# Imagen base con python 3.14
FROM python:3.14

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de la aplicación al contenedor
COPY . .

# Instalar las dependencias del proyecto
RUN pip install -r requirements.txt

# Comando que se ejecutará al iniciar el contenedor
CMD ["python", "app.py"]