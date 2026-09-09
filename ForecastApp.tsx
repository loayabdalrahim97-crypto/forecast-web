"use client";
import React, { useState, useMemo, useEffect, createContext, useContext } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, ArrowLeft, ChevronDown, Check, AlertCircle, Loader2, RefreshCw,
  TrendingUp, TrendingDown, Minus, Lock, MessageSquare, Send, RotateCcw, Info, Radar, LogOut,
} from "lucide-react";
import {
  TXT, RANK, RANK_LABEL, PROFILE_STEPS, OPTION_VALUES,
  DEMO_ANSWERS, DEMO_SITUATION_EN, DEMO_CONTEXT_EN, DEMO_SITUATION_AR, DEMO_CONTEXT_AR,
  buildProfileSummary,
} from "@/lib/i18n";

const C = {
  bg: "#0D1015", surface: "#141922", surface2: "#1A212B", border: "#262E3A", borderLight: "#333D4C",
  text: "#ECEEF2", textDim: "#98A2B3", textFaint: "#5B6577",
  amber: "#D9A441", amberDim: "rgba(217,164,65,0.14)", amberBorder: "rgba(217,164,65,0.35)",
  teal: "#4FD1C5", rose: "#E17086",
};

const LangContext = createContext<{ lang: string; setLang: (l: string) => void; dir: string; T: any } | null>(null);
function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangContext");
  return ctx;
}

async function api(path: string, body: unknown) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "REQUEST_FAILED");
  return data;
}

function LanguageSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div style={{ display: "flex", gap: 3, backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: 20, padding: 3 }}>
      {["en", "ar"].map((l) => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding: "4px 10px", borderRadius: 16, fontSize: 12, border: "none", cursor: "pointer",
          backgroundColor: lang === l ? C.amber : "transparent", color: lang === l ? "#161009" : C.textDim, fontWeight: 500,
        }}>{l === "en" ? "EN" : "العربية"}</button>
      ))}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", disabled, icon: Icon, iconRight, type = "button", size = "md", full }: any) {
  const variants: any = {
    primary: { backgroundColor: disabled ? C.textFaint : C.amber, color: "#161009" },
    secondary: { backgroundColor: "transparent", color: C.text, borderColor: C.borderLight },
    ghost: { backgroundColor: "transparent", color: C.textDim, borderColor: "transparent" },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={{
      fontWeight: 500, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      cursor: disabled ? "not-allowed" : "pointer", border: "1px solid transparent", width: full ? "100%" : undefined,
      opacity: disabled ? 0.5 : 1, fontSize: size === "sm" ? 13 : 15, padding: size === "sm" ? "8px 14px" : "12px 22px",
      ...variants[variant],
    }}>
      {Icon && !iconRight && <Icon size={16} />}
      {children}
      {Icon && iconRight && <Icon size={16} />}
    </button>
  );
}

