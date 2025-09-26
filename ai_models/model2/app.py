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
        return ("", "Empty")

    try:
        lang = detect(text)
    except:
        lang = "en"
    
    # Check for Hinglish patterns
    hindi_words = ['hai', 'hain', 'ke', 'ki', 'ka', 'ko', 'se', 'mein', 'par', 'aur', 'yeh', 'woh', 'kya', 'kaise', 'kahan', 'kyun', 'jo', 'ek', 'do', 'teen', 'char', 'paanch', 'crore', 'lakh', 'lagta', 'hoga', 'jaayenge', 'karta', 'karegi', 'bhi', 'tak', 'liye', 'mujhe', 'rehna', 'karna', 'mushkil', 'ghar', 'paisa', 'sabse', 'bahut', 'achha', 'bura', 'sirf', 'saal', 'din', 'raat', 'subah', 'shaam', 'abhi', 'phir', 'kab', 'kuch', 'sab', 'log', 'kaam', 'gaya', 'aya', 'dena', 'lena', 'dekha', 'suna', 'bola', 'kaha']
    text_lower = text.lower()
    # Use word boundary matching to avoid partial matches
    import re
    hindi_word_count = 0
    found_hindi_words = []
    for word in hindi_words:
        # Use word boundary regex to match complete words only
        if re.search(r'\b' + re.escape(word) + r'\b', text_lower):
            hindi_word_count += 1
            found_hindi_words.append(word)
    
    print(f"Translation Debug: lang={lang}, hindi_word_count={hindi_word_count}, text_length={len(text.split())}")
    if found_hindi_words:
        print(f"Found Hindi words: {found_hindi_words}")
 
    # Determine language type
    if lang == "en" and hindi_word_count == 0:
        language_type = "English"
    elif lang == "hi" and hindi_word_count > len(text.split()) * 0.6:
        language_type = "Hindi"
    elif hindi_word_count >= 3:  # Increased threshold from 2 to 3 for better accuracy
        language_type = "Hinglish"
    elif lang not in ["hi", "en"]:
        language_type = f"{lang.upper()} (auto-detected)"
    else:
        language_type = f"{lang.upper()}"
    
    # Pure English - return as is (no translation needed)
    if lang == "en" and hindi_word_count == 0:
        print("Pure English detected - no translation needed")
        return (text, language_type)
    
    # Pure Hindi - use FREE deep_translator
    elif lang == "hi" and hindi_word_count > len(text.split()) * 0.6:
        print("Pure Hindi detected - using free deep_translator")
        try:
            translated = GoogleTranslator(source="hi", target="en").translate(text)
            return (translated, language_type)
        except Exception as e:
            return (text, language_type)
    
    # Hinglish detection (mixed Hindi-English) OR any text with Hindi words
    elif hindi_word_count >= 3:  # Increased threshold for better accuracy
        try:
            print(f"[COST] Using Google Cloud API for Hinglish: {hindi_word_count} Hindi words detected")
            
            if translate_client is None:
                print("Google Cloud client not available, using fallback")
                raise Exception("Google Cloud client not initialized")

            result = None
            
            # Method 1: Try with source='hi' (Hindi romanized)
            try:
                result = translate_client.translate(text, source_language='hi', target_language='en')
                if result['translatedText'] != text:
                    return (result['translatedText'], language_type)
            except Exception as e1:
                print(f"Hindi source failed: {e1}")
            
            # Method 2: Try with auto-detection but explicit target
            try:
                print("Trying with auto-detection...")
                result = translate_client.translate(text, target_language='en')
                # If it detects as English but we have Hindi words, try to force translation
                if result.get('detectedSourceLanguage') == 'en' and result['translatedText'] == text:
                    raise Exception("Same text returned, trying fallback")
                return (result['translatedText'], language_type)
            except Exception as e2:
                print(f"Auto-detect failed: {e2}")
                
            translated_text = result['translatedText'] if result else text
            return (translated_text, language_type)
            
        except Exception as e:
            print(f"Google Cloud translation failed with error: {str(e)}")
            # Fallback to FREE deep_translator if Google API fails
            try:
                translated = GoogleTranslator(source="auto", target="en").translate(text)
                return (translated, language_type)
            except Exception as e2:
                print(f"Deep translator fallback failed: {e2}")
                return (text, language_type)
    
    # Other languages (not Hindi, not English) - translate to English
    elif lang not in ["hi", "en"]:
        try:
            translated = GoogleTranslator(source="auto", target="en").translate(text)
            return (translated, language_type)
        except Exception as e:
            print(f"Other language translation failed: {e}")
            return (text, language_type)

    # Default: Use FREE deep_translator for everything else
    else:
        print("Default case - using free deep_translator")
        try:
            translated = GoogleTranslator(source="auto", target="en").translate(text)
            return (translated, language_type)
        except Exception as e:
            print(f"Default translation failed: {e}")
            return (text, language_type)

app = Flask(__name__)

@app.route("/active", methods=["GET"])
def active():
    return "active"

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        comment = data.get("comment", "")
        
        if not comment or comment.strip() == "":
            return jsonify({
                "success": False,
                "error": "Comment text is required"
            }), 400
        
        # Get detected language first
        try:
            detected_lang = detect(comment)
        except:
            detected_lang = "unknown"
        
        # Get translated comment and language type
        translated_result = translate_text(comment)
        translated_comment = translated_result[0]
        language_type = translated_result[1]
        
        # Perform sentiment analysis on translated text
        result = sentiment_model(translated_comment[:512])[0]
        sentiment = label_mapping[result['label']]
        score = result['score']

        return jsonify({
            "success": True,
            "original": comment,
            "translated": translated_comment,
            "detected_language": detected_lang,
            "language_type": language_type,
            "sentiment": sentiment,
            "sentimentScore": round(score, 4),
            "summary": "",  # Placeholder for future summary feature
            "score": round(score, 4)
        })
    
    except Exception as e:
        print(f"Error in analyze endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}"
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  
    app.run(debug=True, host='0.0.0.0', port=port)
