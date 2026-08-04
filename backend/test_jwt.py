from app.core.jwt import create_access_token, decode_access_token

token = create_access_token(subject=1)

print(token)

payload = decode_access_token(token)

print(payload)