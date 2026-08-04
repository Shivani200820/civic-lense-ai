from app.config.settings import settings

print("Storage Driver:", settings.STORAGE_DRIVER)
print("Upload Directory:", settings.UPLOAD_DIRECTORY)
print("Max Image Size:", settings.MAX_IMAGE_SIZE)
print("Allowed Extensions:", settings.ALLOWED_IMAGE_EXTENSIONS)