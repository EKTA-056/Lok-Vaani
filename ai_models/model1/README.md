# Lok Vaani AI Comment Generator

Enhanced comment generation system with translation and tone analysis for policy feedback.

## Features

- **Authentic Comments**: Uses curated 588 unique comments dataset (no duplicates)
- **Smart Rotation System**: Prevents repetitive comment selection with batching
- **Quality Deduplication**: Automatically removes duplicates while preserving best content
- **50+ Word Guarantee**: All generated comments meet minimum length requirement  
- **Source Transparency**: Detailed tracking of which comments were used
- **Weighted Selection**: Company category-based comment relevance
- **REST API**: FastAPI with CORS support

## File Structure

```
├── app.py                 # Main application
├── translation_utils.py   # Translation system
├── tone_analyzer.py       # Tone analysis system
├── requirements.txt       # Dependencies
├── data/                  # Dataset files
│   ├── post.json
│   ├── company.json
│   └── comments/
└── venv/                  # Virtual environment
```

## API Response

```json
{
  "success": true,
  "companyName": "Company Name",
  "category": "Insolvency Professional",
  "raw_comment": "Original comment text",
  "standard_comment": "English translated version",
  "language": "en|hi|hinglish",
  "was_translated": true/false,
  "tone": "supportive|concerned|suggestive|sarcastic|neutral",
  "tone_confidence": 1.0,
  "tone_scores": {...},
  "source": "existing_dataset|fallback"
}
```

## Usage

```bash
# Start the server
python app.py

# Access endpoints
GET  /generate          # Random comment
POST /generate          # Specific post/company
GET  /posts             # Available posts
GET  /companies         # Available companies
```

## Installation

```bash
pip install -r requirements.txt
python app.py
```

Server runs on: http://localhost:8000
API Documentation: http://localhost:8000/docs