from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from jose import JWTError

from app.core.security import oauth2_scheme
from app.core.jwt import decode_access_token

from app.database.session import get_db

from app.repositories.user_repository import UserRepository



def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )


    try:

        payload = decode_access_token(token)


        if payload is None:
            raise credentials_exception


        user_id = payload.get("sub")


        if user_id is None:
            raise credentials_exception


    except JWTError:

        raise credentials_exception



    user_repository = UserRepository(db)


    user = user_repository.get_by_id(
        int(user_id)
    )


    if user is None:

        raise credentials_exception


    return user