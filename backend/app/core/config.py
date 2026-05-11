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
    
    # Cloudflare R2 Configuration
    r2_access_key: str = ""
    r2_secret_key: str = ""
    r2_endpoint: str = ""
    r2_bucket_name: str = "iron-gear"
    r2_public_url: str = ""


settings = Settings()


def get_settings():
    return settings
