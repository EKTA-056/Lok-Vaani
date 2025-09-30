"""
Lok Vaani AI Comment Generator - Optimized for Single Post
Enhanced system for single post comment generation with rotation
"""

import json
import random
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

class SimpleCommentGenerator:
    def __init__(self):
        script_dir = Path(__file__).parent
        self.data_dir = script_dir / "data"
        
        # Single post setup
        self.posts = self._load_json("post.json")
        self.companies = self._load_json("company.json") 
        self.comments = self._load_all_comments()
        
        # Use the first (and only) post
        self.current_post = self.posts[0] if self.posts else None
        self.current_post_comments = self.comments.get(self.current_post['post'], []) if self.current_post else []
        
        # Initialize comment rotation system for single post
        self.used_comment_indices = set()
        self.comment_variations = []
        self.total_requests = 0
        
        # Prepare comment variations for better diversity
        self._prepare_comment_variations()
        
        # Debug info
        print(f"🔍 Debug Info:")
        print(f"   - Posts loaded: {len(self.posts)}")
        print(f"   - Companies loaded: {len(self.companies)}")
        print(f"   - Comments loaded: {len(self.comments)}")
        if self.current_post:
            print(f"   - Current post: {self.current_post['post']}")
            print(f"   - Post comments: {len(self.current_post_comments)}")
            print(f"   - Comment variations: {len(self.comment_variations)}")
        else:
            print("   - No current post found!")
    
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
                # Extract post key from filename (e.g., post_001_mdp_comments.json -> post_001_mdp)
                key = file_path.stem.replace('_comments', '')
                comments[key] = self._load_json(f"comments/{file_path.name}")
        return comments
    
    def _prepare_comment_variations(self):
        """Prepare variations of comments for better diversity"""
        if not self.current_post_comments:
            return
            
        # Create variations by adding category-specific prefixes and modifications
        self.comment_variations = []
        for comment in self.current_post_comments:
            comment_text = comment.get('commentText', '')
            if len(comment_text.split()) >= 10:  # Only use substantial comments
                self.comment_variations.append(comment_text)
        
        # Shuffle to ensure randomness
        random.shuffle(self.comment_variations)
    
    def _reset_comment_rotation(self):
        """Reset the comment rotation system when all comments are used"""
        self.used_comment_indices = set()
        random.shuffle(self.comment_variations)  # Re-shuffle for new round
    
    def _get_next_unique_comment(self):
        """Get next unique comment from the single post"""
        if not self.comment_variations:
            return None
            
        # If all comments are used, reset the rotation
        if len(self.used_comment_indices) >= len(self.comment_variations):
            self._reset_comment_rotation()
        
        # Find next unused comment
        for i, comment in enumerate(self.comment_variations):
            if i not in self.used_comment_indices:
                self.used_comment_indices.add(i)
                return comment
        
        # Fallback - return a random comment if all are used
        return random.choice(self.comment_variations) if self.comment_variations else None
    
    def _adjust_word_count(self, comment, post, company, min_words=50, max_words=120):
        """Adjust comment to be between 50-120 words"""
        words = comment.split()
        word_count = len(words)
        
        if min_words <= word_count <= max_words:
            return comment
        
        if word_count < min_words:
            # Expand comment
            expansion_templates = [
                "This policy initiative aligns with industry best practices and regulatory standards.",
                "The proposed framework addresses key stakeholder concerns effectively.",
                "Implementation of these measures will enhance operational efficiency significantly.",
                "This comprehensive approach reflects careful consideration of market dynamics.",
                "The consultation process demonstrates transparent governance and stakeholder engagement.",
                "These regulatory changes will strengthen the business environment substantially.",
                "The detailed provisions provide clear guidance for compliance requirements.",
                "This initiative supports economic growth and sustainable development goals."
            ]
            
            # Add expansions until we reach minimum words
            while len(comment.split()) < min_words and expansion_templates:
                expansion = random.choice(expansion_templates)
                expansion_templates.remove(expansion)  # Avoid repetition
                comment += " " + expansion
        
        elif word_count > max_words:
            # Trim to max words
            words = words[:max_words]
            comment = ' '.join(words)
            if not comment.endswith(('.', '!', '?')):
                comment += '.'
        
        return comment
    
    def generate_comment(self, post_id=None, company_id=None):
        self.total_requests += 1
        
        # Use the single post
        post = self.current_post
        if not post:
            return {"error": "No posts available"}
        
        if company_id:
            company = next((c for c in self.companies if c.get('companyId') == company_id), None)
        else:
            company = self._get_weighted_company_selection()
        
        if not company:
            return {"error": "No companies available"}
        
        category = company.get('category', 'General')
        
        # Get next unused comment or generate variation
        selected_comment = self._get_next_unique_comment()
        
        if selected_comment:
            # Personalize for the company
            personalized_comment = self._personalize_existing_comment(
                selected_comment, 
                company, 
                category
            )
            
            # Ensure word count is between 50-120 words
            personalized_comment = self._adjust_word_count(personalized_comment, post, company)
            
            category_weight = self._get_category_weight(category)
            
            return {
                "success": True,
                "postId": post['postId'],
                "companyId": company.get('companyId', 0),
                "companyName": company['companyName'],
                "businessCategoryId": company.get('businessCategoryId', None),
                "comment": personalized_comment,
                "wordCount": len(personalized_comment.split()),
                "postTitle": post['title'],
                "state": company.get('state', 'Unknown'),
                "source": "dataset_rotation"
            }
        
        # Fallback if no comments available
        return {"error": "No comments available for generation"}
    
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
            if not comment.lower().startswith(prefix.lower().split()[0]):
                personalized = prefix + comment.lower()
        
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
            weight = weights.get(company.get('category', 'General'), 1.0)
            weighted_companies.append((company, weight))
            total_weight += weight
        
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

# Initialize generator
generator = SimpleCommentGenerator()
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
    return {"message": "Lok Vaani AI is active!", "total_requests": generator.total_requests}

@app.get("/generate")
async def generate_random():
    return generator.generate_comment()

@app.post("/generate")
async def generate_specific(request: GenerateRequest):
    return generator.generate_comment(request.post_id, request.company_id)

@app.get("/posts")
async def get_posts():
    return {"posts": generator.posts}

@app.get("/companies")
async def get_companies():
    return {"companies": generator.companies}

if __name__ == "__main__":
    print("\n✅ AI Model Ready!")
    print("✅ Access: http://localhost:8000")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")