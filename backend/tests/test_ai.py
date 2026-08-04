from app.ai.complaint_analyzer import ComplaintAnalyzer

analyzer = ComplaintAnalyzer()

result = analyzer.analyze(
    "Large pothole near the city bus stand."
)

print(result)