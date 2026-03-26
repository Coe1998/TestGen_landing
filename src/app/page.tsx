"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase    = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SCENARIOS = [
  { cat: "EXCEPTION", msg: "Verify throw when amount < 0",         ctx: ".ctor" },
  { cat: "BOUNDARY",  msg: "Test limits of: orderAmount >= 500m",  ctx: "CalculateDiscount" },
  { cat: "LOGIC",     msg: "Test all 4 arms of switch expression",  ctx: "GetStockStatus" },
  { cat: "ASYNC",     msg: "Verify async completion of 'ShipOrder'",ctx: "ShipOrderAsync" },
  { cat: "NULL_SAFE",  msg: "Test conditional access (?.) when null",ctx: "GetContactInfo" },
  { cat: "SIDE_EFFECT",msg: "Verify SaveAsync called after Confirm", ctx: "ConfirmOrderAsync" },
];

const CAT_COLOR: Record<string, string> = {
  EXCEPTION:   "text-rust  border-rust/40",
  BOUNDARY:    "text-acid  border-acid/40",
  LOGIC:       "text-paper border-paper/20",
  ASYNC:       "text-[#7DF9FF] border-[#7DF9FF]/40",
  NULL_SAFE:   "text-[#E879F9] border-[#E879F9]/40",
  SIDE_EFFECT: "text-[#FB923C] border-[#FB923C]/40",
};

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function Terminal({ lines }: { lines: string[] }) {
  return (
    <div className="rounded-lg border border-paper/10 bg-ink overflow-hidden">
      {/* title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-paper/10">
        <span className="w-3 h-3 rounded-full bg-rust/80" />
        <span className="w-3 h-3 rounded-full bg-acid/60" />
        <span className="w-3 h-3 rounded-full bg-fog/40" />
        <span className="ml-2 text-fog text-xs">TestGen Output</span>
      </div>
      <div className="p-5 space-y-1">
        {lines.map((l, i) => (
          <div key={i} className="text-xs font-mono leading-relaxed">
            {l.startsWith("[OK]")    && <span className="text-acid">{l}</span>}
            {l.startsWith("[...")    && <span className="text-fog">{l}</span>}
            {l.startsWith("//")     && <span className="text-fog/60">{l}</span>}
            {!l.startsWith("[") && !l.startsWith("//") && (
              <span className="text-paper/80">{l}</span>
            )}
          </div>
        ))}
        <div className="flex items-center gap-1 pt-1">
          <span className="text-xs text-fog">▶</span>
          <span className="w-2 h-4 bg-acid animate-blink inline-block" />
        </div>
      </div>
    </div>
  );
}

function EarlyAccessForm({ stacked = false }: { stacked?: boolean }) {
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState<"idle"|"loading"|"ok"|"err">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { return; }
    setStatus("loading");

    try {
      const { error } = await supabase
        .from("early_access")
        .insert([{ email, created_at: new Date().toISOString() }]);

      if (error && error.code !== "23505") { // 23505 = unique violation (già iscritto)
        throw error;
      }

      setStatus("ok");
      setMessage(
        error?.code === "23505"
          ? "You're already on the list — we'll be in touch."
          : "You're on the list. We'll email you when Pro launches."
      );
    } catch {
      setStatus("err");
      setMessage("Something went wrong. Try again or email us directly.");
    }
  };

  if (status === "ok") {
    return (
      <div className="flex items-center gap-3 bg-acid/10 border border-acid/30 rounded-lg px-5 py-4">
        <span className="text-acid text-xl">✓</span>
        <p className="text-acid text-sm font-mono">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`flex gap-3 ${stacked ? "flex-col" : "flex-col sm:flex-row"}`}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="flex-1 bg-paper/5 border border-paper/20 rounded-lg px-4 py-3
                   text-paper placeholder-fog text-sm font-mono
                   focus:outline-none focus:border-acid/60 transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-acid text-ink font-display font-bold text-sm px-6 py-3 rounded-lg
                   hover:bg-acid/90 transition-colors disabled:opacity-50
                   whitespace-nowrap"
      >
        {status === "loading" ? "..." : "Get Early Access →"}
      </button>
      {status === "err" && (
        <p className="text-rust text-xs font-mono mt-1 sm:col-span-2">{message}</p>
      )}
    </form>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between
                      px-6 py-4 border-b border-paper/5 backdrop-blur-sm bg-ink/80">
        <div className="flex items-center gap-2">
          <span className="text-acid font-display font-bold text-lg tracking-tight">
            Test<span className="text-paper">Gen</span>
          </span>
          <span className="text-fog text-xs font-mono border border-fog/30 px-2 py-0.5 rounded">
            BETA
          </span>
        </div>
        <a
          href="#pricing"
          className="text-sm font-mono text-fog hover:text-paper transition-colors"
        >
          Pricing
        </a>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center
                           px-6 pt-24 pb-16 max-w-6xl mx-auto">

        {/* background grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#F4F1EA 1px, transparent 1px), linear-gradient(90deg, #F4F1EA 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />

        {/* accent blob */}
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full
                         bg-acid/5 blur-[120px] pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-16 items-center">

          {/* left */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 border border-acid/30
                             bg-acid/5 text-acid text-xs font-mono px-3 py-1.5 rounded-full
                             animate-fade-up opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
              VS Code Extension — Free to start
            </div>

            <h1 className="font-display font-extrabold text-5xl lg:text-6xl
                            leading-[1.05] tracking-tight
                            animate-fade-up opacity-0 delay-100">
              Stop writing<br />
              <span className="text-acid">boilerplate</span><br />
              unit tests.
            </h1>

            <p className="text-fog text-lg font-mono leading-relaxed max-w-md
                           animate-fade-up opacity-0 delay-200">
              TestGen analyzes your C# code with AST, detects every testable scenario,
              and generates production-ready tests in seconds — right inside VS Code.
            </p>

            <div className="animate-fade-up opacity-0 delay-300 max-w-md">
              <EarlyAccessForm />
              <p className="text-fog/50 text-xs font-mono mt-3">
                20 free generations/month · No credit card required
              </p>
            </div>
          </div>

          {/* right — terminal */}
          <div className="animate-fade-up opacity-0 delay-400">
            <Terminal lines={[
              "// Right-click any .cs file in VS Code",
              "// TestGen: Generate Tests for This File",
              "",
              "[...] Analyzing AST: OrderService.cs",
              "[OK]  39 scenarios detected",
              "[...] Calling gemini-2.5-flash...",
              "[OK]  Code received: 9,853 chars",
              "[OK]  MoneyTests.cs written",
              "[OK]  Money.Tests.csproj created",
              "[OK]  dotnet restore completed",
            ]} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <p className="text-fog text-xs font-mono uppercase tracking-widest mb-12">
          How it works
        </p>

        <div className="grid md:grid-cols-3 gap-px bg-paper/10 rounded-xl overflow-hidden">
          {[
            {
              n: "01",
              title: "AST Analysis",
              desc: "Tree-sitter parses your C# file and detects every testable scenario: exceptions, boundaries, async flows, null checks, side effects.",
            },
            {
              n: "02",
              title: "AI Generation",
              desc: "Your scenarios are sent to Gemini or GPT-4o with a structured prompt. You use your own API key — your code never leaves your machine.",
            },
            {
              n: "03",
              title: "Files Written",
              desc: "TestGen writes the .cs test file, creates the .csproj with the right NuGet packages, updates your .sln, and runs dotnet restore.",
            },
          ].map(step => (
            <div key={step.n} className="bg-ink p-8 space-y-4">
              <span className="text-acid font-mono text-xs">{step.n}</span>
              <h3 className="font-display font-bold text-xl text-paper">{step.title}</h3>
              <p className="text-fog text-sm font-mono leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SCENARIOS ───────────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <p className="text-fog text-xs font-mono uppercase tracking-widest mb-4">
          What gets detected
        </p>
        <h2 className="font-display font-extrabold text-4xl mb-12">
          9 scenario categories.<br />
          <span className="text-acid">Zero missed edge cases.</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SCENARIOS.map((s, i) => (
            <div key={i}
              className={`border rounded-lg p-4 bg-paper/[0.02] space-y-2
                           transition-all hover:bg-paper/5 ${CAT_COLOR[s.cat]}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono border px-2 py-0.5 rounded
                                   ${CAT_COLOR[s.cat]}`}>
                  {s.cat}
                </span>
                <span className="text-fog text-xs font-mono">{s.ctx}</span>
              </div>
              <p className="text-paper/80 text-sm font-mono">{s.msg}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-6 py-24 max-w-6xl mx-auto">
        <p className="text-fog text-xs font-mono uppercase tracking-widest mb-4">
          Pricing
        </p>
        <h2 className="font-display font-extrabold text-4xl mb-12">
          Start free.<br />
          <span className="text-acid">Scale when you're ready.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="border border-paper/10 rounded-xl p-8 space-y-6 bg-paper/[0.02]">
            <div>
              <p className="text-fog text-xs font-mono mb-2">FREE</p>
              <p className="font-display font-extrabold text-4xl">$0</p>
              <p className="text-fog text-sm font-mono mt-1">forever</p>
            </div>
            <ul className="space-y-3">
              {[
                "20 generations / month",
                "All 3 test frameworks",
                "Gemini + OpenAI support",
                "AST analysis included",
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm font-mono text-paper/80">
                  <span className="text-acid">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href="https://marketplace.visualstudio.com"
              className="block text-center border border-paper/20 text-paper
                          font-mono text-sm py-3 rounded-lg
                          hover:border-paper/40 transition-colors"
            >
              Install Free →
            </a>
          </div>

          {/* Pro */}
          <div className="border border-acid/40 rounded-xl p-8 space-y-6
                           bg-acid/5 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-acid text-ink
                             text-xs font-mono font-bold px-2 py-1 rounded">
              MOST POPULAR
            </div>
            <div>
              <p className="text-acid text-xs font-mono mb-2">PRO</p>
              <p className="font-display font-extrabold text-4xl">$6.99</p>
              <p className="text-fog text-sm font-mono mt-1">per month</p>
            </div>
            <ul className="space-y-3">
              {[
                "200 generations / month",
                "All 3 test frameworks",
                "Gemini + OpenAI support",
                "Email support",
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm font-mono text-paper/80">
                  <span className="text-acid">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <EarlyAccessForm stacked />
              <p className="text-fog/50 text-xs font-mono text-center">
                Launching soon — get notified first
              </p>
            </div>
          </div>

          {/* Pro+ */}
          <div className="border border-rust/40 rounded-xl p-8 space-y-6
                           bg-rust/5 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-rust text-paper
                             text-xs font-mono font-bold px-2 py-1 rounded">
              POWER
            </div>
            <div>
              <p className="text-rust text-xs font-mono mb-2">PRO+</p>
              <p className="font-display font-extrabold text-4xl">$14.99</p>
              <p className="text-fog text-sm font-mono mt-1">per month</p>
            </div>
            <ul className="space-y-3">
              {[
                "Unlimited generations",
                "All 3 test frameworks",
                "Gemini + OpenAI support",
                "Priority email support",
                "Early access to new features",
                "License key for teams",
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm font-mono text-paper/80">
                  <span className="text-rust">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <EarlyAccessForm stacked />
              <p className="text-fog/50 text-xs font-mono text-center">
                Launching soon — get notified first
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-paper/5 px-6 py-8 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row
                         items-center justify-between gap-4">
          <span className="font-display font-bold text-paper/40 text-sm">
            Test<span className="text-acid/40">Gen</span>
          </span>
          <p className="text-fog/40 text-xs font-mono">
            Built for .NET developers who ship fast.
          </p>
        </div>
      </footer>

    </main>
  );
}
