import os

from dotenv import load_dotenv
from google import genai
from PIL import Image

from app.config.settings import settings

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise Exception("GEMINI_API_KEY not found.")


client = genai.Client(api_key=api_key)


class ImageAnalyzer:

    def analyze(
        self,
        image_path: str,
    ) -> str:

        # Cloudinary URL check
        if image_path.startswith("http"):
            raise Exception(
                "Gemini currently expects local image path."
            )

        # Local image path
        full_path = os.path.join(
            settings.UPLOAD_DIRECTORY,
            os.path.basename(image_path),
        )

        print("Image Path:", full_path)

        if not os.path.exists(full_path):
            raise Exception(f"Image not found: {full_path}")

        image = Image.open(full_path)
        prompt = """
You are an AI assistant for a Smart Civic Complaint System used across India.

The uploaded image may represent a civic issue from any state in India.

Analyze the image carefully.

Return ONLY valid JSON.

{
    "title": "",
    "category": "",
    "department": "",
    "priority": "",
    "description": "",
    "confidence": 0.0
}

Rules:


1. Return all values ONLY in English.

2. Category must be EXACTLY one of:
- Pothole
- Garbage
- Water Leakage
- Street Light
- Drain Blockage

3. Department must be EXACTLY one of:
- Roads
- Sanitation
- Water Supply
- Electricity
- Drainage

4. Category Mapping:
- Pothole → Roads
- Garbage → Sanitation
- Water Leakage → Water Supply
- Street Light → Electricity
- Drain Blockage → Drainage

5. Priority must be EXACTLY one of:
- Low
- Medium
- High
- Critical

6. Description must be concise (maximum 60 words) and in English.

7. Confidence must be between 0.0 and 1.0.

8.Title:
Generate a short title (maximum 6 words) describing the complaint.

Examples:
Pothole on Main Road
Garbage Near Bus Stop
Water Leakage in Street
Street Light Not Working
Blocked Drain Near School

Return ONLY JSON.
Do not use markdown.
Do not add explanations.
"""

        print("========== BEFORE GEMINI ==========")

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[
                prompt,
                image,
            ],
        )

        print("========== AFTER GEMINI ==========")

        print("Gemini Response:")
        print(response.text)

        return response.text