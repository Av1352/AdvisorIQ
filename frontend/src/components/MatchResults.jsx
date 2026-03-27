import AdvisorCard from "./AdvisorCard"

export default function MatchResults({ matches, loading, profile }) {
    if (loading) return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", gap: "16px"
        }}>
            <div style={{
                fontSize: "10px", color: "var(--gold)",
                fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em"
            }}>
        // RUNNING FAISS SIMILARITY SEARCH
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Matching your profile...</div>
        </div>
    )

    if (!matches) return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", gap: "16px"
        }}>
            <div style={{ fontSize: "48px", opacity: 0.15 }}>₣</div>
            <div style={{
                fontSize: "10px", color: "var(--gold)",
                fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em"
            }}>
        // FINNY AI ADVISOR MATCHING
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)", textAlign: "center", maxWidth: "360px", lineHeight: 1.6 }}>
                Fill out your profile and we'll match you to the right advisor using embedding similarity search.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px", maxWidth: "300px", width: "100%" }}>
                {[
                    "Embeds your profile as a vector",
                    "Searches 6 advisor profiles via FAISS",
                    "Claude explains each match"
                ].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{
                            color: "var(--gold)", fontSize: "11px",
                            fontFamily: "'DM Mono', monospace", minWidth: "20px"
                        }}>
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>{t}</span>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
                <div style={{
                    fontSize: "10px", color: "var(--gold)",
                    fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: "6px"
                }}>
          // TOP {matches.length} MATCHES
                </div>
                <div style={{ fontSize: "20px", fontWeight: "600", color: "var(--text)", letterSpacing: "-0.02em" }}>
                    Your advisor matches
                </div>
                <div style={{
                    fontSize: "11px", color: "var(--text-dim)", marginTop: "6px",
                    fontFamily: "'DM Mono', monospace",
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "6px", padding: "8px 12px", display: "inline-block"
                }}>
                    {profile}
                </div>
            </div>

            {matches.map((m, i) => (
                <AdvisorCard key={m.id} advisor={m} rank={i} />
            ))}
        </div>
    )
}