from huggingface_hub import InferenceClient
from app.config.settings import settings

client = InferenceClient(
    provider="hf-inference",
    api_key=settings.HF_API_KEY,
)

models = client.list_deployed_models()

print(models)