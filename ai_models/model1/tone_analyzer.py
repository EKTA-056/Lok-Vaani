#!/usr/bin/env python3
"""
Tone analysis utilities for detecting comment sentiment and tone
Analyzes comments for: Supportive, Concerned, Suggestive, Sarcastic, Neutral
"""

import re
from typing import Dict, List, Tuple

class CommentToneAnalyzer:
    def __init__(self):
        # Keywords and phrases for different tones
        self.tone_patterns = {
            'supportive': {
                'keywords': [
                    'excellent', 'great', 'good', 'positive', 'welcome', 'appreciate', 'support',
                    'commendable', 'praiseworthy', 'beneficial', 'helpful', 'constructive',
                    'fantastic', 'wonderful', 'amazing', 'brilliant', 'outstanding',
                    'approve', 'endorse', 'favor', 'backing', 'agreement', 'align',
                    'accha', 'achha', 'badhiya', 'sahi', 'theek', 'samarthan'
                ],
                'phrases': [
                    r'excellent move', r'great step', r'good initiative', r'positive development',
                    r'welcome change', r'right direction', r'much needed', r'long overdue',
                    r'fully support', r'completely agree', r'strongly endorse',
                    r'game changer', r'progressive step', r'forward thinking',
                    r'yeh sahi hai', r'bilkul theek', r'bahut accha'
                ],
                'weight': 1.0
            },
            
            'concerned': {
                'keywords': [
                    'worried', 'concerned', 'dangerous', 'risky', 'problematic', 'alarming',
                    'troubling', 'disturbing', 'cautious', 'skeptical', 'doubtful',
                    'against', 'oppose', 'disagree', 'reject', 'protest',
                    'risk', 'threat', 'issue', 'problem', 'challenge', 'difficulty',
                    'chinta', 'pareshani', 'khatra', 'musibat', 'dikkat'
                ],
                'phrases': [
                    r'deeply concerned', r'serious concerns', r'major issues', r'significant problems',
                    r'potential risks', r'dangerous precedent', r'alarming trend',
                    r'strongly against', r'completely disagree', r'totally oppose',
                    r'recipe for disaster', r'big mistake', r'wrong direction',
                    r'bada khatra', r'bohot risky', r'galat direction'
                ],
                'weight': 1.0
            },
            
            'suggestive': {
                'keywords': [
                    'suggest', 'recommend', 'propose', 'consider', 'should', 'could', 'might',
                    'perhaps', 'maybe', 'alternatively', 'instead', 'modify', 'improve',
                    'enhance', 'add', 'include', 'strengthen', 'clarify', 'specify',
                    'sujhaav', 'salah', 'mashwara', 'chahiye', 'karna chahiye'
                ],
                'phrases': [
                    r'i suggest', r'my suggestion', r'would recommend', r'should consider',
                    r'might want to', r'could improve', r'better approach', r'alternative would be',
                    r'what if', r'how about', r'why not', r'it would be better',
                    r'mera sujhaav', r'behtar hoga', r'aur accha hoga'
                ],
                'weight': 1.0
            },
            
            'sarcastic': {
                'keywords': [
                    'brilliant', 'genius', 'fantastic', 'wonderful', 'perfect', 'exactly',
                    'obviously', 'clearly', 'surely', 'definitely', 'absolutely',
                    'great job', 'well done', 'congratulations'
                ],
                'phrases': [
                    r'what a brilliant idea', r'genius move', r'perfect solution',
                    r'exactly what we needed', r'obviously the best', r'clearly thought through',
                    r'well done.*government', r'congratulations.*achievement',
                    r'fantastic.*decision', r'wonderful.*policy',
                    r'kya baat hai', r'wah kya idea', r'zabardast'
                ],
                'sarcasm_indicators': [
                    r'!{2,}', r'\?{2,}', r'\.{3,}',  # Multiple punctuation
                    r'[A-Z]{3,}',  # ALL CAPS words
                    r'haha', r'lol', r'really\?', r'seriously\?'
                ],
                'weight': 0.8  # Sarcasm is harder to detect, lower weight
            },
            
            'neutral': {
                'keywords': [
                    'noted', 'acknowledged', 'received', 'understood', 'information',
                    'details', 'clarification', 'question', 'inquiry', 'request',
                    'general', 'standard', 'normal', 'typical', 'usual'
                ],
                'phrases': [
                    r'for your information', r'please clarify', r'need more details',
                    r'seeking clarification', r'requesting information',
                    r'general inquiry', r'standard procedure'
                ],
                'weight': 0.5
            }
        }
        
        # Context-aware tone modifiers
        self.context_modifiers = {
            'positive_context': [
                'growth', 'development', 'progress', 'improvement', 'benefit',
                'opportunity', 'advancement', 'success', 'achievement'
            ],
            'negative_context': [
                'failure', 'decline', 'loss', 'damage', 'harm', 'destruction',
                'crisis', 'disaster', 'collapse', 'breakdown'
            ]
        }

    def analyze_tone(self, text: str) -> Dict[str, any]:
        """
        Analyze the tone of a comment and return tone classification with confidence
        
        Returns:
        {
            'primary_tone': str,
            'tone_scores': dict,
            'confidence': float,
            'tone_indicators': list
        }
        """
        if not text or len(text.strip()) < 5:
            return {
                'primary_tone': 'neutral',
                'tone_scores': {'neutral': 1.0},
                'confidence': 0.5,
                'tone_indicators': []
            }
        
        text_lower = text.lower()
        tone_scores = {}
        tone_indicators = []
        
        # Calculate scores for each tone
        for tone, patterns in self.tone_patterns.items():
            score = 0
            indicators = []
            
            # Check keywords
            for keyword in patterns['keywords']:
                if re.search(r'\b' + re.escape(keyword.lower()) + r'\b', text_lower):
                    score += 1
                    indicators.append(f"keyword: {keyword}")
            
            # Check phrases
            for phrase in patterns['phrases']:
                if re.search(phrase, text_lower):
                    score += 2  # Phrases have higher weight than individual keywords
                    indicators.append(f"phrase: {phrase}")
            
            # Special handling for sarcasm
            if tone == 'sarcastic':
                sarcasm_score = self._detect_sarcasm(text, text_lower)
                score += sarcasm_score
                if sarcasm_score > 0:
                    indicators.append("sarcasm_detected")
            
            # Apply tone weight
            weighted_score = score * patterns['weight']
            tone_scores[tone] = weighted_score
            
            if weighted_score > 0:
                tone_indicators.extend(indicators)
        
        # Apply context modifiers
        tone_scores = self._apply_context_modifiers(text_lower, tone_scores)
        
        # Determine primary tone
        if not any(score > 0 for score in tone_scores.values()):
            primary_tone = 'neutral'
            confidence = 0.5
        else:
            primary_tone = max(tone_scores.items(), key=lambda x: x[1])[0]
            max_score = tone_scores[primary_tone]
            total_score = sum(tone_scores.values())
            confidence = min(max_score / max(total_score, 1), 1.0)
        
        # Normalize scores
        total = sum(tone_scores.values()) or 1
        normalized_scores = {tone: score/total for tone, score in tone_scores.items()}
        
        return {
            'primary_tone': primary_tone,
            'tone_scores': normalized_scores,
            'confidence': round(confidence, 2),
            'tone_indicators': list(set(tone_indicators))
        }

    def _detect_sarcasm(self, original_text: str, text_lower: str) -> float:
        """
        Detect sarcastic tone using multiple indicators
        """
        sarcasm_score = 0
        
        # Check for sarcasm indicators
        for indicator in self.tone_patterns['sarcastic']['sarcasm_indicators']:
            if re.search(indicator, original_text):
                sarcasm_score += 1
        
        # Check for contradictory sentiment (positive words in negative context)
        positive_words = ['excellent', 'great', 'wonderful', 'brilliant', 'perfect']
        negative_context = ['problem', 'issue', 'disaster', 'failure', 'mistake']
        
        has_positive = any(word in text_lower for word in positive_words)
        has_negative_context = any(word in text_lower for word in negative_context)
        
        if has_positive and has_negative_context:
            sarcasm_score += 2
        
        # Check for excessive punctuation
        if len(re.findall(r'[!?]{2,}', original_text)) > 0:
            sarcasm_score += 1
        
        return sarcasm_score

    def _apply_context_modifiers(self, text_lower: str, tone_scores: Dict[str, float]) -> Dict[str, float]:
        """
        Apply context-based modifications to tone scores
        """
        modified_scores = tone_scores.copy()
        
        # Check for positive context
        positive_context_count = sum(1 for word in self.context_modifiers['positive_context'] 
                                   if word in text_lower)
        
        # Check for negative context
        negative_context_count = sum(1 for word in self.context_modifiers['negative_context'] 
                                   if word in text_lower)
        
        # Adjust scores based on context
        if positive_context_count > negative_context_count:
            modified_scores['supportive'] *= 1.2
            modified_scores['concerned'] *= 0.8
        elif negative_context_count > positive_context_count:
            modified_scores['concerned'] *= 1.2
            modified_scores['supportive'] *= 0.8
        
        return modified_scores

    def get_tone_summary(self, comments: List[str]) -> Dict[str, any]:
        """
        Analyze tone distribution across multiple comments
        """
        if not comments:
            return {'error': 'No comments provided'}
        
        tone_distribution = {
            'supportive': 0,
            'concerned': 0,
            'suggestive': 0,
            'sarcastic': 0,
            'neutral': 0
        }
        
        detailed_analysis = []
        
        for comment in comments:
            analysis = self.analyze_tone(comment)
            tone_distribution[analysis['primary_tone']] += 1
            detailed_analysis.append({
                'comment': comment[:100] + '...' if len(comment) > 100 else comment,
                'tone': analysis['primary_tone'],
                'confidence': analysis['confidence']
            })
        
        total_comments = len(comments)
        tone_percentages = {
            tone: round((count / total_comments) * 100, 1) 
            for tone, count in tone_distribution.items()
        }
        
        return {
            'total_comments': total_comments,
            'tone_distribution': tone_distribution,
            'tone_percentages': tone_percentages,
            'detailed_analysis': detailed_analysis
        }


