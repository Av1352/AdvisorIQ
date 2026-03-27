import numpy as np
import faiss
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from anthropic import Anthropic
from advisor_profiles import ADVISORS

load_dotenv()

_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

EXPLAIN_PROMPT = """You are a financial advisor matching assistant for Finny AI.
A client has submitted their profile and has been matched to a financial advisor.
Write a concise, personalized 2-3 sentence explanation of WHY this advisor is a strong match for this specific client.
Be specific — reference the client's actual goals, age, income, and risk tolerance.
Be direct and confident. Do not use generic language.

Client Profile:
{client_profile}

Matched Advisor:
Name: {advisor_name}
Specialties: {specialties}
Approach: {approach}
Client they serve best: {client_profile_target}

Explain why this is a strong match in 2-3 sentences:"""

def build_advisor_index():
    texts = [a["client_profile"] for a in ADVISORS]
    embeddings = get_model().encode(texts, convert_to_numpy=True)
    embeddings = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings)
    return index

def profile_to_text(profile):
    return (
        f"Age {profile['age']}, income ${profile['income']:,}/year, "
        f"investable assets ${profile['assets']:,}, "
        f"risk tolerance {profile['risk_tolerance']}, "
        f"investment horizon {profile['horizon']} years, "
        f"primary goals: {', '.join(profile['goals'])}. "
        f"Additional context: {profile.get('notes', 'none provided')}."
    )

def match_advisors(profile, index, k=3):
    profile_text = profile_to_text(profile)
    q_emb = get_model().encode([profile_text], convert_to_numpy=True)
    q_emb = q_emb / np.linalg.norm(q_emb, axis=1, keepdims=True)
    scores, indices = index.search(q_emb, k)
    results = []
    for score, idx in zip(scores[0], indices[0]):
        advisor = ADVISORS[idx].copy()
        advisor["match_score"] = float(score)
        results.append(advisor)
    return profile_text, results

def explain_match(client_profile_text, advisor):
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        messages=[{
            "role": "user",
            "content": EXPLAIN_PROMPT.format(
                client_profile=client_profile_text,
                advisor_name=advisor["name"],
                specialties=", ".join(advisor["specialties"]),
                approach=advisor["approach"],
                client_profile_target=advisor["client_profile"]
            )
        }]
    )
    return response.content[0].text