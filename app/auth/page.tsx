"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { data: signUpData, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                if (signUpData.user && signUpData.session) {
                    // Auto-confirmed — go to onboarding
                    router.push("/onboarding");
                } else {
                    alert("SUCCESS! Check your email to activate your powers!");
                }
            } else {
                const { data: signInData, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Check if onboarding is complete
                if (signInData.user) {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("onboarding_complete")
                        .eq("id", signInData.user.id)
                        .single();
                    if (profile && !profile.onboarding_complete) {
                        router.push("/onboarding");
                    } else {
                        router.push("/dashboard");
                    }
                } else {
                    router.push("/dashboard");
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="comic-card">
                {/* Header */}
                <h1 className="comic-header">
                    {isSignUp ? "JOIN THE LEAGUE!" : "IDENTIFY YOURSELF, HERO!"}
                </h1>

                {/* Error Alert */}
                {error && (
                    <div className="comic-alert">
                        <strong>ZAP!</strong> {error}
                    </div>
                )}

                <form onSubmit={handleAuth}>
                    <input
                        type="email"
                        placeholder="SECRET IDENTITY (EMAIL)..."
                        className="comic-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="PASSWORD..."
                        className="comic-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="btn btn-auth"
                        disabled={loading}
                    >
                        {loading ? "LOADING..." : isSignUp ? "ACTIVATE POWERS" : "ENTER HQ"}
                    </button>
                </form>

                {/* Toggle */}
                <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", fontFamily: "var(--font-body)" }}>
                    <span
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                        {isSignUp ? "ALREADY A MEMBER? LOG IN" : "DON'T HAVE A SECRET IDENTITY?"}
                    </span>
                </div>
            </div>
        </div>
    );
}
