import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from matching_pipeline import build_advisor_index, match_advisors, explain_match
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

advisor_index = None

@app.get("/health")
def health():
    return {"status": "ok"}

class ClientProfile(BaseModel):
    age: int
    income: int
    assets: int
    risk_tolerance: str
    horizon: int
    goals: List[str]
    notes: Optional[str] = ""

@app.post("/match")
def match(profile: ClientProfile):
    global advisor_index
    if advisor_index is None:
        advisor_index = build_advisor_index()
    profile_text, matches = match_advisors(profile.dict(), advisor_index)
    results = []
    for advisor in matches:
        explanation = explain_match(profile_text, advisor)
        results.append({
            "id": advisor["id"],
            "name": advisor["name"],
            "title": advisor["title"],
            "firm": advisor["firm"],
            "specialties": advisor["specialties"],
            "fee_structure": advisor["fee_structure"],
            "min_assets": advisor["min_assets"],
            "approach": advisor["approach"],
            "availability": advisor["availability"],
            "match_score": advisor["match_score"],
            "explanation": explanation
        })
    return {"matches": results, "profile_summary": profile_text}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)