from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    APP_NAME: str
    APP_VERSION: str

    ENVIRONMENT: str = "production"


    DEBUG: bool = False

    HOST: str
    PORT: int

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    DATABASE_URL: str

    GROQ_API_KEY: str

    GROQ_MODEL: str

    GEMINI_API_KEY: str


    STORAGE_DRIVER: str = "cloudinary"

    UPLOAD_DIRECTORY: str = "uploads"

    PENDING_UPLOAD_DIRECTORY: str = "uploads/pending"

    MAX_IMAGE_SIZE: int = 5242880

    ALLOWED_IMAGE_EXTENSIONS: str = "jpg,jpeg,png,webp"

    CLOUDINARY_CLOUD_NAME: str = ""

    CLOUDINARY_API_KEY: str = ""

    CLOUDINARY_API_SECRET: str = ""


    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()

