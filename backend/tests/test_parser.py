from app.ai.response_parser import AIResponseParser

response = """
{
    "category":"Road",
    "department":"Public Works Department",
    "priority":"HIGH",
    "description":"Large pothole detected near the city bus stand.",
    "confidence":0.95
}
"""

result = AIResponseParser.parse(response)

print(result)