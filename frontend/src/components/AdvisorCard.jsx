export default function AdvisorCard({ advisor, rank }) {
    const pct = (advisor.match_score * 100).toFixed(1)
    const scoreColor = advisor.match_score > 0.7 ? "var(--gold)"
        : advisor.match_score > 0.5 ? "#eab308" : "var(--text-muted)"

    return (
        <div
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = rank === 0 ? "var(--gold)" : "var(--border)"}
            style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "14px", padding: "24px",
                borderLeft: rank === 0 ? "3px solid var(--gold)" : "3px solid var(--border)",
                transition: "border-color 0.2s"
            }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        {rank === 0 && (
                            <span style={{
                                fontSize: "9px", color: "#000", background: "var(--gold)",
                                borderRadius: "4px", padding: "2px 6px",
                                fontFamily: "'DM Mono', monospace", fontWeight: "700"
                            }}>TOP MATCH</span>
                        )}
                        <span style={{ fontSize: "16px", fontWeight: "600", color: "var(--text)", letterSpacing: "-0.02em" }}>
                            {advisor.name}
                        </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{advisor.title}</div>
                    <div style={{
                        fontSize: "11px", color: "var(--text-dim)", marginTop: "2px",
                        fontFamily: "'DM Mono', monospace"
                    }}>{advisor.firm}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{
                        fontSize: "22px", fontWeight: "700", color: scoreColor,
                        fontFamily: "'DM Mono', monospace"
                    }}>{pct}%</div>
                    <div style={{ fontSize: "10px", color: "var(--text-dim)" }}>match score</div>
                </div>
            </div>

            {/* Match explanation */}
            <div style={{
                background: "#08091a", border: "1px solid var(--border)",
                borderRadius: "10px", padding: "14px", marginBottom: "16px",
                borderLeft: "3px solid var(--gold-dim)"
            }}>
                <div style={{
                    fontSize: "10px", color: "var(--gold)",
                    fontFamily: "'DM Mono', monospace", marginBottom: "6px"
                }}>// WHY YOU MATCH</div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
                    {advisor.explanation}
                </p>
            </div>

            {/* Details */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
                {advisor.specialties.slice(0, 3).map(s => (
                    <span key={s} style={{
                        fontSize: "11px", color: "var(--text-muted)",
                        background: "var(--bg)", border: "1px solid var(--border)",
                        borderRadius: "20px", padding: "4px 10px"
                    }}>{s}</span>
                ))}
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
                <div>
                    <div style={{
                        fontSize: "10px", color: "var(--text-dim)",
                        fontFamily: "'DM Mono', monospace", marginBottom: "3px"
                    }}>FEE</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{advisor.fee_structure}</div>
                </div>
                <div>
                    <div style={{
                        fontSize: "10px", color: "var(--text-dim)",
                        fontFamily: "'DM Mono', monospace", marginBottom: "3px"
                    }}>MIN ASSETS</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {advisor.min_assets === 0 ? "No minimum" : `$${advisor.min_assets.toLocaleString()}`}
                    </div>
                </div>
                <div>
                    <div style={{
                        fontSize: "10px", color: "var(--text-dim)",
                        fontFamily: "'DM Mono', monospace", marginBottom: "3px"
                    }}>STATUS</div>
                    <div style={{ fontSize: "12px", color: "var(--gold)" }}>● {advisor.availability}</div>
                </div>
            </div>
        </div>
    )
}