"use client";

import { useState } from "react";
import { db } from "@/lib/db";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

/* ---------- Circuit board SVG background ---------- */
function CyberpunkBg() {
    const nodes1: [number, number][] = [[120, 55], [160, 15], [340, 15], [380, 55], [560, 55], [600, 95], [760, 95], [800, 55], [1000, 55], [1040, 15], [1200, 15], [1240, 55]];
    const nodes2: [number, number][] = [[80, 200], [120, 240], [300, 240], [340, 200], [520, 200], [560, 160], [720, 160], [760, 200], [960, 200], [1000, 240], [1160, 240], [1200, 200]];
    const nodes3: [number, number][] = [[160, 370], [200, 330], [400, 330], [440, 370], [640, 370], [680, 410], [860, 410], [900, 370], [1080, 370], [1120, 330], [1340, 330], [1380, 370]];
    const nodes4: [number, number][] = [[120, 530], [160, 490], [380, 490], [420, 530], [600, 530], [640, 570], [800, 570], [840, 530], [1060, 530], [1100, 570], [1300, 570], [1340, 530]];
    const nodes5: [number, number][] = [[100, 710], [140, 670], [340, 670], [380, 710], [640, 710], [680, 750], [860, 750], [900, 710], [1160, 710], [1200, 670], [1380, 670], [1420, 710]];
    const allNodes = [...nodes1, ...nodes2, ...nodes3, ...nodes4, ...nodes5];

    return (
        <svg
            aria-hidden
            className="pointer-events-none fixed inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
        >
            <rect width="1440" height="900" fill="#06090f" />
            <defs>
                <filter id="cg" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="b" />
                    <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="cg2" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="5" result="b" />
                    <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Dim base traces */}
            <g stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.18">
                <path d="M 0,55 H 120 L 160,15 H 340 L 380,55 H 560 L 600,95 H 760 L 800,55 H 1000 L 1040,15 H 1200 L 1240,55 H 1440" />
                <path d="M 0,200 H 80 L 120,240 H 300 L 340,200 H 520 L 560,160 H 720 L 760,200 H 960 L 1000,240 H 1160 L 1200,200 H 1440" />
                <path d="M 0,370 H 160 L 200,330 H 400 L 440,370 H 640 L 680,410 H 860 L 900,370 H 1080 L 1120,330 H 1340 L 1380,370 H 1440" />
                <path d="M 0,530 H 120 L 160,490 H 380 L 420,530 H 600 L 640,570 H 800 L 840,530 H 1060 L 1100,570 H 1300 L 1340,530 H 1440" />
                <path d="M 0,710 H 100 L 140,670 H 340 L 380,710 H 640 L 680,750 H 860 L 900,710 H 1160 L 1200,670 H 1380 L 1420,710 H 1440" />
                {/* Left spine */}
                <path d="M 80,200 V 330 L 40,370 V 490 L 80,530 V 670 L 40,710 V 900" />
                {/* Right spine */}
                <path d="M 1380,55 V 160 L 1340,200 V 330 L 1380,370 V 490 L 1340,530 V 670 L 1380,710 V 900" />
                {/* Cross connections */}
                <path d="M 380,55 V 200" />
                <path d="M 560,55 V 160" />
                <path d="M 760,95 V 200" />
                <path d="M 960,200 V 0" />
                <path d="M 160,15 V 0" />
                <path d="M 1040,15 V 0" />
                <path d="M 440,370 V 530" />
                <path d="M 640,370 V 570" />
                <path d="M 640,570 V 710" />
                <path d="M 900,370 V 530" />
                <path d="M 340,670 V 900" />
                <path d="M 900,710 V 900" />
                <path d="M 1060,530 V 370 L 1080,350" />
                <path d="M 200,330 V 200" />
                <path d="M 680,410 V 530" />
                <path d="M 1100,570 V 710 L 1160,750" />
                <path d="M 760,200 V 330 L 720,370" />
                <path d="M 1000,55 V 200 L 960,240" />
                <path d="M 420,530 V 670 L 380,710" />
                <path d="M 1200,200 V 330 L 1240,370" />
            </g>

            {/* Bright accent traces with glow */}
            <g stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.45" filter="url(#cg)">
                <path d="M 0,55 H 560 L 600,95 H 760 L 800,55 H 1000 L 1040,15 H 1440" />
                <path d="M 0,370 H 440 L 480,330 H 640 L 680,410 H 860 L 900,370 H 1440" />
                <path d="M 0,710 H 380 L 420,750 H 680 L 720,710 H 1440" />
                <path d="M 560,55 V 160 L 520,200" />
                <path d="M 440,370 V 490 L 420,510 V 530" />
                <path d="M 900,370 V 530 L 860,570 V 710" />
                <path d="M 1200,55 V 200 L 1160,240" />
                <path d="M 760,95 V 160 L 720,200" />
            </g>

            {/* Nodes at every bend */}
            <g fill="#00d4ff" opacity="0.9" filter="url(#cg2)">
                {allNodes.map(([x, y], i) => (
                    <rect key={i} x={x - 3} y={y - 3} width="6" height="6" />
                ))}
            </g>
        </svg>
    );
}
/* -------------------------------------------------- */

