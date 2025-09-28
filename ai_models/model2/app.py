import os
import json
import torch
from flask import Flask, render_template, request
import pandas as pd
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers import pipeline as hf_pipeline
from deep_translator import GoogleTranslator
from langdetect import detect
from google.cloud import translate_v2 as translate
from flask import Flask, render_template, request, jsonify


os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "google_key.json"
translate_client = translate.Client()

# Load draft context from JSON file for summarization
def load_draft_context():
    """Load the compact draft context for efficient processing"""
    try:
        with open('draft_context.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        # Fallback minimal context if file not found
        return {
            "subject": "Indian Multi-Disciplinary Partnership (MDP) firms",
            "ministry": "Ministry of Corporate Affairs",
            "key_focus": ["regulatory changes", "global competitiveness", "professional services"]
        }

# Load context at startup
DRAFT_CONTEXT = load_draft_context()

# Initialize summarization model
print("Loading TinyLlama model for summarization...")
try:
    # Suppress TensorFlow warnings for cleaner output
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
    os.environ['TRANSFORMERS_VERBOSITY'] = 'error'
    
    # Set device - use GPU if available
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    
    # Load model with optimizations
    tokenizer = AutoTokenizer.from_pretrained(
        "TinyLlama/TinyLlama-1.1B-Chat-v1.0", 
        cache_dir="./model_cache"
    )
    
    model = AutoModelForCausalLM.from_pretrained(
        "TinyLlama/TinyLlama-1.1B-Chat-v1.0", 
        device_map="auto",
        dtype=torch.float16 if device == "cuda" else torch.float32,
        cache_dir="./model_cache",
        low_cpu_mem_usage=True
    )
    
    # Create optimized pipeline
    summarizer = hf_pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer
    )
    
    print("TinyLlama model loaded successfully!")
except Exception as e:
    print(f"Warning: Could not load summarization model: {e}")
    summarizer = None

def generate_summary(text):
    """Generate summary for translated comment using TinyLlama model"""
    if summarizer is None:
        return "Summary unavailable - model not loaded"
    
    try:
        # Calculate adaptive summary length based on comment length
        comment_length = len(text.strip().split())
        if comment_length <= 50:
            max_tokens = 30  # Short summary for short comments
        elif comment_length <= 150:
            max_tokens = 60  # Medium summary for medium comments
        elif comment_length <= 300:
            max_tokens = 100  # Longer summary for longer comments
        else:
            max_tokens = 150  # Maximum summary for very long comments
        
        # Use compact context for efficient processing
        context_summary = {
            "topic": DRAFT_CONTEXT.get("consultation_details", {}).get("subject", "MDP firms establishment"),
            "focus": DRAFT_CONTEXT.get("focus_areas", ["auditing", "consulting", "legal"]),
            "key_issues": DRAFT_CONTEXT.get("key_asymmetries", {}).get("indian_firm_limitations", [])[:3]
        }
        
        # Optimized prompt for faster processing
        prompt = f"""MCA eConsultation Analysis - Topic: {context_summary['topic']}

Key Issues: {', '.join(context_summary['key_issues'])}
Focus Areas: {', '.join(context_summary['focus'])}

Stakeholder Comment: {text.strip()}

Analyze this comment and provide a concise summary focusing on:
- Main concerns raised
- Specific suggestions or recommendations  
- Regulatory changes mentioned
- Overall sentiment (supportive/critical/neutral)

Summary:"""
        
        # Generate with optimized parameters (fixed temperature=0.7, adaptive length)
        summary = summarizer(
            prompt, 
            max_new_tokens=max_tokens,
            temperature=0.7,  # Fixed temperature for consistent results
            return_full_text=False,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id if tokenizer.pad_token_id is None else tokenizer.pad_token_id,
            num_return_sequences=1,
            clean_up_tokenization_spaces=True
        )
        
        return summary[0]['generated_text'].strip()
    
    except Exception as e:
        print(f"Summary generation error: {e}")
        return "Summary generation failed"

# Initialize sentiment analysis model  
try:
    sentiment_model = hf_pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")
    label_mapping = {
        "LABEL_0": "Negative",
        "LABEL_1": "Neutral", 
        "LABEL_2": "Positive"
    }
    print("Sentiment analysis model loaded successfully!")
except Exception as e:
    print(f"Warning: Could not load sentiment model: {e}")
    sentiment_model = None
    label_mapping = {}

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
        if sentiment_model is not None:
            result = sentiment_model(translated_comment[:512])[0]
            sentiment = label_mapping[result['label']]
            score = result['score']
        else:
            sentiment = "Unknown"
            score = 0.0
        
        # Generate summary using translated comment
        print(f"Generating summary for translated comment ({len(translated_comment.split())} words)...")
        summary = generate_summary(translated_comment)

        return jsonify({
            "success": True,
            "original": comment,
            "translated": translated_comment,
            "detected_language": detected_lang,
            "language_type": language_type,
            "sentiment": sentiment,
            "sentimentScore": round(score, 4),
            "summary": summary,  # Generated summary placed here
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
