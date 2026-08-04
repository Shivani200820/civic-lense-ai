from app.ai.image_detector import ImageDetector

detector = ImageDetector()

result = detector.detect("test.jpg")

print(result)