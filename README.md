# AdvisorIQ

Embedding-based financial advisor matching. Enter a client profile — age, income, assets, risk tolerance, goals — and get matched to the right advisor using FAISS vector similarity search. Claude explains each match in plain language.

Live: https://advisor-iq.vercel.app

---

## How It Works

1. Client profile is converted to a natural language string
2. Embedded using sentence-transformers all-MiniLM-L6-v2 (runs locally, no API key)
3. Compared against 6 advisor profiles via FAISS cosine similarity
4. Top 3 matches returned with similarity scores
5. Claude generates a personalized explanation for each match

---

## Stack

- **Frontend:** React + Tailwind CSS, deployed on Vercel
- **Backend:** FastAPI, deployed on Render
- **Embeddings:** sentence-transformers all-MiniLM-L6-v2 (free, local)
- **Vector Search:** FAISS
- **LLM:** Claude claude-sonnet-4-20250514 via Anthropic API

---

## Repo Structure
```
advisoriq/
  backend/
    main.py
    matching_pipeline.py
    advisor_profiles.py
    requirements.txt
    .env.example
  frontend/
    src/
      App.jsx
      components/
        ClientForm.jsx
        MatchResults.jsx
        AdvisorCard.jsx
    index.html
    package.json
    vite.config.js
    tailwind.config.js
    .env.example
  README.md
  .gitignore
```

---

## Run Locally

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
copy .env.example .env       # add ANTHROPIC_API_KEY
python main.py
```

**Frontend**
```bash
cd frontend
npm install
copy .env.example .env       # set VITE_API_URL=http://localhost:8000
npm run dev
```

---

## Deploy

**Backend on Render**
- New Web Service → connect repo → root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `python main.py`
- Add env var: `ANTHROPIC_API_KEY`

**Frontend on Vercel**
- Import repo → root directory: `frontend`
- Add env var: `VITE_API_URL=https://your-render-url.onrender.com`

---

## Design Decisions

- **Embedding over keyword matching:** Semantic similarity captures nuance that rule-based filters miss. A client saying "I want to grow wealth aggressively" matches an advisor whose profile says "equity-heavy portfolios for long investment horizons" without any keyword overlap.
- **Local embeddings:** sentence-transformers runs on CPU with no API dependency, keeping matching fast and free.
- **Claude for explanation:** Similarity scores alone aren't enough. Claude generates a personalized 2-3 sentence rationale grounded in the client's actual numbers and goals, making the match interpretable.
- **Lazy model loading:** Model initializes on first request, not on startup, keeping Render cold start times within bounds.

---

Built by Anju Vilashni Nandhakumar — vxanju.com