"""
Lok Vaani AI Comment Generator
Enhanced system with translation and tone analysis
"""

import json
import random
from pathlib import Path
from transformers import T5Tokenizer, T5ForConditionalGeneration
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
from translation_utils import CommentTranslator
from tone_analyzer import CommentToneAnalyzer

class SimpleCommentGenerator:
    def __init__(self, model_size="base"):
        script_dir = Path(__file__).parent
        self.data_dir = script_dir / "data"
        
        model_options = {
            "small": "t5-small",
            "base": "t5-base",
            "large": "t5-large",
            "3b": "t5-3b",
            "11b": "t5-11b"
        }
        
        self.model_name = model_options.get(model_size, "t5-base")
        self.tokenizer = None
        self.model = None
        
        print("Loading data...")
        self.posts = self._load_json("post.json")
        self.companies = self._load_json("company.json") 
        self.comments = self._load_all_comments()
        
        print(f"Loaded {len(self.posts)} posts, {len(self.companies)} companies")
        print("Loading T5 model...")
        self._load_t5_model()
        
        print("Loading translation system...")
        self.translator = CommentTranslator()
        
        print("Loading tone analyzer...")
        self.tone_analyzer = CommentToneAnalyzer()
    
    def _load_json(self, filename):
        file_path = self.data_dir / filename
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []
    
    def _load_all_comments(self):
        comments = {}
        comments_dir = self.data_dir / "comments"
        if comments_dir.exists():
            for file_path in comments_dir.glob("*.json"):
                post_id = file_path.stem.replace("_comments", "")
                with open(file_path, 'r', encoding='utf-8') as f:
                    comments[post_id] = json.load(f)
        return comments
    
    def _load_t5_model(self):
        self.tokenizer = T5Tokenizer.from_pretrained(self.model_name, legacy=False)
        self.model = T5ForConditionalGeneration.from_pretrained(self.model_name)
        print("✅ T5 model loaded!")
    
    def generate_comment(self, post_id=None, company_id=None):
        if post_id:
            post = next((p for p in self.posts if p['postId'] == post_id), None)
        else:
            post = random.choice(self.posts) if self.posts else None
        
        if not post:
            return {"error": "No post found"}
        
        if company_id:
            company = next((c for c in self.companies if c['companyId'] == company_id), None)
        else:
            company = self._get_weighted_company_selection()
        
        if not company:
            return {"error": "No company found"}
        
        category = company.get('category', 'General')
        
        # Priority 1: Use existing comments from dataset
        if post['postId'] in self.comments and self.comments[post['postId']]:
            existing_comments = self.comments[post['postId']]
            
            real_comments = [c for c in existing_comments if 
                           c.get('commentText') and 
                           c['commentText'] not in ['actual_comment', ''] and
                           len(c['commentText']) > 20]
            
            if real_comments:
                selected_comment = random.choice(real_comments)['commentText']
                comment = self._personalize_existing_comment(selected_comment, company, category)
                
                translation_result = self.translator.process_comment(comment)
                tone_result = self.tone_analyzer.analyze_tone(translation_result['standard_comment'])
                category_weight = self._get_category_weight(company.get('category', 'General'))
                return {
                    "success": True,
                    "postId": post['postId'],
                    "companyId": company.get('companyId', 0),
                    "companyName": company['companyName'],
                    "category": company.get('category', 'General'),
                    "raw_comment": translation_result['raw_comment'],
                    "standard_comment": translation_result['standard_comment'],
                    "language": translation_result['language'],
                    "was_translated": translation_result['was_translated'],
                    "tone": tone_result['primary_tone'],
                    "tone_confidence": tone_result['confidence'],
                    "tone_scores": tone_result['tone_scores'],
                    "weightScore": round(category_weight, 2),
                    "postTitle": post['title'],
                    "state": company.get('state', 'Unknown'),
                    "timestamp": str(random.randint(1640995200, 1672531200)),
                    "source": "existing_dataset"
                }
        
        # Priority 2: Fallback if no existing comments
        fallback_comment = self._fallback_comment(post, company)
        translation_result = self.translator.process_comment(fallback_comment)
        tone_result = self.tone_analyzer.analyze_tone(translation_result['standard_comment'])
        
        category_weight = self._get_category_weight(company.get('category', 'General'))
        
        return {
            "success": True,
            "postId": post['postId'],
            "companyId": company.get('companyId', 0),
            "companyName": company['companyName'],
            "category": company.get('category', 'General'),
            "raw_comment": translation_result['raw_comment'],
            "standard_comment": translation_result['standard_comment'],
            "language": translation_result['language'],
            "was_translated": translation_result['was_translated'],
            "tone": tone_result['primary_tone'],
            "tone_confidence": tone_result['confidence'],
            "tone_scores": tone_result['tone_scores'],
            "weightScore": round(category_weight, 2),
            "postTitle": post['title'],
            "state": company.get('state', 'Unknown'),
            "timestamp": str(random.randint(1640995200, 1672531200)),
            "source": "fallback"
        }
    
    def _fallback_comment(self, post, company):
        """Use existing comments as fallback"""
        try:
            if post['postId'] in self.comments and self.comments[post['postId']]:
                existing_comments = self.comments[post['postId']]
                real_comments = [c for c in existing_comments if 
                               c.get('commentText') and 
                               c['commentText'] not in ['actual_comment', ''] and
                               len(c['commentText']) > 20]
                
                if real_comments:
                    selected_comment = random.choice(real_comments)['commentText']
                    import re
                    
                    modified_comment = selected_comment
                    
                    if random.random() < 0.3:
                        modified_comment = re.sub(r'\b\d+\s*crore\b', 'specified amount', modified_comment, flags=re.IGNORECASE)
                        modified_comment = re.sub(r'\b\d+\s*lakh\b', 'allocated funds', modified_comment, flags=re.IGNORECASE)
                    
                    if random.random() < 0.2:
                        modified_comment = re.sub(r'\bSFIO\b', 'the investigating authority', modified_comment, flags=re.IGNORECASE)
                        modified_comment = re.sub(r'\bMCA\b', 'the ministry', modified_comment, flags=re.IGNORECASE)
                        modified_comment = re.sub(r'\bIFSCA\b', 'the regulatory authority', modified_comment, flags=re.IGNORECASE)
                    
                    return modified_comment
                
        except Exception as e:
            print(f"Existing comment fallback failed: {e}")
        
        def generate_dynamic_comment(post_data, company_data):
            """Generate contextual fallback comments"""
            title_lower = post_data['title'].lower()
            company_category = company_data.get('category', 'General')
            if any(word in title_lower for word in ['amendment', 'amend', 'modify', 'change']):
                policy_type = "amendment"
                action = "modify existing regulations"
            elif any(word in title_lower for word in ['recruitment', 'appointment', 'officer']):
                policy_type = "recruitment"
                action = "strengthen administrative capacity"
            elif any(word in title_lower for word in ['meeting', 'board', 'powers']):
                policy_type = "governance"
                action = "improve corporate governance standards"
            elif any(word in title_lower for word in ['compromise', 'arrangement', 'amalgamation']):
                policy_type = "restructuring"
                action = "facilitate corporate restructuring processes"
            elif any(word in title_lower for word in ['insolvency', 'debt', 'creditor']):
                policy_type = "insolvency"
                action = "enhance creditor protection mechanisms"
            else:
                policy_type = "regulatory"
                action = "streamline regulatory processes"
            category_perspectives = {
                'Insolvency Professional': "enhance our professional practice and better serve distressed companies",
                'Insolvency Professional Agency': "strengthen institutional frameworks and professional standards",
                'Corporate Debtor': "provide clearer pathways for debt resolution and business recovery",
                'Creditor to a Corporate Debtor': "improve recovery mechanisms and protect creditor interests",
                'Academics': "contribute to scholarly discourse and evidence-based policymaking",
                'Partnership firms': "address specific needs of partnership structures in the regulatory framework",
                'Proprietorship firms': "consider the unique challenges faced by small and medium enterprises",
                'Investors': "create more predictable investment environments and reduce regulatory risks",
                'User': "ensure policies are practical and accessible to all stakeholders",
                'Others': "balance diverse stakeholder interests in the policy framework"
            }
            perspective = category_perspectives.get(company_category, "improve regulatory clarity and business operations")
            templates = [
                f"This {policy_type} initiative will {action} and {perspective}. The proposed changes demonstrate a balanced approach to regulatory reform that considers both compliance requirements and operational practicalities, which should result in more effective policy implementation.",
                
                f"As stakeholders in the {company_category.lower()} category, we appreciate the government's efforts to {action} through this {policy_type} proposal. The initiative addresses key concerns while maintaining necessary safeguards, and we believe it will {perspective} across the sector.",
                
                f"The proposed {policy_type} represents a significant step forward in regulatory modernization. By seeking to {action}, this initiative will {perspective} and contribute to a more robust and transparent regulatory environment for all stakeholders.",
                
                f"We support this {policy_type} initiative as it will {action} and create opportunities to {perspective}. The comprehensive approach taken in developing this proposal reflects careful consideration of stakeholder needs and regulatory objectives.",
                
                f"This {policy_type} proposal addresses important gaps in the current regulatory framework and will {action}. The initiative's focus on {perspective} aligns with industry needs and should facilitate more effective compliance and operational efficiency."
            ]
            
            return random.choice(templates)
        
        return generate_dynamic_comment(post, company)
    
    def _personalize_existing_comment(self, comment, company, category):
        """Personalize existing comments for different companies/categories"""
        personalized = comment
        category_prefixes = {
            'Insolvency Professional': ['As insolvency professionals, we believe ', 'From our professional experience, '],
            'Corporate Debtor': ['As a corporate entity, we find ', 'From a business perspective, '],
            'Creditor to a Corporate Debtor': ['As creditors, we appreciate ', 'From a financial standpoint, '],
            'Academics': ['From an academic perspective, ', 'Our research indicates '],
            'Partnership firms': ['As a partnership firm, we support ', 'Our firm believes '],
            'Proprietorship firms': ['As a small business, we welcome ', 'From our business experience, '],
            'Investors': ['As investors, we see ', 'From an investment perspective, '],
            'User': ['We believe ', 'In our opinion, '],
            'Others': ['We think ', 'Our view is that ']
        }
        
        if len(comment) < 50 and category in category_prefixes:
            prefix = random.choice(category_prefixes[category])
            if comment and comment[0].isupper():
                comment = comment[0].lower() + comment[1:]
            personalized = prefix + comment
        
        personalized = personalized.replace('.. ', '. ')
        personalized = personalized.replace('  ', ' ')
        
        return personalized
    
    def _get_weighted_company_selection(self):
        """Select company with category-based weighting"""
        if not self.companies:
            return {'companyName': 'Anonymous Company', 'category': 'General', 'companyId': 0}
        weights = {
            'Insolvency Professional': 4.5,
            'Insolvency Professional Agency': 4.2,
            'Insolvency Professional Entity': 4.0,
            'Corporate Debtor': 3.8,
            'Creditor to a Corporate Debtor': 3.5,
            'Personal Guarantor to a Corporate Debtor': 3.2,
            'Academics': 3.0,
            'Partnership firms': 2.8,
            'Proprietorship firms': 2.5,
            'Investors': 2.2,
            'User': 1.8,
            'Others': 1.5,
            'General': 1.0
        }
        total_weight = 0
        weighted_companies = []
        
        for company in self.companies:
            category = company.get('category', 'General')
            weight = weights.get(category, 1.0)
            total_weight += weight
            weighted_companies.append((company, weight))
        
        rand_val = random.uniform(0, total_weight)
        current_weight = 0
        
        for company, weight in weighted_companies:
            current_weight += weight
            if rand_val <= current_weight:
                return company
        
        return weighted_companies[-1][0] if weighted_companies else {'companyName': 'Anonymous Company', 'category': 'General', 'companyId': 0}
    
    def _get_category_weight(self, category):
        """Get relevance weight for MCA stakeholder category"""
        weights = {
            'Insolvency Professional': 4.5,
            'Insolvency Professional Agency': 4.2,
            'Insolvency Professional Entity': 4.0,
            'Corporate Debtor': 3.8,
            'Creditor to a Corporate Debtor': 3.5,
            'Personal Guarantor to a Corporate Debtor': 3.2,
            'Academics': 3.0,
            'Partnership firms': 2.8,
            'Proprietorship firms': 2.5,
            'Investors': 2.2,
            'User': 1.8,
            'Others': 1.5,
            'General': 1.0
        }
        return weights.get(category, 1.0)

print("🚀 Starting Lok Vaani AI Comment Generator")
print("📊 Using T5-base model (220M parameters)")
generator = SimpleCommentGenerator(model_size="base")
app = FastAPI(title="Lok Vaani AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class GenerateRequest(BaseModel):
    post_id: Optional[str] = None
    company_id: Optional[str] = None

@app.get("/active")
async def root():
    return {"Model1 active": True}

@app.get("/generate")
async def generate_random():
    return generator.generate_comment()

@app.post("/generate")
async def generate_specific(request: GenerateRequest):
    return generator.generate_comment(
        post_id=request.post_id,
        company_id=request.company_id
    )

@app.get("/posts")
async def get_posts():
    return {"posts": len(generator.posts), "list": [p['postId'] for p in generator.posts[:5]]}

@app.get("/companies")
async def get_companies():
    return {"companies": len(generator.companies), "list": [c['companyName'] for c in generator.companies[:5]]}

if __name__ == "__main__":
    print("\n✅ AI Model Ready!")
    print("✅ Access: http://localhost:8000")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")