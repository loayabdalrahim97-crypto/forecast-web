import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-6">
        <div className="font-serif text-xl">FORECAST</div>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-[#98A2B3] px-3 py-2">Log in</Link>
          <Link href="/signup" className="text-sm bg-[#D9A441] text-[#161009] font-medium rounded-lg px-4 py-2">
            Start Free Forecast
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        <div className="text-xs tracking-wide text-[#D9A441] mb-6">BEHAVIORAL SCENARIO FORECASTING</div>
        <h1 className="text-4xl md:text-6xl font-medium leading-tight max-w-2xl">
          Your brain sees one possibility.
          <br />
          FORECAST shows you the others.
        </h1>
        <p className="text-lg text-[#98A2B3] mt-6 max-w-xl leading-relaxed">
          Turn uncertainty into scenarios, signals, and better decisions. FORECAST
          doesn&rsquo;t predict the future — it helps you prepare for what could
          happen next.
        </p>
        <div className="flex gap-3 mt-8 flex-wrap">
          <Link href="/signup" className="bg-[#D9A441] text-[#161009] font-medium rounded-lg px-6 py-3">
            Start a Free Forecast →
          </Link>
          <Link href="/signup" className="border border-[#333D4C] rounded-lg px-6 py-3 text-[#ECEEF2]">
            Try a Demo
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 border-t border-[#262E3A]">
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          {[
            ["Understand your patterns", "FORECAST learns how you typically respond to uncertainty and decisions."],
            ["Analyze the situation", "It separates facts, assumptions, unknowns, and the variables that matter."],
            ["Explore multiple scenarios", "Instead of locking onto one explanation, it maps plausible outcomes."],
            ["Prepare your response", "Get a recommended action, warning signs, and a contingency plan."],
          ].map(([t, d]) => (
            <div key={t} className="bg-[#141922] border border-[#262E3A] rounded-xl p-5">
              <div className="font-medium mb-2">{t}</div>
              <div className="text-[#98A2B3] leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#262E3A] py-8 text-center text-xs text-[#5B6577]">
        FORECAST is a decision-support tool. It does not predict the future or diagnose mental health conditions.
      </div>
    </main>
  );
}
