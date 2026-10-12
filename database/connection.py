import os
from sqlalchemy import create_engine, URL

database_url = URL.create(
    drivername="mysql+mysqlconnector",
    username="root",
    password=os.getenv("DB_PASSWORD", "AQUI TAMBIEN LOL WJAJ PON TU CONTRASEÑA AQUIIII"),
    host="127.0.0.1",
    port=3306,
    database="void_zoo",
)

engine = create_engine(database_url)