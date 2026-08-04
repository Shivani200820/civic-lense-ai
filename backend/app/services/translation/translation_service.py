from deep_translator import GoogleTranslator


class TranslationService:

    LANGUAGE_MAP = {
        "english": "en",
        "English": "en",
        "en": "en",

        "marathi": "mr",
        "Marathi": "mr",
        "mr": "mr",

        "hindi": "hi",
        "Hindi": "hi",
        "hi": "hi",
    }

    @staticmethod
    def translate(text: str, target_language: str):

        if not text:
            return text

        target = TranslationService.LANGUAGE_MAP.get(
            target_language,
            target_language,
        )

        print("=================================")
        print("INPUT :", text)
        print("TARGET:", target)

        try:
            translated = GoogleTranslator(
                source="auto",
                target=target,
            ).translate(text)

            print("OUTPUT:", translated)

            return translated

        except Exception as e:
            print("ERROR:", e)
            return text