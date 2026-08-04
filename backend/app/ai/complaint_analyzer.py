from groq import Groq

from app.ai.groq_client import client
from app.ai.prompts import COMPLAINT_ANALYSIS_PROMPT
from app.config.settings import settings

class ComplaintAnalyzer:

    def __init__(self):
        self.client: Groq = client

    def analyze(
        self,
        citizen_text: str | None = None,
    ):
        prompt = COMPLAINT_ANALYSIS_PROMPT

        if citizen_text:
            prompt += (
                "\n\nCitizen Description:\n"
                + citizen_text
            )

        response = self.client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            temperature=0.2,
        )

        return response.choices[0].message.content