function Card({ children, style = {}, ...rest }: any) {
  return <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, ...style }} {...rest}>{children}</div>;
}
function Label({ children, color = C.textFaint }: any) {
  return <div style={{ fontSize: 12, color, marginBottom: 8, fontWeight: 500 }}>{children}</div>;
}
function SectionHeading({ eyebrow, title, sub }: any) {
  return (
    <div style={{ marginBottom: 28 }}>
      {eyebrow && <div style={{ fontSize: 12, color: C.amber, marginBottom: 10 }}>{eyebrow}</div>}
      <h2 style={{ fontSize: 26, fontWeight: 500, color: C.text, margin: 0, lineHeight: 1.3 }}>{title}</h2>
      {sub && <p style={{ color: C.textDim, marginTop: 10, fontSize: 15, maxWidth: 560, lineHeight: 1.7 }}>{sub}</p>}
    </div>
  );
}
function ErrorState({ message, onRetry }: any) {
  const { T } = useLang();
  return (
    <Card style={{ borderColor: "rgba(225,112,134,0.3)", textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
      <AlertCircle size={22} color={C.rose} style={{ marginBottom: 10 }} />
      <p style={{ color: C.text, fontSize: 15, marginBottom: 18 }}>{message}</p>
      <Button onClick={onRetry} icon={RefreshCw} variant="secondary">{T.retry}</Button>
    </Card>
  );
}
function StageLoader({ stages }: { stages: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= stages.length - 1) return;
    const t = setTimeout(() => setIdx((i) => i + 1), 900);
    return () => clearTimeout(t);
  }, [idx, stages.length]);
  return (
    <div style={{ textAlign: "center", padding: "80px 20px", maxWidth: 420, margin: "0 auto" }}>
      <div style={{ width: 44, height: 44, margin: "0 auto 28px", border: `2px solid ${C.amber}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Radar size={20} color={C.amber} />
      </div>
      {stages.map((s, i) => (
        <div key={s} style={{ fontSize: 14, marginBottom: 10, color: i <= idx ? C.text : C.textFaint, opacity: i <= idx ? 1 : 0.35 }}>
          {i < idx ? "✓ " : ""}{s}
        </div>
      ))}
    </div>
  );
}
function Shell({ children, onHome, step }: any) {
  const { T } = useLang();
  const { data: session } = useSession();
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, gap: 12, flexWrap: "wrap" }}>
        <button onClick={onHome} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ fontSize: 17, color: C.text }}>{T.brand}</div>
        </button>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {step && <div style={{ fontSize: 12, color: C.textFaint }}>{step}</div>}
          <LanguageSwitch />
          {session && (
            <button onClick={() => signOut({ callbackUrl: "/" })} title="Log out" style={{ background: "none", border: "none", cursor: "pointer", color: C.textFaint, display: "flex" }}>
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
function ProgressBar({ current, total }: any) {
  const { T } = useLang();
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 12, color: C.amber, marginBottom: 10 }}>{T.step_of(current, total)}</div>
      <div style={{ display: "flex", gap: 5 }}>
        {Array.from({ length: total }).map((_, i) => <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, backgroundColor: i < current ? C.amber : C.border }} />)}
      </div>
    </div>
  );
}

function Onboarding({ onComplete, onHome, onDemo }: any) {
  const { T, dir } = useLang();
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const step = PROFILE_STEPS[stepIdx];
  const allAnswered = step.ids.every((id: string) => answers[id]);
  return (
    <Shell onHome={onHome} step={T.step_profile}>
      {stepIdx === 0 && (
        <div style={{ textAlign: dir === "rtl" ? "left" : "right", marginTop: -12, marginBottom: 8 }}>
          <button onClick={onDemo} style={{ background: "none", border: "none", color: C.amber, cursor: "pointer", fontSize: 13 }}>{T.demo_cta} →</button>
        </div>
      )}
      <ProgressBar current={stepIdx + 1} total={PROFILE_STEPS.length} />
      {step.ids.map((id: string) => {
        const q = T.profile[id];
        return (
          <div key={id} style={{ marginBottom: 30 }}>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 500, marginBottom: 14 }}>{q.q}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 10 }}>
              {OPTION_VALUES[id].map((val: string) => {
                const selected = answers[id] === val;
                return (
                  <button key={val} onClick={() => setAnswers((a) => ({ ...a, [id]: val }))} style={{
                    textAlign: dir === "rtl" ? "right" : "left", padding: "13px 16px", borderRadius: 8, cursor: "pointer",
                    backgroundColor: selected ? C.amberDim : C.surface,
                    border: `1px solid ${selected ? C.amberBorder : C.border}`, color: selected ? C.text : C.textDim, fontSize: 14,
                  }}>{q.options[val]}</button>
                );
              })}
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <Button variant="ghost" onClick={() => setStepIdx((i) => Math.max(0, i - 1))} disabled={stepIdx === 0} icon={dir === "rtl" ? ArrowRight : ArrowLeft}>{T.back}</Button>
        <Button onClick={() => (stepIdx < PROFILE_STEPS.length - 1 ? setStepIdx((i) => i + 1) : onComplete(answers))} disabled={!allAnswered} icon={dir === "rtl" ? ArrowLeft : ArrowRight} iconRight>
          {stepIdx === PROFILE_STEPS.length - 1 ? T.continue_situation : T.next}
        </Button>
      </div>
    </Shell>
  );
}

function SituationInput({ onSubmit, onHome }: any) {
  const { T, dir } = useLang();
  const [situation, setSituation] = useState("");
  const [context, setContext] = useState("");
  const trimmed = situation.trim();
  return (
    <Shell onHome={onHome} step={T.step_situation}>
      <SectionHeading title={T.situation_title} />
      <textarea value={situation} onChange={(e) => setSituation(e.target.value)} placeholder={T.situation_placeholder} rows={5} dir="auto"
        style={{ width: "100%", backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, color: C.text, fontSize: 15, marginBottom: 22 }} />
      <Label color={C.textDim}>{T.context_label}</Label>
      <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder={T.context_placeholder} rows={3} dir="auto"
        style={{ width: "100%", backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, color: C.text, fontSize: 14, marginBottom: 26 }} />
      {!trimmed && <div style={{ display: "flex", gap: 8, alignItems: "center", color: C.textFaint, fontSize: 13, marginBottom: 16 }}><Info size={14} /> {T.situation_hint}</div>}
      <Button onClick={() => onSubmit(trimmed, context.trim())} disabled={!trimmed} icon={dir === "rtl" ? ArrowLeft : ArrowRight} iconRight>{T.analyze_btn}</Button>
    </Shell>
  );
}

function AnalysisView({ analysis, onAnswerAll, onHome }: any) {
  const { T, dir } = useLang();
  const [qAnswers, setQAnswers] = useState<Record<string, string>>({});
  const questions = analysis.dynamic_questions || [];
  const allAnswered = questions.every((q: any) => qAnswers[q.id]?.trim());
  const groups = [
    { title: T.g_facts, items: analysis.facts, color: C.teal, sub: T.g_facts_sub },
    { title: T.g_assumptions, items: analysis.assumptions, color: C.amber, sub: T.g_assumptions_sub },
    { title: T.g_unknowns, items: analysis.unknowns, color: C.rose, sub: T.g_unknowns_sub },
    { title: T.g_variables, items: analysis.variables, color: C.textDim, sub: T.g_variables_sub },
  ];
  return (
    <Shell onHome={onHome} step={T.step_analysis}>
      <SectionHeading title={T.analysis_title} sub={T.analysis_sub} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 14, marginBottom: 30 }}>
        {groups.map((g) => (
          <Card key={g.title}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: g.color }} />
              <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{g.title}</div>
            </div>
            <div style={{ color: C.textFaint, fontSize: 12, marginBottom: 12 }}>{g.sub}</div>
            {g.items?.length ? (
              <ul style={{ margin: 0, paddingInlineStart: 18, color: C.textDim, fontSize: 13.5, lineHeight: 1.8 }}>
                {g.items.map((it: string, i: number) => <li key={i}>{it}</li>)}
              </ul>
            ) : <div style={{ color: C.textFaint, fontSize: 13 }}>{T.none_identified}</div>}
          </Card>
        ))}
      </div>
      {questions.length > 0 && (
        <div style={{ marginBottom: 30 }}>
          <Label color={C.textDim}>{T.questions_label}</Label>
          {questions.map((q: any) => (
            <Card key={q.id} style={{ marginBottom: 12 }}>
              <div style={{ color: C.text, fontSize: 14.5, marginBottom: 12 }}>{q.question}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(q.options?.length ? q.options : T.default_choice_options).map((opt: string) => {
                  const selected = qAnswers[q.id] === opt;
                  return (
                    <button key={opt} onClick={() => setQAnswers((a) => ({ ...a, [q.id]: opt }))} style={{
                      padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13.5,
                      backgroundColor: selected ? C.amberDim : C.surface2,
                      border: `1px solid ${selected ? C.amberBorder : C.border}`, color: selected ? C.text : C.textDim,
                    }}>{opt}</button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
      <Button onClick={() => onAnswerAll(qAnswers)} disabled={!allAnswered} icon={dir === "rtl" ? ArrowLeft : ArrowRight} iconRight>{T.generate_forecast}</Button>
    </Shell>
  );
}

function rankKey(sc: any) { return RANK[sc.likelihood] || 0; }

function ResultsView({ forecast, isDemo, onUpdate, updateState, onRecordOutcome, outcome, onHome, onStartOver }: any) {
  const { T, dir, lang } = useLang();
  const [expanded, setExpanded] = useState(0);
  const [updateText, setUpdateText] = useState("");
  const scenarios = useMemo(() => forecast.scenarios || [], [forecast.scenarios]);
  const sorted = useMemo(() => [...scenarios].sort((a, b) => rankKey(b) - rankKey(a)), [scenarios]);
  const mostLikely: any = sorted[0];
  const alternative: any = sorted[1];
  const highestImpact: any = useMemo(() => [...scenarios].sort((a: any, b: any) => (RANK[b.impact] || 0) - (RANK[a.impact] || 0))[0], [scenarios]);
  const arrow = dir === "rtl" ? "←" : "→";
  const colorFor = (i: number) => [C.amber, C.teal, C.rose][i % 3];
  const rl = (v: string) => (v ? RANK_LABEL[lang][v] || v : "—");

  return (
    <Shell onHome={onHome} step={T.step_forecast}>
      {isDemo && (
        <Card style={{ marginBottom: 24, backgroundColor: C.amberDim, borderColor: C.amberBorder }}>
          <div style={{ fontSize: 13.5, color: C.text }}>{T.demo_banner} <button onClick={onStartOver} style={{ background: "none", border: "none", color: C.amber, textDecoration: "underline", cursor: "pointer", padding: 0 }}>{T.demo_run_own} {arrow}</button></div>
        </Card>
      )}
      <Label color={C.amber}>{T.forecast_summary}</Label>
      <h2 style={{ color: C.text, fontSize: 22, fontWeight: 500, marginTop: 4, marginBottom: 18, lineHeight: 1.5 }}>{forecast.summary}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 10, marginBottom: 30 }}>
        {[[T.most_likely, mostLikely?.title, C.amber], [T.alternative, alternative?.title, C.teal], [T.highest_impact, highestImpact?.title, C.rose], [T.data_quality, rl(forecast.data_quality), C.textDim]].map(([label, value, tone]: any) => (
          <Card key={label} style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 13.5, color: tone, fontWeight: 500 }}>{value || "—"}</div>
          </Card>
        ))}
      </div>
      <Label color={C.textDim}>{T.scenario_map}</Label>
      <Card style={{ marginBottom: 30 }}>
        {sorted.map((sc: any, i: number) => (
          <div key={sc.title} style={{ marginBottom: i < sorted.length - 1 ? 14 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: C.text, marginBottom: 6 }}>
              <span>{sc.title}</span><span style={{ fontSize: 12, color: colorFor(i) }}>{rl(sc.likelihood)}</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, backgroundColor: C.border, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(rankKey(sc) / 4) * 100}%`, backgroundColor: colorFor(i), borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </Card>
      <Label color={C.textDim}>{T.scenario_detail}</Label>
      <div style={{ marginBottom: 30 }}>
        {sorted.map((sc: any, i: number) => (
          <Card key={sc.title} style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => setExpanded(expanded === i ? -1 : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: C.text, fontSize: 15.5, fontWeight: 500 }}>{sc.title}</div>
              <ChevronDown size={16} color={C.textFaint} style={{ transform: expanded === i ? "rotate(180deg)" : "none" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 16, marginTop: 16, marginBottom: expanded === i ? 18 : 0 }}>
              {[[T.likelihood, sc.likelihood, C.amber], [T.confidence, sc.confidence, C.teal], [T.impact, sc.impact, C.rose]].map(([label, rank, color]: any) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textFaint, marginBottom: 5 }}><span>{label}</span><span style={{ color }}>{rl(rank)}</span></div>
                  <div style={{ display: "flex", gap: 3 }}>{[1, 2, 3, 4].map((n) => <div key={n} style={{ height: 5, flex: 1, borderRadius: 2, backgroundColor: n <= (RANK[rank] || 0) ? color : C.border }} />)}</div>
                </div>
              ))}
            </div>
            {expanded === i && (
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                {[[T.d_rationale, sc.rationale], [T.d_likely_response, sc.likely_user_response], [T.d_recommended_response, sc.recommended_response], [T.d_contingency, sc.contingency_plan]].map(([label, text]: any) => text && (
                  <div key={label} style={{ marginBottom: 12 }}><div style={{ fontSize: 11.5, color: C.textFaint, marginBottom: 3 }}>{label}</div><div style={{ fontSize: 13.5, color: C.textDim, lineHeight: 1.6 }}>{text}</div></div>
                ))}
                {[[T.d_evidence, sc.evidence], [T.d_triggers, sc.triggers], [T.d_warning, sc.early_warning_signs]].map(([label, items]: any) => items?.length > 0 && (
                  <div key={label} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11.5, color: C.textFaint, marginBottom: 3 }}>{label}</div>
                    <ul style={{ margin: 0, paddingInlineStart: 16, color: C.textDim, fontSize: 13.5, lineHeight: 1.7 }}>{items.map((it: string, idx: number) => <li key={idx}>{it}</li>)}</ul>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
      <Label color={C.textDim}>{T.behavioral_context}</Label>
      <Card style={{ marginBottom: 30, backgroundColor: C.surface2 }}><p style={{ color: C.text, fontSize: 14.5, lineHeight: 1.8, margin: 0 }}>{forecast.behavioral_context}</p></Card>
      <Label color={C.textDim}>{T.decision_support}</Label>
      <Card style={{ marginBottom: 30 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.teal, fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>{T.recommended_action}</div>
          <p style={{ color: C.text, fontSize: 14.5, margin: 0, lineHeight: 1.7 }}>{forecast.recommended_action}</p>
        </div>
        {forecast.what_not_to_do?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: C.rose, fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>{T.what_not_to_do}</div>
            <ul style={{ margin: 0, paddingInlineStart: 18, color: C.textDim, fontSize: 14, lineHeight: 1.8 }}>{forecast.what_not_to_do.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul>
          </div>
        )}
        {sorted.slice(0, 2).map((sc: any) => (
          <div key={sc.title} style={{ fontSize: 13.5, color: C.textDim, borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 10 }}>
            <span style={{ color: C.text }}>{T.if_happens(sc.title)}</span> {arrow} {sc.recommended_response}
          </div>
        ))}
      </Card>
      {mostLikely?.suggested_wording && (
        <>
          <Label color={C.textDim}>{T.suggested_wording}</Label>
          <Card style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <MessageSquare size={16} color={C.amber} style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ color: C.text, fontSize: 14.5, margin: 0, lineHeight: 1.7 }}>&ldquo;{mostLikely.suggested_wording}&rdquo;</p>
            </div>
          </Card>
        </>
      )}
      <Label color={C.textDim}>{T.what_could_change}</Label>
      <Card style={{ marginBottom: 30 }}><ul style={{ margin: 0, paddingInlineStart: 18, color: C.textDim, fontSize: 14, lineHeight: 1.9 }}>{(forecast.what_could_change_forecast || []).map((w: string, i: number) => <li key={i}>{w}</li>)}</ul></Card>

      <Label color={C.textDim}>{T.update_forecast}</Label>
      <Card style={{ marginBottom: 30 }}>
        {updateState?.result ? (
          <div>
            <div style={{ color: C.teal, fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>{T.forecast_updated}</div>
            <p style={{ color: C.text, fontSize: 14.5, marginBottom: 14, lineHeight: 1.7 }}>{updateState.result.change_summary}</p>
            {(updateState.result.scenario_deltas || []).map((d: any, i: number) => (
              <div key={i} style={{ fontSize: 13.5, color: C.textDim, display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                {RANK[d.new_likelihood] > RANK[d.previous_likelihood] ? <TrendingUp size={14} color={C.rose} /> : RANK[d.new_likelihood] < RANK[d.previous_likelihood] ? <TrendingDown size={14} color={C.teal} /> : <Minus size={14} color={C.textFaint} />}
                <span style={{ color: C.text }}>{d.title}</span><span style={{ fontSize: 11 }}>{rl(d.previous_likelihood)} {arrow} {rl(d.new_likelihood)}</span>
              </div>
            ))}
            <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 10 }}>{T.new_recommended} <span style={{ color: C.textDim }}>{updateState.result.forecast?.recommended_action}</span></div>
            <div style={{ marginTop: 16 }}><Button size="sm" variant="secondary" onClick={() => onUpdate(null, true)}>{T.add_more_info}</Button></div>
          </div>
        ) : updateState?.loading ? (
          <div style={{ color: C.textDim, fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}><Loader2 size={16} /> {T.updating}</div>
        ) : updateState?.error ? (
          <ErrorState message={T.update_error} onRetry={() => onUpdate(updateText)} />
        ) : (
          <div>
            <textarea value={updateText} onChange={(e) => setUpdateText(e.target.value)} placeholder={T.update_placeholder} rows={3} dir="auto"
              style={{ width: "100%", backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, color: C.text, fontSize: 14, marginBottom: 12 }} />
            <Button size="sm" onClick={() => onUpdate(updateText)} disabled={!updateText.trim()} icon={Send}>{T.update_forecast}</Button>
          </div>
        )}
      </Card>

      <Label color={C.textDim}>{T.outcome_title}</Label>
      <Card style={{ marginBottom: 30 }}>
        {outcome ? (
          <div style={{ color: C.text, fontSize: 14 }}>
            <Check size={15} color={C.teal} style={{ verticalAlign: "middle", marginInlineEnd: 8 }} />
            {T.recorded} <strong>{outcome.choice}</strong>{outcome.note ? ` — "${outcome.note}"` : ""}
            <div style={{ color: C.textFaint, fontSize: 12, marginTop: 6 }}>{T.outcome_note}</div>
          </div>
        ) : <OutcomeForm onRecord={onRecordOutcome} />}
      </Card>

      <Label color={C.textDim}>{T.go_deeper}</Label>
      <Card style={{ marginBottom: 30, backgroundColor: C.surface2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 12, marginBottom: 20 }}>
          {T.locked.map((f: any) => (
            <div key={f.title} style={{ opacity: 0.85, display: "flex", gap: 10 }}>
              <Lock size={14} color={C.textFaint} style={{ marginTop: 3, flexShrink: 0 }} />
              <div><div style={{ color: C.text, fontSize: 13.5, fontWeight: 500 }}>{f.title}</div><div style={{ color: C.textFaint, fontSize: 12.5, marginTop: 2 }}>{f.desc}</div></div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 10 }}>
          {T.tiers.map((p: any) => (
            <div key={p.tier} style={{ padding: 14, borderRadius: 8, border: `1px solid ${p.highlight ? C.amberBorder : C.border}`, backgroundColor: C.surface }}>
              <div style={{ fontSize: 12, color: C.textFaint }}>{p.tier}</div>
              <div style={{ fontSize: 19, color: C.text, marginBottom: 8 }}>{p.price}</div>
              <Button size="sm" full variant={p.highlight ? "primary" : "secondary"} onClick={() => alert(T.unlock_alert)}>{T.unlock}</Button>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button variant="secondary" onClick={onStartOver} icon={RotateCcw}>{T.start_new}</Button>
        <Button variant="ghost" onClick={onHome}>{T.back_home}</Button>
      </div>
    </Shell>
  );
}

function OutcomeForm({ onRecord }: any) {
  const { T } = useLang();
  const [choice, setChoice] = useState<string | null>(null);
  const [note, setNote] = useState("");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {T.outcome_options.map((o: string) => (
          <button key={o} onClick={() => setChoice(o)} style={{
            padding: "9px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13,
            backgroundColor: choice === o ? C.amberDim : C.surface2, border: `1px solid ${choice === o ? C.amberBorder : C.border}`, color: choice === o ? C.text : C.textDim,
          }}>{o}</button>
        ))}
      </div>
      <input dir="auto" value={note} onChange={(e) => setNote(e.target.value)} placeholder={T.outcome_placeholder}
        style={{ width: "100%", backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 13.5, marginBottom: 14 }} />
      <Button size="sm" onClick={() => onRecord({ choice, note: note.trim() })} disabled={!choice}>{T.record_outcome}</Button>
    </div>
  );
}

export default function ForecastApp() {
  const router = useRouter();
  const { status } = useSession();
  const [lang, setLang] = useState("en");
  const [view, setView] = useState<"onboarding" | "situation" | "analyzing" | "analysis" | "analysis-error" | "forecasting" | "forecast-error" | "results">("onboarding");
  const [isDemo, setIsDemo] = useState(false);
  const [profileAnswers, setProfileAnswers] = useState<Record<string, string> | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState("");
  const [updateState, setUpdateState] = useState<any>(null);
  const [outcome, setOutcome] = useState<any>(null);

  const dir = TXT[lang].dir;
  const T = TXT[lang];

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const goHome = () => {
    setView("onboarding"); setIsDemo(false); setProfileAnswers(null); setRunId(null);
    setAnalysis(null); setForecast(null); setError(""); setUpdateState(null); setOutcome(null);
  };

  const runAnalysis = async (profile: Record<string, string>, sit: string, ctx: string) => {
    setView("analyzing"); setError("");
    const start = Date.now();
    try {
      const profileSummary = buildProfileSummary(lang, profile);
      const data = await api("/api/forecast/analyze", { situation: sit, context: ctx, profileSummary, profileJson: profile, lang });
      const wait = Math.max(0, 2200 - (Date.now() - start));
      setTimeout(() => { setRunId(data.runId); setAnalysis(data.analysis); setView("analysis"); }, wait);
    } catch {
      setError(T.analyze_error); setView("analysis-error");
    }
  };

  const runForecast = async (qAnswers: Record<string, string>) => {
    setView("forecasting"); setError("");
    const start = Date.now();
    try {
      const profileSummary = buildProfileSummary(lang, profileAnswers || {});
      const qaText = Object.keys(qAnswers).length
        ? Object.entries(qAnswers).map(([id, a]) => {
            const q = (analysis.dynamic_questions || []).find((dq: any) => dq.id === id);
            return `Q: ${q ? q.question : id}\nA: ${a}`;
          }).join("\n")
        : "(no follow-up questions were needed)";
      const data = await api("/api/forecast/generate", { runId, profileSummary, qaText });
      const wait = Math.max(0, 2200 - (Date.now() - start));
      setTimeout(() => { setForecast(data.forecast); setView("results"); }, wait);
    } catch {
      setError(T.forecast_error); setView("forecast-error");
    }
  };

  const handleUpdate = async (text: string | null, resetOnly?: boolean) => {
    if (resetOnly) { setUpdateState(null); return; }
    setUpdateState({ loading: true });
    try {
      const profileSummary = buildProfileSummary(lang, profileAnswers || {});
      const data = await api("/api/forecast/update", { runId, profileSummary, newInfo: text });
      setUpdateState({ result: data.result });
    } catch {
      setUpdateState({ error: true });
    }
  };

  const handleOutcome = async (o: { choice: string; note: string }) => {
    setOutcome(o);
    try { await api("/api/forecast/outcome", { runId, ...o }); } catch { /* non-blocking */ }
  };

  const startDemo = () => {
    setIsDemo(true);
    setProfileAnswers(DEMO_ANSWERS);
    const sit = lang === "ar" ? DEMO_SITUATION_AR : DEMO_SITUATION_EN;
    const ctx = lang === "ar" ? DEMO_CONTEXT_AR : DEMO_CONTEXT_EN;
    runAnalysis(DEMO_ANSWERS, sit, ctx);
  };

  if (status !== "authenticated") {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim }}>Loading…</div>;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, dir, T }}>
      <div dir={dir} style={{ backgroundColor: C.bg, minHeight: "100vh", color: C.text }}>
        {view === "onboarding" && (
          <Onboarding onComplete={(answers: Record<string, string>) => { setProfileAnswers(answers); setView("situation"); }} onHome={goHome} onDemo={startDemo} />
        )}
        {view === "situation" && (
          <SituationInput onSubmit={(sit: string, ctx: string) => runAnalysis(profileAnswers!, sit, ctx)} onHome={goHome} />
        )}
        {view === "analyzing" && <Shell onHome={goHome} step={T.step_analyzing}><StageLoader stages={T.analyze_stages} /></Shell>}
        {view === "analysis-error" && <Shell onHome={goHome} step={T.step_analysis}><ErrorState message={error} onRetry={() => runAnalysis(profileAnswers!, "", "")} /></Shell>}
        {view === "analysis" && analysis && <AnalysisView analysis={analysis} onAnswerAll={runForecast} onHome={goHome} />}
        {view === "forecasting" && <Shell onHome={goHome} step={T.step_forecasting}><StageLoader stages={T.forecast_stages} /></Shell>}
        {view === "forecast-error" && <Shell onHome={goHome} step={T.step_forecast}><ErrorState message={error} onRetry={() => runForecast({})} /></Shell>}
        {view === "results" && forecast && (
          <ResultsView forecast={forecast} isDemo={isDemo} onUpdate={handleUpdate} updateState={updateState} onRecordOutcome={handleOutcome} outcome={outcome} onHome={goHome} onStartOver={goHome} />
        )}
      </div>
    </LangContext.Provider>
  );
}
