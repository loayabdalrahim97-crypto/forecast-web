"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
    } else {
      router.push("/app");
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center font-serif text-xl mb-8 text-[#ECEEF2]">
          FORECAST
        </Link>
        <div className="bg-[#141922] border border-[#262E3A] rounded-xl p-7">
          <h1 className="text-lg font-medium mb-5">Log in</h1>
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A212B] border border-[#262E3A] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D9A441]"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A212B] border border-[#262E3A] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#D9A441]"
            />
            {error && <p className="text-sm text-[#E17086]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D9A441] text-[#161009] font-medium rounded-lg py-2.5 text-sm disabled:opacity-50"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-[#98A2B3] mt-5">
          No account yet?{" "}
          <Link href="/signup" className="text-[#D9A441]">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
