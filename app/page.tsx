"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function Home() {
    const heroVideoRef = useRef<HTMLVideoElement>(null);
    const ctaVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (heroVideoRef.current) {
                    heroVideoRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
                }
                if (ctaVideoRef.current) {
                    const section = ctaVideoRef.current.closest(".cta-section");
                    if (section) {
                        const rect = section.getBoundingClientRect();
                        const viewH = window.innerHeight;
                        if (rect.top < viewH && rect.bottom > 0) {
                            const progress = (viewH - rect.top) / (viewH + rect.height);
                            ctaVideoRef.current.style.transform = `translateX(${progress * 15}%)`;
                        }
                    }
                }
                ticking = false;
            });
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* ========== NAVBAR ========== */}
            <nav className="navbar">
                <div className="nav-logo">
                    <div className="logo-icon">💊</div>
                    <span className="logo-text">THE KIDNEY PILL™</span>
                </div>
                <div className="nav-links">
                    <a href="#features">FEATURES</a>
                    <a href="#testimonials">REVIEWS</a>
                    <a href="#cta">DOWNLOAD</a>
                    <a href="/auth" style={{ color: "var(--red)", fontWeight: "bold" }}>MEMBER LOGIN</a>
                </div>
                <a href="#cta" className="nav-cta">
                    DOWNLOAD NOW!
                </a>
                <a href="/auth" className="nav-mobile-login">
                    LOGIN
                </a>
            </nav>

            {/* ========== HERO ========== */}
            <section className="hero">
                <video
                    ref={heroVideoRef}
                    className="hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/Pop_Art_Water_Splash_Video.mp4" type="video/mp4" />
                </video>
                <div className="sunburst"></div>
                <div className="hero-content">
                    <div className="hero-badge">WELCOME TO THE HYDRATION STATION</div>
                    <h1 className="hero-title">
                        <span className="title-line title-red">STOP</span>
                        <span className="title-line title-yellow">KIDNEY-ING</span>
                        <span className="title-line title-red">AROUND!</span>
                    </h1>
                    <p className="hero-subtitle">Safe Hydration, Smarter Medication</p>
                    <div className="hero-buttons">
                    </div>
                </div>
                <div className="halftone-overlay"></div>
            </section>

            {/* ========== MARQUEE ========== */}
            <div className="marquee-strip">
                <div className="marquee-track">
                    <span>PROTECT YOUR KIDNEYS</span>
                    <span className="marquee-dot">★</span>
                    <span>STAY HYDRATED</span>
                    <span className="marquee-dot">★</span>
                    <span>TRACK YOUR HEALTH</span>
                    <span className="marquee-dot">★</span>
                    <span>PROTECT YOUR KIDNEYS</span>
                    <span className="marquee-dot">★</span>
                    <span>STAY HYDRATED</span>
                    <span className="marquee-dot">★</span>
                    <span>TRACK YOUR HEALTH</span>
                    <span className="marquee-dot">★</span>
                    <span>PROTECT YOUR KIDNEYS</span>
                    <span className="marquee-dot">★</span>
                    <span>STAY HYDRATED</span>
                    <span className="marquee-dot">★</span>
                    <span>TRACK YOUR HEALTH</span>
                    <span className="marquee-dot">★</span>
                    <span>PROTECT YOUR KIDNEYS</span>
                    <span className="marquee-dot">★</span>
                    <span>STAY HYDRATED</span>
                    <span className="marquee-dot">★</span>
                    <span>TRACK YOUR HEALTH</span>
                    <span className="marquee-dot">★</span>
                </div>
            </div>

            {/* ========== FEATURES ========== */}
            <section id="features" className="features-section">
                <h2 className="section-title">KEY FEATURES</h2>
                <div className="comic-panels">
                    {/* Panel 1: Hydration Tracker */}
                    <div className="comic-panel">
                        <div className="panel-image panel-blue">
                            <div className="panel-emoji">💧</div>
                            <div className="panel-burst">SPLASH!</div>
                        </div>
                        <h3 className="panel-title">Hydration Tracker</h3>
                        <p className="panel-desc">
                            Track your daily water intake and monitor how well you stay hydrated.
                            Set personal goals and watch your hydration progress over time.
                        </p>
                        <div className="panel-number">PANEL 1/3</div>
                    </div>

                    {/* Panel 2: Medication Log */}
                    <div className="comic-panel">
                        <div className="panel-image panel-red">
                            <div className="panel-emoji">💊</div>
                            <div className="panel-burst">KAPOW!</div>
                        </div>
                        <h3 className="panel-title">Medication Log</h3>
                        <p className="panel-desc">
                            Keep a record of the medications or supplements you take.
                            Easily view your list to stay aware of what you’ve used.
                        </p>
                        <div className="panel-number">PANEL 2/3</div>
                    </div>

                    {/* Panel 3: Health Insights */}
                    <div className="comic-panel">
                        <div className="panel-image panel-yellow">
                            <div className="panel-emoji">📊</div>
                            <div className="panel-burst">WHAM!</div>
                        </div>
                        <h3 className="panel-title">Health Insights</h3>
                        <p className="panel-desc">
                            Access helpful charts and health references, including hydration trends
                            and visual guides like a urine chart. View your data to better understand
                            your habits and overall urinary health.
                        </p>
                        <div className="panel-number">PANEL 3/3</div>
                    </div>
                </div>
            </section>

            {/* ========== WAVE DIVIDER ========== */}
            <div className="wave-divider wave-blue">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path
                        d="M0,40 C360,100 720,0 1080,60 C1260,80 1380,40 1440,50 L1440,100 L0,100 Z"
                        fill="#2196F3"
                    />
                </svg>
            </div>

            {/* ========== OPERATIVES + REVIEWS ========== */}
            <section id="testimonials" className="reviews-section">
                <div className="reviews-header">
                    <div className="hero-badge" style={{ margin: "0 auto 1rem" }}>BEHIND THE MISSION</div>
                    <h2 className="section-title reviews-title">THE OPERATIVES</h2>
                    <p className="reviews-subtitle">SGD 14 &middot; Xavier University &middot; First-Year Medical Students</p>
                    <div className="hero-badge" style={{ margin: "0 auto 2rem", background: "var(--yellow)", color: "var(--black)", transform: "rotate(-2deg)", animation: "float 3s ease-in-out infinite" }}>WHAT THEY SAY</div>
                </div>
                <div className="reviews-slider-container">
                    <div className="reviews-grid">
                        {[
                            { name: "ALIYAH", file: "aiah", quote: "Drink your water, folks — your kidneys are counting on you!" },
                            { name: "ANNIE", file: "annie", quote: "Too much salt and not enough H2O? Your kidneys are silently judging." },
                            { name: "RUELLA", file: "rr", quote: "Hydration isn't a suggestion, it's a kidney's love language." },
                            { name: "ELISE", file: "elise", quote: "Small habits today = happy kidneys tomorrow." },
                            { name: "CYNTHIA", file: "chin", quote: "Preventive habits today mean fewer worries for your kidneys tomorrow." },
                            { name: "CATHY", file: "cathy", quote: "Awareness is cute, but healthy habits are cuter (and better for kidneys)." },
                            { name: "THIRDY", file: "thirdy", quote: "Your kidneys filter a lot — maybe give them a break once in a while?" },
                            { name: "RALPH", file: "sinal", quote: "Kidneys: tiny but mighty. Treat them like royalty." },
                            { name: "EDDIE", file: "edd", quote: "OTC meds are helpful… just don't make your kidneys work overtime." },
                            { name: "MOHAMMAD", file: "ella", quote: "Skip the salt, sip the water, thank your kidneys later." },
                            { name: "ALIYAH", file: "aiah", quote: "Drink your water, folks — your kidneys are counting on you!" },
                            { name: "ANNIE", file: "annie", quote: "Too much salt and not enough H2O? Your kidneys are silently judging." },
                            { name: "RUELLA", file: "rr", quote: "Hydration isn't a suggestion, it's a kidney's love language." },
                            { name: "ELISE", file: "elise", quote: "Small habits today = happy kidneys tomorrow." },
                            { name: "CYNTHIA", file: "chin", quote: "Preventive habits today mean fewer worries for your kidneys tomorrow." },
                            { name: "CATHY", file: "cathy", quote: "Awareness is cute, but healthy habits are cuter (and better for kidneys)." },
                            { name: "THIRDY", file: "thirdy", quote: "Your kidneys filter a lot — maybe give them a break once in a while?" },
                            { name: "RALPH", file: "sinal", quote: "Kidneys: tiny but mighty. Treat them like royalty." },
                            { name: "EDDIE", file: "edd", quote: "OTC meds are helpful… just don't make your kidneys work overtime." },
                            { name: "MOHAMMAD", file: "ella", quote: "Skip the salt, sip the water, thank your kidneys later." },
                        ].map((r, i) => (
                            <div key={i} className="review-card">
                                <div className="review-photo-wrap">
                                    <Image
                                        src={`/individual/${r.file}.webp`}
                                        alt={r.name}
                                        fill
                                        sizes="80px"
                                        className="review-photo"
                                    />
                                </div>
                                <div className="review-quote-mark">&#x201C;</div>
                                <p className="review-text">{r.quote}</p>
                                <div className="review-author">&#x2014; {r.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== WAVE DIVIDER ========== */}
            <div className="wave-divider wave-red">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path
                        d="M0,60 C360,0 720,100 1080,40 C1260,20 1380,60 1440,50 L1440,100 L0,100 Z"
                        fill="#E53935"
                    />
                </svg>
            </div >

            {/* ========== CTA ========== */}
            < section id="cta" className="cta-section" >
                <video ref={ctaVideoRef} className="cta-video" autoPlay loop muted playsInline>
                    <source
                        src="/Villain_s_Lair_Fog_Video_Generation.webm"
                        type="video/webm"
                    />
                </video>
                <h2 className="cta-title">
                    BETTER HABITS FOR
                    <br />
                    BETTER KIDNEYS!
                </h2>
                <div className="cta-box">
                    <p>
                        Join others who stopped kidney-ing around.
                    </p>
                    <form
                        className="cta-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert("Thanks for signing up! 💧");
                        }}
                    >
                        <input
                            type="email"
                            placeholder="ENTER YOUR EMAIL..."
                            className="cta-input"
                            required
                        />
                        <button type="submit" className="btn btn-dark btn-small">
                            JOIN!
                        </button>
                    </form>
                </div>
                <p className="cta-disclaimer">
                    &copy; 2026 STOPKIDNEYINGAROUND INC.
                </p>
                <div className="cta-links">
                    <a href="#">PRIVACY</a>
                    <a href="#">TERMS</a>
                    <a href="#">CONTACT</a>
                </div>
            </section >

            {/* ========== FOOTER ========== */}
            < footer className="footer" >
                <div className="footer-inner">
                    <a href="#">ABOUT MORE</a>
                    <div className="footer-social">
                        <a href="https://www.facebook.com/profile.php?id=61588141253154" target="_blank" rel="noopener noreferrer" className="social-icon-pill fb" aria-label="Facebook">
                            f
                        </a>
                        <a href="https://www.instagram.com/stopkidneyingaround?igsh=MTV3YzJzMHkwdWUyYQ==" target="_blank" rel="noopener noreferrer" className="social-icon-pill ig" aria-label="Instagram">
                            ig
                        </a>
                        <a href="https://www.tiktok.com/@stopkidneyingph?lang=en&is_from_webapp=1&sender_device=mobile&sender_web_id=7610809906288182791" target="_blank" rel="noopener noreferrer" className="social-icon-pill tk" aria-label="TikTok">
                            tk
                        </a>
                    </div>
                    <span className="footer-handle">@KIDNEYPAL</span>
                </div>
            </footer >

        </>
    );
}
