from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str
    admin_email: str
    database_url: str
    database_ram_url: str
    model_config = SettingsConfigDict(env_file=".env", extra="forbid")
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int


settings = Settings()


def get_settings():
    return settings
