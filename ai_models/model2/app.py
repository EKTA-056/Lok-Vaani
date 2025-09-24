
import os
from flask import Flask, render_template, request
import pandas as pd
from transformers import pipeline
from deep_translator import GoogleTranslator
from langdetect import detect
from google.cloud import translate_v2 as translate
from flask import Flask, render_template, request, jsonify


os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "google_key.json"
translate_client = translate.Client()

sentiment_model = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")
label_mapping = {
    "LABEL_0": "Negative",
    "LABEL_1": "Neutral",
    "LABEL_2": "Positive"
}


def translate_text(text):
    if not text or text.strip() == "":
        return ""

    try:
        lang = detect(text)
    except:
        lang = "en"

    # Hindi or English → deep_translator
    if lang in ["hi", "en"]:
        try:
            return GoogleTranslator(source="auto", target="en").translate(text)
        except:
            return text

    # Hinglish / other → Google Cloud Translate
    else:
        try:
            result = translate_client.translate(text, target_language="en")
            return result['translatedText']
        except:
            return text

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    comment = data.get("comment", "")
    translated_comment = translate_text(comment)
    result = sentiment_model(translated_comment[:512])[0]
    sentiment = label_mapping[result['label']]
    score = result['score']

    return jsonify({
        "original": comment,
        "translated": translated_comment,
        "sentiment": sentiment,
        "score": round(score, 4)
    })

if __name__ == "__main__":
    app.run(debug=True)
