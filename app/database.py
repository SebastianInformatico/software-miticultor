from sqlmodel import SQLModel, create_engine

sqlite_file_name = "miticultor.db"
database_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(database_url, echo=False)


def init_db():
    SQLModel.metadata.create_all(engine)