# Test function
def test_tone_analysis():
    """Test the tone analysis functionality"""
    analyzer = CommentToneAnalyzer()
    
    test_comments = [
        "This is an excellent move for ease of doing business! Great initiative by the government.",
        "I am deeply concerned about this amendment. It poses significant risks to investor protection.",
        "I suggest adding more safeguards to prevent misuse. Maybe we should consider a phased approach.",
        "Wow, what a brilliant idea! Obviously the best solution for all our problems!!",
        "Please provide more details about the implementation timeline and procedures.",
        "Yeh policy acchi hai, government ka sahi decision hai.",
        "Mujhe lagta hai yeh risky hai, bohot saare problems ho sakte hain.",
        "Mera sujhaav hai ki thoda aur strict rules add karne chahiye."
    ]
    
    print("🎭 Testing Tone Analysis System")
    print("=" * 60)
    
    for i, comment in enumerate(test_comments, 1):
        result = analyzer.analyze_tone(comment)
        print(f"\n{i}. Comment: {comment}")
        print(f"   Primary Tone: {result['primary_tone'].upper()}")
        print(f"   Confidence: {result['confidence']}")
        print(f"   Tone Scores: {result['tone_scores']}")
        if result['tone_indicators']:
            print(f"   Indicators: {result['tone_indicators'][:3]}")  # Show first 3

if __name__ == "__main__":
    test_tone_analysis()