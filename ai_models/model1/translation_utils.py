#!/usr/bin/env python3
"""
Translation utilities for handling Hindi, Hinglish, and English comments
Converts Hindi/Hinglish comments to standard English while preserving context
"""

import re
from deep_translator import GoogleTranslator
from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException
import time
import random

class CommentTranslator:
    def __init__(self):
        self.translator = GoogleTranslator(source='auto', target='en')
        self.hinglish_patterns = [
            # Common Hinglish words and phrases
            r'\b(hai|hain|kar|karke|karne|karna|kya|kyun|yeh|yah|jo|jab|se|mein|me|ko|ka|ki|ke)\b',
            r'\b(aur|ya|par|lekin|kyunki|agar|to|toh|bhi|bahut|bohot|thoda|jyada|zyada)\b',
            r'\b(sahi|galat|accha|achha|bura|kharab|theek|badhiya|badiya)\b',
            r'\b(zaruri|zaroori|important|necessary|chahiye|hoga|hoge|honge|hona)\b',
            r'\b(lagta|laga|lage|lagi|samjh|samjha|samjhe|pata|malum)\b'
        ]
        
        # Comprehensive Hindi-English word mappings for Hinglish
        self.hinglish_replacements = {
            # Basic verbs and actions
            'hai': 'is', 'hain': 'are', 'ho': 'be', 'hota': 'happens', 'hoti': 'happens',
            'kar': 'do', 'kare': 'do', 'karna': 'to do', 'karke': 'by doing', 'karne': 'to do',
            'bana': 'make', 'banane': 'to make', 'banaye': 'make', 'banta': 'is made',
            'add': 'add', 'mile': 'get', 'milega': 'will get', 'mil': 'get',
            'lagta': 'seems', 'laga': 'felt', 'lage': 'seem', 'lagi': 'felt',
            'hoga': 'will be', 'hoge': 'will be', 'honge': 'will be', 'hona': 'to be',
            
            # Questions and pronouns
            'kya': 'what', 'kyun': 'why', 'kaise': 'how', 'kahan': 'where', 'kab': 'when',
            'yeh': 'this', 'yah': 'this', 'woh': 'that', 'jo': 'which', 'jab': 'when',
            'iska': 'its', 'uska': 'its', 'unka': 'their', 'hamara': 'our',
            
            # Conjunctions and prepositions
            'aur': 'and', 'ya': 'or', 'par': 'but', 'lekin': 'but', 'kyunki': 'because',
            'agar': 'if', 'to': 'then', 'toh': 'then', 'se': 'from', 'mein': 'in', 'me': 'in',
            'ko': 'to', 'ka': 'of', 'ki': 'of', 'ke': 'of', 'liye': 'for',
            
            # Adjectives and descriptions
            'sahi': 'right', 'galat': 'wrong', 'theek': 'correct', 'accha': 'good', 'achha': 'good',
            'bura': 'bad', 'kharab': 'bad', 'badhiya': 'great', 'badiya': 'great',
            'kaafi': 'quite', 'bahut': 'very', 'bohot': 'very', 'thoda': 'little', 'jyada': 'more', 'zyada': 'more',
            'high': 'high', 'low': 'low', 'easy': 'easy', 'hard': 'hard',
            
            # Necessity and opinions
            'zaruri': 'necessary', 'zaroori': 'necessary', 'important': 'important',
            'chahiye': 'should', 'chaahiye': 'should', 'jarurat': 'need',
            'samjh': 'understand', 'samjha': 'understood', 'samjhe': 'understand',
            'pata': 'know', 'malum': 'know', 'mujhe': 'I', 'humein': 'we',
            
            # Business and finance specific terms (Hinglish to English)
            'intentions': 'intentions', 'intenses': 'intentions',
            'problems': 'problems', 'issues': 'issues',
            'borrowing': 'borrowing', 'limit': 'limit', 
            'misuse': 'misuse', 'abuse': 'abuse',
            'certificate': 'certificate', 'dependence': 'dependence', 'over-dependence': 'over-dependence',
            'risky': 'risky', 'risk': 'risk', 'dangerous': 'dangerous',
            'pehle': 'previously', 'bhi': 'also', 'fail': 'fail', 'chuke': 'have',
            'mergers': 'mergers', 'companies': 'companies', 'shell': 'shell',
            'loophole': 'loophole', 'ban': 'become', 'sakte': 'can', 'sakta': 'can', 'sakti': 'can',
            'safeguards': 'safeguards', 'strict': 'strict', 'striat': 'strict',
            
            # Additional common words
            'dobara': 'again', 'sochna': 'think', 'clarity': 'clarity', 'kami': 'lack',
            'confusion': 'confusion', 'create': 'create', 'karta': 'does', 'karti': 'does',
            'implementation': 'implementation', 'difficult': 'difficult', 'hoga': 'will be',
            'bharosa': 'trust', 'chances': 'chances', 'badh': 'increase', 'jaayenge': 'will',
            'policy': 'policy', 'rule': 'rule', 'rules': 'rules', 'acchi': 'good', 'accha': 'good',
            
            # Common sentence connectors
            'draft': 'draft', 'policy': 'policy', 'rule': 'rule', 'rules': 'rules',
            'amendment': 'amendment', 'notification': 'notification',
            'compliance': 'compliance', 'auditor': 'auditor', 'auditors': 'auditors',
            'holding': 'holding', 'sub': 'subsidiary'
        }

    def detect_language(self, text):
        """
        Detect if text is Hindi, Hinglish, or English
        Returns: 'hi', 'hinglish', 'en', or 'unknown'
        """
        if not text or len(text.strip()) < 5:
            return 'unknown'
        
        try:
            # Remove special characters and numbers for better detection
            clean_text = re.sub(r'[^\w\s]', ' ', text)
            clean_text = re.sub(r'\d+', ' ', clean_text)
            clean_text = ' '.join(clean_text.split())
            
            if len(clean_text) < 3:
                return 'unknown'
            
            # Try language detection
            detected_lang = detect(clean_text)
            
            # Check for Hinglish patterns (mixed Hindi-English)
            hinglish_score = 0
            for pattern in self.hinglish_patterns:
                if re.search(pattern, text.lower()):
                    hinglish_score += 1
            
            # Check for Devanagari script
            has_devanagari = bool(re.search(r'[\u0900-\u097F]', text))
            
            # Determine final language
            if has_devanagari:
                return 'hi'  # Hindi
            elif hinglish_score >= 2 or (detected_lang == 'hi' and hinglish_score > 0):
                return 'hinglish'  # Mixed Hindi-English
            elif detected_lang in ['hi', 'ur']:  # Sometimes Hindi in Roman script is detected as Urdu
                return 'hinglish'
            else:
                return 'en'  # English
                
        except (LangDetectException, Exception):
            # Fallback: check for common Hindi/Hinglish words
            hinglish_words = sum(1 for word in self.hinglish_replacements.keys() 
                               if word in text.lower())
            if hinglish_words >= 2:
                return 'hinglish'
            return 'en'  # Default to English

    def translate_to_english(self, text, source_lang='auto'):
        """
        Translate Hindi/Hinglish text to English
        Returns translated text while preserving technical terms
        """
        if not text or len(text.strip()) < 3:
            return text
        
        # Preserve technical terms and acronyms
        technical_terms = re.findall(r'\b[A-Z]{2,}\b', text)  # Acronyms like MCA, IFSC, RBI
        amounts = re.findall(r'₹\s*[\d,]+(?:\s*crore|\s*lakh)?', text)  # Amounts
        
        # Detect if it's Hinglish and handle specially
        detected_lang = self.detect_language(text)
        
        if detected_lang == 'hinglish':
            # For Hinglish, use advanced word-by-word replacement + Google Translate for remaining
            translated = self._advanced_hinglish_translation(text)
        else:
            try:
                # Small delay to avoid rate limiting
                time.sleep(random.uniform(0.1, 0.3))
                
                # Use Google Translate for pure Hindi or other languages
                if source_lang != 'auto' and source_lang != 'hinglish':
                    translator = GoogleTranslator(source=source_lang, target='en')
                    translated = translator.translate(text)
                else:
                    # Try to translate as Hindi first
                    hindi_translator = GoogleTranslator(source='hi', target='en')
                    translated = hindi_translator.translate(text)
                    
            except Exception as e:
                print(f"Translation error: {e}")
                # Fallback to advanced Hinglish translation
                translated = self._advanced_hinglish_translation(text)
        
        # Post-process translation to improve quality
        translated = self._post_process_translation(translated, technical_terms, amounts)
        
        return translated

    def _advanced_hinglish_translation(self, text):
        """
        Advanced Hinglish to English translation using sentence-level understanding
        """
        # For Hinglish, use a hybrid approach: 
        # 1. Try Google Translate first (treating as Hindi)
        # 2. If that fails or gives poor results, use manual translation
        
        try:
            # First attempt: Try translating as Hindi
            time.sleep(random.uniform(0.1, 0.3))
            hindi_translator = GoogleTranslator(source='hi', target='en')
            google_result = hindi_translator.translate(text)
            
            # Check if Google translation is reasonable (not just capitalized Hinglish)
            original_words = set(text.lower().split())
            translated_words = set(google_result.lower().split())
            
            # If most words are different, Google translation worked
            if len(original_words.intersection(translated_words)) < len(original_words) * 0.7:
                return google_result
            
        except Exception as e:
            print(f"Google translation failed: {e}")
        
        # Fallback: Manual sentence-level translation
        return self._manual_hinglish_translation(text)
    
    def _manual_hinglish_translation(self, text):
        """
        Manual Hinglish to English translation with proper sentence structure
        """
        # Break text into sentences
        sentences = re.split(r'[.!?]+', text)
        translated_sentences = []
        
        for sentence in sentences:
            if sentence.strip():
                translated_sentence = self._translate_hinglish_sentence(sentence.strip())
                translated_sentences.append(translated_sentence)
        
        return '. '.join(translated_sentences) + ('.' if text.endswith('.') else '')
    
    def _translate_hinglish_sentence(self, sentence):
        """
        Translate a single Hinglish sentence to proper English
        """
        # Common Hinglish sentence patterns and their English equivalents
        patterns = [
            # Pattern: "Is draft ki intentions theek hain"
            (r'\b(is|yeh|yah)\s+(\w+)\s+ki\s+(\w+)\s+(theek|sahi|acchi|accha)\s+(hain|hai)\b', 
             r'The \3 of this \2 are correct'),
            
            # Pattern: "kuch problems bhi hain"
            (r'\bkuch\s+(\w+)\s+bhi\s+(hain|hai)\b', r'there are also some \1'),
            
            # Pattern: "borrowing limit kaafi high hai"
            (r'\b(\w+)\s+(\w+)\s+(kaafi|bahut|bohot)\s+(high|low|good|bad)\s+(hai|hain)\b', 
             r'the \1 \2 is quite \4'),
            
            # Pattern: "₹50 crore kaafi high hai"
            (r'\b(₹\s*[\d,]+\s*(?:crore|lakh)?)\s+(kaafi|bahut)\s+(high|low)\s+(hai|hain)\b', 
             r'\1 is quite \3'),
            
            # Pattern: "iska misuse karna easy hai"
            (r'\b(iska|uska)\s+(\w+)\s+karna\s+(easy|difficult|hard)\s+(hai|hain)\b', 
             r'it is \3 to \2 it'),
            
            # Pattern: "certificate par over-dependence risky hai"
            (r'\b(\w+)\s+par\s+([a-z-]+)\s+(risky|dangerous|safe)\s+(hai|hain)\b', 
             r'over-dependence on \1 is \3'),
            
            # Pattern: "pehle bhi auditors fail ho chuke hain"
            (r'\bpehle\s+bhi\s+(\w+)\s+(fail|pass)\s+ho\s+chuke\s+(hain|hai)\b', 
             r'\1 have \2ed before as well'),
            
            # Pattern: "companies ke liye ek loophole ban sakte hain"
            (r'\b(\w+)\s+ke\s+liye\s+(ek|one)\s+(\w+)\s+ban\s+sakte\s+(hain|hai)\b', 
             r'can become a \3 for \1'),
            
            # Pattern: "safeguards add karne chahiye"
            (r'\b(\w+)\s+add\s+karne\s+chahiye\b', r'should add \1'),
            (r'\b(\w+)\s+karne\s+chahiye\b', r'should do \1'),
            
            # Pattern: "thoda aur strict"
            (r'\bthoda\s+aur\s+(\w+)\b', r'more \1'),
            
            # Pattern: "chances badh jaayenge"
            (r'\b(\w+)\s+badh\s+jaayenge\b', r'\1 will increase'),
            
            # Pattern: "bharosa karna risky hai" 
            (r'\b(\w+)\s+karna\s+(risky|safe|dangerous)\s+(hai|hain)\b', r'doing \1 is \2'),
        ]
        
        result = sentence.lower()
        
        # Apply sentence pattern replacements
        for pattern, replacement in patterns:
            result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
        
        # Apply word-level replacements for remaining words
        for hindi_word, english_word in self.hinglish_replacements.items():
            pattern = r'\b' + re.escape(hindi_word.lower()) + r'\b'
            result = re.sub(pattern, english_word, result, flags=re.IGNORECASE)
        
        # Clean up grammar
        result = self._clean_grammar(result)
        
        # Capitalize first letter
        result = result.strip()
        if result:
            result = result[0].upper() + result[1:]
        
        return result
    
    def _clean_grammar(self, text):
        """
        Clean up common grammar issues in translated text
        """
        # Remove double spaces
        text = re.sub(r'\s+', ' ', text)
        
        # Fix common issues
        fixes = [
            (r'\bthe the\b', 'the'),
            (r'\ba a\b', 'a'),
            (r'\bis are\b', 'are'),
            (r'\bare is\b', 'is'),
            (r'\bto to\b', 'to'),
            (r'\bfor for\b', 'for'),
            (r'\band and\b', 'and'),
            (r'\bbut but\b', 'but'),
        ]
        
        for pattern, replacement in fixes:
            text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
        
        return text.strip()
    
    def _fix_hinglish_grammar(self, text):
        """
        Fix common Hinglish grammar patterns to proper English
        """
        # Common pattern fixes
        patterns = [
            (r'\bthis draft of intentions\b', 'the intentions of this draft'),
            (r'\bof this draft intentions\b', 'the intentions of this draft'),
            (r'\bhave problems also\b', 'also have problems'),
            (r'\balso have\b', 'also have'),
            (r'\bis quite high is\b', 'is quite high'),
            (r'\bto do misuse\b', 'to misuse'),
            (r'\bmisuse to do\b', 'to misuse'),
            (r'\bon over-dependence\b', 'over-dependence on'),
            (r'\bbefore also\b', 'previously also'),
            (r'\bfor of\b', 'for'),
            (r'\bcan become\b', 'can become'),
            (r'\bto add should\b', 'should add'),
            (r'\badd to do should\b', 'should add'),
            (r'\bmore strict\b', 'stricter')
        ]
        
        result = text
        for pattern, replacement in patterns:
            result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
        
        return result
    
    def _preserve_original_formatting(self, original, translated):
        """
        Preserve important formatting from original text
        """
        # Preserve amounts like ₹50 crore
        amounts = re.findall(r'₹\s*[\d,]+(?:\s*crore|\s*lakh)?', original)
        for amount in amounts:
            # Find similar pattern in translated and replace
            translated = re.sub(r'₹\s*[\d,]+(?:\s*crore|\s*lakh)?', amount, translated, count=1)
        
        # Preserve acronyms case
        acronyms = re.findall(r'\b[A-Z]{2,}\b', original)
        for acronym in acronyms:
            translated = re.sub(r'\b' + re.escape(acronym.lower()) + r'\b', acronym, translated, flags=re.IGNORECASE)
        
        return translated
    
    def _translate_remaining_hindi(self, text):
        """
        Try to translate any remaining Hindi words using Google Translate
        """
        words = text.split()
        translated_words = []
        
        for word in words:
            # Check if word might be Hindi (contains Devanagari or looks like untranslated Hindi)
            if re.search(r'[\u0900-\u097F]', word) or (len(word) > 3 and word not in ['and', 'the', 'is', 'are', 'but', 'for', 'with', 'this', 'that']):
                try:
                    # Try to translate individual word if it seems Hindi
                    if not word.lower() in self.hinglish_replacements.values():
                        time.sleep(0.1)  # Small delay
                        hindi_translator = GoogleTranslator(source='hi', target='en')
                        translated_word = hindi_translator.translate(word)
                        if translated_word and translated_word.lower() != word.lower():
                            translated_words.append(translated_word)
                        else:
                            translated_words.append(word)
                    else:
                        translated_words.append(word)
                except:
                    translated_words.append(word)
            else:
                translated_words.append(word)
        
        return ' '.join(translated_words)
    
    def _fallback_hinglish_translation(self, text):
        """
        Fallback method for basic Hinglish to English conversion
        """
        result = text
        for hindi_word, english_word in self.hinglish_replacements.items():
            result = re.sub(r'\b' + re.escape(hindi_word) + r'\b', english_word, result, flags=re.IGNORECASE)
        return result

    def _post_process_translation(self, translated_text, technical_terms, amounts):
        """
        Post-process translated text to improve quality
        """
        result = translated_text
        
        # Fix common translation issues
        corrections = {
            'MCA': 'MCA',  # Ministry of Corporate Affairs
            'IFSC': 'IFSC',  # International Financial Services Centre
            'RBI': 'RBI',    # Reserve Bank of India
            'NBFCs': 'NBFCs', # Non-Banking Financial Companies
            'IFSCA': 'IFSCA', # International Financial Services Centres Authority
            'SFIO': 'SFIO',   # Serious Fraud Investigation Office
            'Section 186': 'Section 186',
            'Companies Act': 'Companies Act',
            'Corporate Affairs': 'Corporate Affairs',
            'amendment': 'amendment',
            'regulation': 'regulation',
            'shareholder': 'shareholder',
            'investor': 'investor',
            'corporate governance': 'corporate governance'
        }
        
        for term, replacement in corrections.items():
            result = re.sub(re.escape(term), replacement, result, flags=re.IGNORECASE)
        
        # Restore technical terms and amounts
        for term in technical_terms:
            result = re.sub(r'\b' + re.escape(term.lower()) + r'\b', term, result, flags=re.IGNORECASE)
        
        for amount in amounts:
            if amount not in result:
                # Try to find similar patterns and replace
                result = re.sub(r'₹\s*[\d,]+(?:\s*crore|\s*lakh)?', amount, result, count=1)
        
        return result

    def process_comment(self, comment_text):
        """
        Process a comment and return both raw and standardized versions
        
        Returns:
        {
            'raw_comment': original text,
            'standard_comment': English translation,
            'language': detected language,
            'was_translated': boolean
        }
        """
        if not comment_text:
            return {
                'raw_comment': '',
                'standard_comment': '',
                'language': 'unknown',
                'was_translated': False
            }
        
        # Detect language
        detected_lang = self.detect_language(comment_text)
        
        # Translate if needed
        if detected_lang in ['hi', 'hinglish']:
            standard_comment = self.translate_to_english(comment_text)
            was_translated = True
        else:
            standard_comment = comment_text
            was_translated = False
        
        return {
            'raw_comment': comment_text,
            'standard_comment': standard_comment,
            'language': detected_lang,
            'was_translated': was_translated
        }

    def batch_process_comments(self, comments_list):
        """
        Process a list of comments in batch
        Returns list of processed comment dictionaries
        """
        processed_comments = []
        
        for i, comment in enumerate(comments_list):
            if isinstance(comment, dict):
                comment_text = comment.get('commentText', '')
            else:
                comment_text = str(comment)
            
            processed = self.process_comment(comment_text)
            processed_comments.append(processed)
            
            # Add delay every 10 requests to avoid rate limiting
            if (i + 1) % 10 == 0:
                time.sleep(1)
        
        return processed_comments


# Test function
def test_translation():
    """Test the translation functionality"""
    translator = CommentTranslator()
    
    test_comments = [
        "Yeh amendment bilkul sahi hai. IFSC finance companies ko NBFCs ke barabar lana zaroori hai for ease of doing business.",
        "MCA ko is amendment par dobara sochna chahiye. Section 186 se exemption dene se risk badh sakta hai.",
        "यह संशोधन एक बहुत ही सकारात्मक विकास है। इससे व्यापार करना आसान होगा।",
        "Excellent move for ease of doing business!",
        "IFSC ke liye game changer hoga.",
        "यह एक द्विधारी तलवार है। एक तरफ, यह विकास को गति दे सकता है।"
    ]
    
    print("🧪 Testing Translation System")
    print("=" * 60)
    
    for i, comment in enumerate(test_comments, 1):
        result = translator.process_comment(comment)
        print(f"\n{i}. Raw Comment:")
        print(f"   {result['raw_comment']}")
        print(f"   Language: {result['language']}, Translated: {result['was_translated']}")
        print(f"   Standard Comment:")
        print(f"   {result['standard_comment']}")

if __name__ == "__main__":
    test_translation()