import os
from sqlalchemy import create_engine, URL

database_url = URL.create(
    drivername="mysql+mysqlconnector",
    username=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", "admin"),
    host=os.getenv("DB_HOST", "127.0.0.1"),
    port=int(os.getenv("DB_PORT", "3307")),
    database=os.getenv("DB_NAME", "void_zoo")
)

engine = create_engine(database_url, pool_pre_ping=True)