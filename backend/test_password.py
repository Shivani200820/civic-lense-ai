from app.core.password import hash_password, verify_password

password = "Admin@123"

hashed = hash_password(password)

print(hashed)

print(verify_password(password, hashed))