function LoginForm() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [sentEmail, setSentEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSendCode(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await db.auth.sendMagicCode({ email });
            setSentEmail(email);
        } catch (err: any) {
            alert("Error: " + (err?.body?.message ?? err?.message ?? "Unknown error"));
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyCode(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await db.auth.signInWithMagicCode({ email: sentEmail, code });
        } catch (err: any) {
            alert("Invalid code: " + (err?.body?.message ?? err?.message ?? ""));
            setCode("");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <CyberpunkBg />
            <div className="relative z-10 bg-[#0c111b]/90 border border-cyan-500/25 rounded-lg p-8 w-full max-w-sm shadow-[0_0_60px_rgba(0,212,255,0.08)] backdrop-blur-sm">
                <h1 className="text-2xl font-bold mb-6 text-white tracking-wide">Access required</h1>
                {!sentEmail ? (
                    <form onSubmit={handleSendCode} className="flex flex-col gap-4">
                        <label className="text-sm font-medium text-gray-400">
                            Email
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                                className="mt-1 block w-full bg-[#060b14] border border-cyan-900/50 rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/60 focus:border-cyan-500/50 placeholder-gray-700"
                                placeholder="you@example.com"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 py-2 rounded font-medium hover:bg-cyan-500/20 hover:border-cyan-500/70 transition-colors disabled:opacity-40 tracking-wide text-sm"
                        >
                            {loading ? "Sending…" : "Send magic code"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
                        <p className="text-sm text-gray-500">
                            Code sent to <strong className="text-cyan-400">{sentEmail}</strong>. Check your email.
                        </p>
                        <label className="text-sm font-medium text-gray-400">
                            Code
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                autoFocus
                                className="mt-1 block w-full bg-[#060b14] border border-cyan-900/50 rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/60 focus:border-cyan-500/50 tracking-widest placeholder-gray-700"
                                placeholder="123456"
                                maxLength={8}
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 py-2 rounded font-medium hover:bg-cyan-500/20 hover:border-cyan-500/70 transition-colors disabled:opacity-40 tracking-wide text-sm"
                        >
                            {loading ? "Verifying…" : "Sign in"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setSentEmail("")}
                            className="text-sm text-gray-600 hover:text-gray-300 transition-colors"
                        >
                            Use a different email
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

function Unauthorized({ email }: { email: string }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <CyberpunkBg />
            <div className="relative z-10 bg-[#0c111b]/90 border border-cyan-500/25 rounded-lg p-8 w-full max-w-sm text-center shadow-[0_0_60px_rgba(0,212,255,0.08)] backdrop-blur-sm">
                <h1 className="text-xl font-bold mb-2 text-white">Unauthorized</h1>
                <p className="text-gray-500 text-sm mb-4">
                    <strong className="text-cyan-400">{email}</strong> does not have admin access.
                </p>
                <button
                    onClick={() => db.auth.signOut()}
                    className="text-sm px-4 py-2 bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 rounded hover:bg-cyan-500/20 transition-colors"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isLoading, user, error } = db.useAuth();

    if (isLoading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <CyberpunkBg />
                <p className="relative z-10 text-cyan-500/60 text-sm tracking-widest">Loading…</p>
            </div>
        );
    }

    if (error || !user) {
        return <LoginForm />;
    }

    if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) {
        return <Unauthorized email={user.email ?? "(unknown)"} />;
    }

    return <>{children}</>;
}
