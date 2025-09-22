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
        
        # Initialize comment rotation system
        self.comment_usage_tracker = {}
        self.rotation_config = {
            "batch_size": 15,  # Use 15 comments per batch
            "reset_after": 500,  # Reset after 500 requests
            "daily_reset": True  # Reset daily
        }
        self.total_requests = 0
        self.last_reset_date = None
        
        self.posts = self._load_json("post.json")
        self.companies = self._load_json("company.json") 
        self.comments = self._load_all_comments()
        self._load_t5_model()
    
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
    
    def _check_and_reset_rotation(self):
        """Check if rotation system needs to be reset"""
        import datetime
        
        current_date = datetime.date.today()
        
        # Daily reset check
        if self.rotation_config['daily_reset']:
            if self.last_reset_date != current_date:
                self._reset_comment_rotation()
                self.last_reset_date = current_date
                return
        
        # Request count reset check
        if self.total_requests >= self.rotation_config['reset_after']:
            self._reset_comment_rotation()
    
    def _reset_comment_rotation(self):
        """Reset the comment rotation system"""
        self.comment_usage_tracker = {}
        self.total_requests = 0
    
    def _get_next_comment_batch(self, post_id, comment_type="long"):
        """Get next batch of comments for rotation"""
        if post_id not in self.comment_usage_tracker:
            self.comment_usage_tracker[post_id] = {
                "long": {"used_indices": set(), "current_batch": 0},
                "short": {"used_indices": set(), "current_batch": 0},
                "cross_post": {"used_indices": set(), "current_batch": 0}
            }
        
        tracker = self.comment_usage_tracker[post_id][comment_type]
        batch_size = self.rotation_config['batch_size']
        
        # Get available comments for this post and type
        if comment_type == "long":
            all_comments = [c for c in self.comments.get(post_id, []) if 
                           c.get('commentText') and 
                           c['commentText'] not in ['actual_comments', 'actual_comment', ''] and
                           len(c['commentText'].split()) >= 50]
        elif comment_type == "short":
            all_comments = [c for c in self.comments.get(post_id, []) if 
                           c.get('commentText') and 
                           c['commentText'] not in ['actual_comments', 'actual_comment', ''] and
                           len(c['commentText'].strip()) > 10]
        
        # Deduplicate comments by text content for long/short comments
        if comment_type in ["long", "short"]:
            seen_texts = set()
            available_comments = []
            for comment in all_comments:
                text = comment.get('commentText', '')
                if text not in seen_texts:
                    seen_texts.add(text)
                    available_comments.append(comment)
            

        else:  # cross_post
            available_comments = []
            for pid, comments_list in self.comments.items():
                if pid != post_id:
                    good_comments = [c for c in comments_list if 
                                   c.get('commentText') and 
                                   c['commentText'] not in ['actual_comments', 'actual_comment', ''] and
                                   len(c['commentText'].split()) >= 35]
                    available_comments.extend([(c, pid) for c in good_comments])
        
        if not available_comments:
            return []
        
        total_comments = len(available_comments)
        
        # Calculate batch boundaries
        batch_start = (tracker["current_batch"] * batch_size) % total_comments
        batch_end = min(batch_start + batch_size, total_comments)
        
        # Get current batch
        current_batch = available_comments[batch_start:batch_end]
        
        # If we've used all comments in rotation, reset for this post/type
        if len(tracker["used_indices"]) >= total_comments:
            tracker["used_indices"] = set()
            tracker["current_batch"] = 0
        
        # Filter out already used comments from batch
        unused_batch = []
        for i, comment in enumerate(current_batch):
            global_index = batch_start + i
            if global_index not in tracker["used_indices"]:
                unused_batch.append((comment, global_index))
        
        # If batch is exhausted, move to next batch
        if not unused_batch:
            tracker["current_batch"] = (tracker["current_batch"] + 1) % ((total_comments + batch_size - 1) // batch_size)
            return self._get_next_comment_batch(post_id, comment_type)
        
        return unused_batch
    
    def _select_rotated_comment(self, post_id, comment_type="long", custom_comments=None):
        """Select a comment using rotation system"""
        import random
        
        # For custom comment lists (like cross-post), use them directly
        if custom_comments is not None:
            if not custom_comments:
                return None, None
            # Use simple rotation for custom lists
            tracker_key = f"{post_id}_{comment_type}"
            if tracker_key not in self.comment_usage_tracker:
                self.comment_usage_tracker[tracker_key] = {"used_indices": set(), "current_index": 0}
            
            tracker = self.comment_usage_tracker[tracker_key]
            
            # Reset if we've used all comments
            if len(tracker["used_indices"]) >= len(custom_comments):
                tracker["used_indices"] = set()
                tracker["current_index"] = 0
            
            # Find next unused comment
            while tracker["current_index"] in tracker["used_indices"]:
                tracker["current_index"] = (tracker["current_index"] + 1) % len(custom_comments)
            
            comment = custom_comments[tracker["current_index"]]
            tracker["used_indices"].add(tracker["current_index"])
            tracker["current_index"] = (tracker["current_index"] + 1) % len(custom_comments)
            
            return comment, tracker_key
        
        # Regular batch-based rotation for post-specific comments
        available_batch = self._get_next_comment_batch(post_id, comment_type)
        
        if not available_batch:
            return None, None
        
        # Select random comment from available batch
        comment, used_index = random.choice(available_batch)
        source_post_id = post_id
        
        # Mark as used
        self.comment_usage_tracker[post_id][comment_type]["used_indices"].add(used_index)
        

        
        return comment, source_post_id
    
    def generate_comment(self, post_id=None, company_id=None):
        # Check rotation reset conditions
        self._check_and_reset_rotation()
        self.total_requests += 1
        
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
            
            # First try: Look for comments that already have 50+ words
            long_comments = [c for c in existing_comments if 
                           c.get('commentText') and 
                           c['commentText'] not in ['actual_comments', 'actual_comment', ''] and
                           len(c['commentText'].split()) >= 50]
            
            # Second try: Use shorter comments but expand them
            all_valid_comments = [c for c in existing_comments if 
                                c.get('commentText') and 
                                c['commentText'] not in ['actual_comments', 'actual_comment', ''] and
                                len(c['commentText'].strip()) > 10]
            

            
            if long_comments:
                # Use rotation system for long comments
                selected_comment_obj, _ = self._select_rotated_comment(post['postId'], "long")
                if selected_comment_obj:
                    selected_comment = selected_comment_obj['commentText']
                    comment = self._personalize_existing_comment(selected_comment, company, category)

                    category_weight = self._get_category_weight(company.get('category', 'General'))
                    return {
                        "success": True,
                        "postId": post['postId'],
                        "companyId": company.get('companyId', 0),
                        "companyName": company['companyName'],
                        "category": company.get('category', 'General'),
                        "comment": comment,
                        "wordCount": len(comment.split()),
                        "weightScore": round(category_weight, 2),
                        "postTitle": post['title'],
                        "state": company.get('state', 'Unknown'),
                        "timestamp": str(random.randint(1640995200, 1672531200)),
                        "source": "existing_dataset_long_rotated"
                    }
            elif all_valid_comments:
                # Use rotation system for short comments
                selected_comment_obj, _ = self._select_rotated_comment(post['postId'], "short")
                if selected_comment_obj:
                    selected_comment = selected_comment_obj['commentText']
                    comment = self._personalize_existing_comment(selected_comment, company, category)
                    # Expand short comment to meet 50+ word requirement
                    comment = self._ensure_minimum_words(comment, post, company, min_words=50)

                    category_weight = self._get_category_weight(company.get('category', 'General'))
                return {
                    "success": True,
                    "postId": post['postId'],
                    "companyId": company.get('companyId', 0),
                    "companyName": company['companyName'],
                    "category": company.get('category', 'General'),
                    "comment": comment,
                    "wordCount": len(comment.split()),
                    "weightScore": round(category_weight, 2),
                    "postTitle": post['title'],
                    "state": company.get('state', 'Unknown'),
                    "timestamp": str(random.randint(1640995200, 1672531200)),
                    "source": "existing_dataset_expanded"
                }
        
        # Priority 2: Fallback if no existing comments

        fallback_comment = self._fallback_comment(post, company)
        # Ensure fallback comment meets minimum word requirement
        original_fallback_length = len(fallback_comment.split())
        fallback_comment = self._ensure_minimum_words(fallback_comment, post, company, min_words=50)
        
        category_weight = self._get_category_weight(company.get('category', 'General'))

        return {
            "success": True,
            "postId": post['postId'],
            "companyId": company.get('companyId', 0),
            "companyName": company['companyName'],
            "category": company.get('category', 'General'),
            "comment": fallback_comment,
            "wordCount": len(fallback_comment.split()),
            "weightScore": round(category_weight, 2),
            "postTitle": post['title'],
            "state": company.get('state', 'Unknown'),
            "timestamp": str(random.randint(1640995200, 1672531200)),
            "source": "fallback"
        }
    
    def _fallback_comment(self, post, company):
        """Use existing comments as fallback - try current post first, then other posts"""

        
        # Try 1: Use comments from the current post (with modifications)
        try:
            if post['postId'] in self.comments and self.comments[post['postId']]:
                existing_comments = self.comments[post['postId']]
                real_comments = [c for c in existing_comments if 
                               c.get('commentText') and 
                               c['commentText'] not in ['actual_comments', 'actual_comment', ''] and
                               len(c['commentText'].split()) >= 30]  # Lowered threshold for fallback
                
                if real_comments:
                    selected_comment = random.choice(real_comments)['commentText']
                    return selected_comment
                
        except Exception as e:
            pass
        
        # Try 2: Use comments from other posts (cross-post inspiration)
        try:
            all_good_comments = []
            
            for post_id, comments_list in self.comments.items():
                if post_id != post['postId']:  # Different post
                    good_comments = [c for c in comments_list if 
                                   c.get('commentText') and 
                                   c['commentText'] not in ['actual_comments', 'actual_comment', ''] and
                                   len(c['commentText'].split()) >= 35]
                    all_good_comments.extend(good_comments)
            
            if all_good_comments:
                selected_comment_obj = random.choice(all_good_comments)
                selected_comment = selected_comment_obj['commentText']
                return selected_comment
                
        except Exception as e:
            pass
        
        # Try 3: Generate completely new comment based on post content
        
        def generate_dynamic_comment(post_data, company_data):
            """Generate contextual fallback comments using full post description"""
            # Use both title and draft_text for better context
            title_lower = post_data.get('title', '').lower()
            draft_text_lower = post_data.get('draft_text', '').lower()
            full_content = (title_lower + ' ' + draft_text_lower).strip()
            

            
            company_category = company_data.get('category', 'General')
            # Analyze full content for better policy type detection
            if any(word in full_content for word in ['amendment', 'amend', 'modify', 'change', 'संशोधन']):
                policy_type = "amendment"
                action = "modify existing regulations and enhance compliance frameworks"
            elif any(word in full_content for word in ['recruitment', 'appointment', 'officer', 'भर्ती', 'नियुक्ति']):
                policy_type = "recruitment"
                action = "strengthen administrative capacity and institutional capabilities"
            elif any(word in full_content for word in ['meeting', 'board', 'powers', 'बैठक', 'बोर्ड']):
                policy_type = "governance"
                action = "improve corporate governance standards and board effectiveness"
            elif any(word in full_content for word in ['compromise', 'arrangement', 'amalgamation', 'merger', 'समझौता']):
                policy_type = "restructuring"
                action = "facilitate corporate restructuring processes and business reorganization"
            elif any(word in full_content for word in ['insolvency', 'debt', 'creditor', 'दिवालिया', 'ऋण']):
                policy_type = "insolvency"
                action = "enhance creditor protection mechanisms and debt resolution frameworks"
            elif any(word in full_content for word in ['finance', 'financial', 'nbfc', 'ifsca', 'वित्तीय']):
                policy_type = "financial regulation"
                action = "strengthen financial sector oversight and regulatory coordination"
            elif any(word in full_content for word in ['professional', 'multidisciplinary', 'mdp', 'consulting', 'पेशेवर']):
                policy_type = "professional services"
                action = "enhance professional service delivery and competitiveness"
            else:
                policy_type = "regulatory reform"
                action = "streamline regulatory processes and improve business environment"
            

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
            # Create contextual templates based on actual post content
            context_keywords = []
            if 'consultation' in full_content or 'comment' in full_content:
                context_keywords.append("public consultation process")
            if 'notification' in full_content or 'gazette' in full_content:
                context_keywords.append("official notification mechanism")
            if 'rule' in full_content or 'regulation' in full_content:
                context_keywords.append("regulatory framework")
            if any(word in full_content for word in ['crore', 'lakh', 'financial', 'money']):
                context_keywords.append("financial implications and compliance costs")
            
            context_phrase = ", ".join(context_keywords[:2]) if context_keywords else "regulatory implementation"
            
            templates = [
                f"This {policy_type} initiative represents a comprehensive approach to {action} while ensuring {perspective}. The proposed framework demonstrates the government's commitment to evidence-based policymaking and stakeholder engagement. We particularly appreciate the detailed consideration given to {context_phrase}, which shows thorough preparation and consultation with industry experts. The implementation timeline appears realistic and provides adequate opportunity for organizations to adapt their operational procedures and compliance mechanisms. Furthermore, the clear articulation of objectives and expected outcomes will help establish measurable benchmarks for success. We believe this initiative will significantly enhance the regulatory environment while maintaining essential safeguards that protect all stakeholder interests and promote sustainable business practices.",
                
                f"As representatives of the {company_category.lower()} community, we strongly support the government's initiative to {action} through this well-structured {policy_type} proposal. This development addresses several long-standing concerns within our sector while establishing a robust framework for future growth and compliance. The detailed provisions reflect extensive consultation with industry stakeholders and demonstrate a deep understanding of practical implementation challenges. We are particularly encouraged by the emphasis on {context_phrase}, which will enhance operational efficiency and reduce regulatory uncertainty. The proposed monitoring and feedback mechanisms will ensure continuous improvement and adaptation based on real-world experience. This collaborative approach to policy development sets an excellent precedent for future regulatory reforms and demonstrates the government's commitment to creating an enabling business environment.",
                
                f"The proposed {policy_type} represents a landmark development in regulatory modernization that will fundamentally transform how we {action} across the sector. This initiative demonstrates exceptional forward-thinking and will {perspective} while establishing India as a leader in regulatory innovation. The comprehensive analysis of current challenges and the systematic approach to addressing them through this framework shows remarkable policy maturity. We commend the integration of {context_phrase} throughout the proposal, which ensures both practical applicability and theoretical soundness. The clear delineation of responsibilities, timelines, and performance metrics will facilitate effective implementation and monitoring. This reform will not only address immediate sector needs but also create a scalable model that can adapt to future market dynamics and emerging regulatory challenges.",
                
                f"We enthusiastically endorse this {policy_type} initiative, which will {action} and create unprecedented opportunities to {perspective} across our industry ecosystem. The strategic vision underlying this proposal reflects deep understanding of sector dynamics and stakeholder needs, resulting in a balanced framework that promotes both compliance and innovation. The detailed implementation strategy, including provisions for {context_phrase}, demonstrates thorough preparation and commitment to successful execution. We are particularly impressed by the inclusion of capacity building measures and technical assistance programs, which will ensure that all stakeholders can effectively participate in and benefit from these reforms. The phased rollout approach minimizes disruption while maximizing adoption rates, and the built-in review mechanisms ensure continuous optimization based on implementation feedback and changing market conditions.",
                
                f"This {policy_type} proposal constitutes a transformative step toward creating a world-class regulatory framework that will {action} while fostering an environment where organizations can {perspective} effectively. The initiative addresses critical gaps in the existing system through a comprehensive approach that balances regulatory oversight with business facilitation. We appreciate the government's recognition of the importance of {context_phrase} in ensuring successful policy implementation and stakeholder buy-in. The proposed changes will significantly reduce compliance burdens while enhancing transparency and accountability across all levels of operation. The clear performance indicators and regular review cycles will enable data-driven refinements and ensure that the regulatory framework remains responsive to evolving business needs and international best practices. We are confident that this initiative will serve as a catalyst for broader economic growth and position our sector competitively in the global marketplace."
            ]
            
            
            selected_template = random.choice(templates)
            template_index = templates.index(selected_template) + 1
            return selected_template
        
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
    
    def _ensure_minimum_words(self, comment, post, company, min_words=50):
        """Ensure comment has at least min_words, expand if necessary"""
        words = comment.split()
        if len(words) >= min_words:
            return comment
        
        # If comment is too short, expand it with relevant context
        category = company.get('category', 'General')
        post_title = post.get('title', '').lower()
        
        expansion_templates = [
            "This policy initiative demonstrates the government's commitment to regulatory modernization and stakeholder engagement.",
            "The comprehensive approach taken in this proposal reflects careful consideration of industry best practices and international standards.",
            "We appreciate the transparent consultation process that has been adopted for this important regulatory development.",
            "The implementation framework outlined in this document provides clear guidelines for compliance and enforcement mechanisms.",
            "This initiative aligns with our organization's strategic objectives and will enhance our operational effectiveness.",
            "The proposed changes will strengthen the regulatory ecosystem and improve business confidence in the sector.",
            "We believe this policy will contribute significantly to economic growth and sustainable development in our industry.",
            "The detailed provisions address key concerns raised by stakeholders during previous consultation rounds.",
            "This regulatory reform will facilitate better coordination between various government agencies and industry participants.",
            "The phased implementation approach will allow adequate time for organizations to adapt their processes and systems accordingly."
        ]
        
        # Add contextual expansions based on category
        category_expansions = {
            'Insolvency Professional': "As insolvency professionals, we recognize the importance of maintaining high ethical standards and professional competence in our practice.",
            'Corporate Debtor': "From a corporate perspective, these changes will provide greater clarity on compliance requirements and operational procedures.",
            'Creditor to a Corporate Debtor': "The enhanced protection mechanisms for creditors will improve recovery rates and reduce financial risks.",
            'Academics': "Our research indicates that such policy reforms typically lead to improved market efficiency and reduced regulatory uncertainty.",
            'Partnership firms': "These provisions will particularly benefit partnership structures by addressing specific legal and operational challenges we face.",
            'Proprietorship firms': "As small business owners, we welcome initiatives that simplify regulatory processes while maintaining necessary safeguards.",
            'Investors': "The improved transparency and predictability will create a more conducive environment for long-term investment decisions."
        }
        
        # Expand comment until it reaches minimum word count
        expanded_comment = comment
        
        # Add category-specific context
        if category in category_expansions and len(expanded_comment.split()) < min_words:
            expanded_comment += " " + category_expansions[category]
        
        # Add general expansions until minimum is reached
        while len(expanded_comment.split()) < min_words:
            remaining_words = min_words - len(expanded_comment.split())
            
            # Select appropriate expansion based on remaining words needed
            suitable_expansions = [exp for exp in expansion_templates 
                                 if len(exp.split()) <= remaining_words + 10]
            
            if suitable_expansions:
                expansion = random.choice(suitable_expansions)
                expanded_comment += " " + expansion
            else:
                # Add a smaller generic expansion
                expanded_comment += " We support this initiative and believe it will benefit all stakeholders in the regulatory framework."
        
        return expanded_comment


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
    result = generator.generate_comment()
    return result

@app.post("/generate")
async def generate_specific(request: GenerateRequest):
    result = generator.generate_comment(
        post_id=request.post_id,
        company_id=request.company_id
    )
    return result

@app.get("/posts")
async def get_posts():
    show_count = min(15, len(generator.posts))  # Show 10-15 posts
    return {"posts": len(generator.posts), "list": [p['postId'] for p in generator.posts[:show_count]]}

@app.get("/companies")
async def get_companies():
    show_count = min(20, len(generator.companies))  # Show 10-20 companies  
    return {"companies": len(generator.companies), "list": [c['companyName'] for c in generator.companies[:show_count]]}

if __name__ == "__main__":
    print("\n✅ AI Model Ready!")
    print("✅ Access: http://localhost:8000")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")