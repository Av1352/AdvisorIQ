import { useState } from "react"
import ClientForm from "./components/ClientForm"
import MatchResults from "./components/MatchResults"

export default function App() {
    const [matches, setMatches] = useState(null)
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState(null)

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
            <header style={{
                borderBottom: "1px solid var(--border)",
                padding: "0 40px", height: "60px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky", top: 0, zIndex: 10, background: "var(--bg)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "28px", height: "28px", borderRadius: "6px",
                        background: "var(--gold)", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "16px"
                    }}>₣</div>
                    <span style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "-0.02em", color: "var(--text)" }}>
                        Finny AI
                    </span>
                    <span style={{
                        fontSize: "10px", color: "var(--text-dim)", fontFamily: "'DM Mono', monospace",
                        letterSpacing: "0.1em", textTransform: "uppercase", marginLeft: "4px"
                    }}>/ Advisor Match</span>
                </div>
                <div style={{
                    fontSize: "11px", fontFamily: "'DM Mono', monospace",
                    color: "var(--text-dim)", background: "var(--bg-card)",
                    border: "1px solid var(--border)", borderRadius: "6px", padding: "5px 12px"
                }}>
                    Powered by FAISS + Claude
                </div>
            </header>

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <aside style={{
                    width: "360px", minWidth: "360px",
                    borderRight: "1px solid var(--border)",
                    padding: "28px 24px", overflowY: "auto",
                    background: "var(--bg)"
                }}>
                    <ClientForm
                        onMatch={(m, p) => { setMatches(m); setProfile(p) }}
                        setLoading={setLoading}
                        loading={loading}
                    />
                </aside>

                <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
                    <MatchResults matches={matches} loading={loading} profile={profile} />
                </main>
            </div>
        </div>
    )
}