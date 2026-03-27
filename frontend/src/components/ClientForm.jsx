import { useState } from "react"
const API = import.meta.env.VITE_API_URL

const GOALS = [
    "Retirement planning",
    "Wealth accumulation",
    "College savings",
    "Tax optimization",
    "Home purchase",
    "ESG / Impact investing",
    "Debt payoff",
    "Estate planning",
    "Business exit"
]

const label = (text) => (
    <div style={{
        fontSize: "10px", color: "var(--gold)",
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.1em", marginBottom: "6px"
    }}>{text}</div>
)

const inputStyle = {
    width: "100%", background: "var(--bg-card)",
    border: "1px solid var(--border)", borderRadius: "8px",
    padding: "10px 12px", color: "var(--text)",
    fontSize: "13px", outline: "none",
    fontFamily: "'DM Sans', sans-serif"
}

export default function ClientForm({ onMatch, setLoading, loading }) {
    const [form, setForm] = useState({
        age: "", income: "", assets: "",
        risk_tolerance: "moderate", horizon: "10",
        goals: [], notes: ""
    })

    function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

    function toggleGoal(g) {
        setForm(f => ({
            ...f,
            goals: f.goals.includes(g) ? f.goals.filter(x => x !== g) : [...f.goals, g]
        }))
    }

    async function handleSubmit() {
        if (!form.age || !form.income || !form.goals.length) return
        setLoading(true)
        const res = await fetch(`${API}/match`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                age: parseInt(form.age),
                income: parseInt(form.income),
                assets: parseInt(form.assets || 0),
                risk_tolerance: form.risk_tolerance,
                horizon: parseInt(form.horizon),
                goals: form.goals,
                notes: form.notes
            })
        })
        const data = await res.json()
        onMatch(data.matches, data.profile_summary)
        setLoading(false)
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
                <div style={{
                    fontSize: "10px", color: "var(--gold)",
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "0.1em", marginBottom: "12px"
                }}>// CLIENT PROFILE</div>
                <div style={{ fontSize: "18px", fontWeight: "600", color: "var(--text)", letterSpacing: "-0.02em" }}>
                    Find your advisor match
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Tell us about your financial situation
                </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                    {label("// AGE")}
                    <input type="number" placeholder="32" value={form.age}
                        onChange={e => set("age", e.target.value)} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                    {label("// HORIZON (YRS)")}
                    <select value={form.horizon} onChange={e => set("horizon", e.target.value)}
                        style={{ ...inputStyle, cursor: "pointer" }}>
                        {[5, 10, 15, 20, 30].map(y => <option key={y} value={y}>{y} years</option>)}
                    </select>
                </div>
            </div>

            <div>
                {label("// ANNUAL INCOME ($)")}
                <input type="number" placeholder="120000" value={form.income}
                    onChange={e => set("income", e.target.value)} style={inputStyle} />
            </div>

            <div>
                {label("// INVESTABLE ASSETS ($)")}
                <input type="number" placeholder="50000" value={form.assets}
                    onChange={e => set("assets", e.target.value)} style={inputStyle} />
            </div>

            <div>
                {label("// RISK TOLERANCE")}
                <div style={{ display: "flex", gap: "8px" }}>
                    {["conservative", "moderate", "aggressive"].map(r => (
                        <button key={r} onClick={() => set("risk_tolerance", r)}
                            style={{
                                flex: 1, padding: "8px", borderRadius: "8px",
                                border: `1px solid ${form.risk_tolerance === r ? "var(--gold)" : "var(--border)"}`,
                                background: form.risk_tolerance === r ? "var(--bg-hover)" : "var(--bg-card)",
                                color: form.risk_tolerance === r ? "var(--gold)" : "var(--text-muted)",
                                fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                                textTransform: "capitalize", transition: "all 0.15s"
                            }}>
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                {label("// GOALS (select all that apply)")}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {GOALS.map(g => (
                        <button key={g} onClick={() => toggleGoal(g)}
                            style={{
                                padding: "6px 12px", borderRadius: "20px", fontSize: "11px",
                                border: `1px solid ${form.goals.includes(g) ? "var(--gold)" : "var(--border)"}`,
                                background: form.goals.includes(g) ? "var(--bg-hover)" : "var(--bg-card)",
                                color: form.goals.includes(g) ? "var(--gold)" : "var(--text-muted)",
                                cursor: "pointer", transition: "all 0.15s",
                                fontFamily: "'DM Sans', sans-serif"
                            }}>
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                {label("// ADDITIONAL CONTEXT (optional)")}
                <textarea placeholder="e.g. I have RSUs vesting next year, planning to buy a house..."
                    value={form.notes} onChange={e => set("notes", e.target.value)}
                    rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            <button onClick={handleSubmit}
                disabled={loading || !form.age || !form.income || !form.goals.length}
                style={{
                    background: loading ? "var(--bg-hover)" : "var(--gold)",
                    border: "none", borderRadius: "10px", padding: "12px",
                    color: loading ? "var(--text-dim)" : "#000",
                    fontSize: "14px", fontWeight: "600", cursor: "pointer",
                    transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
                    opacity: (!form.age || !form.income || !form.goals.length) ? 0.4 : 1
                }}>
                {loading ? "Matching..." : "Find My Advisor →"}
            </button>
        </div>
    )
}