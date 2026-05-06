from datetime import datetime, timedelta
from typing import Optional

import bcrypt
import jwt
from pydantic import BaseModel

from app.core.config import settings


class TokenData(BaseModel):
    user_id: int
    email: str
    role: str


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.access_token_expire_minutes
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm
    )
    return encoded_jwt


def decode_access_token(token: str) -> TokenData:
    payload = jwt.decode(
        token,
        settings.secret_key,
        algorithms=[settings.algorithm]
    )
    sub = payload.get("sub")
    if sub is None:
        raise ValueError("Token missing 'sub' field")
    return TokenData(
        user_id=int(sub),
        email=payload.get("email"),
        role=payload.get("role")
    )
