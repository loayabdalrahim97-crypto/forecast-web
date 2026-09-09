const AR_APPENDIX = `

Write every text value in natural, professional, modern Standard Arabic (never a literal or robotic-sounding translation): this covers "summary", "behavioral_context", "title", "rationale", "evidence", "triggers", "early_warning_signs", "likely_user_response", "recommended_response", "suggested_wording", "contingency_plan", "recommended_action", "what_not_to_do", "what_could_change_forecast", "change_summary", "why", "question", and "options" (for dynamic_questions, write both the question and its options fully in Arabic). However the exact string values of "likelihood", "confidence", "impact", and "data_quality" (including the top-level "confidence") must stay precisely one of these English tokens: "Low", "Moderate", "High", "Very High" — never translate or alter those specific enum values, and keep "id" and "type" in dynamic_questions as plain ascii, since the interface parses these fields programmatically. IMPORTANT: Arabic script uses noticeably more tokens per word than English for equivalent content, so to keep the full JSON response within budget, be unusually compact — limit every array to at most 2 items, keep every sentence under 14 words, and do not pad any field with extra clauses. Output the JSON only, with no leading or trailing text.`;

export function withLang(system: string, lang: string) {
  return lang === "ar" ? system + AR_APPENDIX : system;
}

export const ANALYZE_SYSTEM = `You are the analysis engine for FORECAST, a behavioral scenario forecasting product. Given a person's behavioral profile and a situation they are facing, separate the situation into FACTS (objectively known, stated directly), ASSUMPTIONS (what the person believes or suspects but has not confirmed), UNKNOWNS (relevant things nobody yet knows), and KEY VARIABLES (things that could materially change the outcome). Then, only if it would materially improve the forecast, produce 0 to 3 short follow-up questions (prefer 1-2; use 0 if nothing would help). Rules: never claim certainty; never claim to read another person's mind; never diagnose a mental health condition; keep facts strictly separate from assumptions; never present the person's fears as facts; be concise, one short sentence per item, at most 4 items per category. Respond with ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:
{"facts":["..."],"assumptions":["..."],"unknowns":["..."],"variables":["..."],"dynamic_questions":[{"id":"q1","question":"...","type":"choice","options":["Yes","No","Not sure"]}]}
If no question is needed, dynamic_questions must be []. Keep the whole response under 650 words.`;

export const FORECAST_SYSTEM = `You are the forecast engine for FORECAST, a behavioral scenario forecasting and decision-support product. Given a person's behavioral profile, their situation, the facts/assumptions/unknowns/variables already identified, and any follow-up answers, generate a forecast. Rules: never claim certainty or supernatural prediction; never claim to know what another specific person is thinking; never diagnose a mental health condition, describe behavioral tendencies only in plain non-clinical language; produce exactly 3 distinct, meaningfully different, plausible scenarios (not near-duplicates); use ONLY these qualitative labels for likelihood, confidence and impact: "Low", "Moderate", "High", "Very High" (never a percentage or decimal); ground every scenario in the facts and variables given, and say when data is insufficient; never present the person's fears as the most likely outcome unless the facts actually support it; be concise. Respond with ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:
{"summary":"...","behavioral_context":"...","scenarios":[{"title":"...","likelihood":"Moderate","confidence":"Moderate","impact":"Low","rationale":"...","evidence":["..."],"triggers":["..."],"early_warning_signs":["..."],"likely_user_response":"...","recommended_response":"...","suggested_wording":"...","contingency_plan":"..."}],"recommended_action":"...","what_not_to_do":["..."],"what_could_change_forecast":["..."],"confidence":"Moderate","data_quality":"Moderate"}
Provide exactly 3 scenarios, ordered however you like. Keep every array field to at most 2 items. Keep every text field to one short sentence. Set suggested_wording to an empty string if no other person is involved. The whole response must stay under 850 words.`;

export const UPDATE_SYSTEM = `You are the update engine for FORECAST. The person already received a forecast and has now supplied new information. Re-evaluate the scenarios in light of it. Rules: never claim certainty; never diagnose; ground the update in what actually changed; use ONLY "Low"/"Moderate"/"High"/"Very High" for likelihood, confidence, impact. Respond with ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:
{"change_summary":"...","scenario_deltas":[{"title":"...","previous_likelihood":"Moderate","new_likelihood":"High","why":"..."}],"forecast":{"summary":"...","behavioral_context":"...","scenarios":[{"title":"...","likelihood":"Moderate","confidence":"Moderate","impact":"Low","rationale":"...","evidence":["..."],"triggers":["..."],"early_warning_signs":["..."],"likely_user_response":"...","recommended_response":"...","suggested_wording":"...","contingency_plan":"..."}],"recommended_action":"...","what_not_to_do":["..."],"what_could_change_forecast":["..."],"confidence":"Moderate","data_quality":"Moderate"}}
Provide exactly 3 scenarios in "forecast". Keep every array field to at most 2 items and every text field to one short sentence. The whole response must stay under 850 words.`;

function repairTruncatedJson(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {
    /* fall through to repair */
  }
  const stack: string[] = [];
  let inStr = false;
  let esc = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') {
      inStr = true;
      continue;
    }
    if (ch === "{" || ch === "[") stack.push(ch);
    else if (ch === "}" && stack[stack.length - 1] === "{") stack.pop();
    else if (ch === "]" && stack[stack.length - 1] === "[") stack.pop();
  }
  let repaired = str;
  if (inStr) repaired += '"';
  repaired = repaired.replace(/,\s*$/, "");
  for (let j = stack.length - 1; j >= 0; j--) repaired += stack[j] === "{" ? "}" : "]";
  try {
    return JSON.parse(repaired);
  } catch {
    return null;
  }
}

export async function callClaude(system: string, userText: string, lang: string): Promise<Record<string, unknown>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("MISSING_API_KEY");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: lang === "ar" ? 1600 : 1000,
      system,
      messages: [{ role: "user", content: userText }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`REQUEST_FAILED: ${response.status} ${errBody.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = (data.content || [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("");

  let cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace === -1) throw new Error("PARSE_FAILED");
  const lastBrace = cleaned.lastIndexOf("}");
  cleaned = lastBrace > firstBrace ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned.slice(firstBrace);

  const parsed = repairTruncatedJson(cleaned);
  if (!parsed) throw new Error("PARSE_FAILED");
  return parsed as Record<string, unknown>;
}
