from pydantic import BaseModel


class AIImageAnalysisResponse(BaseModel):
    title:str
    category: str
    department: str
    priority: str
    description: str
    confidence: float


class UploadResponse(BaseModel):
    message: str
    image_url: str
    analysis: AIImageAnalysisResponse