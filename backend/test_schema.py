from app.schemas.user import UserCreate


user = UserCreate(
    full_name="Shivani Dahiphale",
    email="shivani@gmail.com",
    phone="9876543210",
    password="CivicAI@123"
)


print(user)