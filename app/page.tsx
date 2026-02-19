"use client";

import { useEffect, useRef } from "react";

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
                    <div className="hero-speech-bubble">
                        <p>
                            <strong>ZAP!</strong> dehydration before it starts.{" "}
                            <strong>POW!</strong> missed doses right in the kisser. The only
                            app that keeps your organs dancing like it's <strong>1999</strong>.
                        </p>
                        <div className="speech-tail"></div>
                    </div>
                    <p className="hero-subtitle">Safe Hydration, Smarter Medication</p>
                    <div className="hero-buttons">
                        <div className="store-btn-wrap">
                            <a href="#" className="btn btn-dark store-btn-disabled" onClick={(e) => e.preventDefault()}>
                                <span className="btn-icon">🍎</span> APP STORE
                            </a>
                            <span className="coming-soon-tag">COMING SOON</span>
                        </div>
                        <div className="store-btn-wrap">
                            <a href="#" className="btn btn-white store-btn-disabled" onClick={(e) => e.preventDefault()}>
                                <span className="btn-icon">▶</span> PLAY STORE
                            </a>
                            <span className="coming-soon-tag">COMING SOON</span>
                        </div>
                    </div>
                </div>
                <div className="halftone-overlay"></div>
            </section>

            {/* ========== MARQUEE ========== */}
            <div className="marquee-strip">
                <div className="marquee-track">
                    <span>DRINK WATER</span>
                    <span className="marquee-dot">★</span>
                    <span>TAKE PILLS</span>
                    <span className="marquee-dot">★</span>
                    <span>STAY ALIVE</span>
                    <span className="marquee-dot">★</span>
                    <span>DRINK WATER</span>
                    <span className="marquee-dot">★</span>
                    <span>TAKE PILLS</span>
                    <span className="marquee-dot">★</span>
                    <span>STAY ALIVE</span>
                    <span className="marquee-dot">★</span>
                    <span>DRINK WATER</span>
                    <span className="marquee-dot">★</span>
                    <span>TAKE PILLS</span>
                    <span className="marquee-dot">★</span>
                    <span>STAY ALIVE</span>
                    <span className="marquee-dot">★</span>
                    <span>DRINK WATER</span>
                    <span className="marquee-dot">★</span>
                    <span>TAKE PILLS</span>
                    <span className="marquee-dot">★</span>
                    <span>STAY ALIVE</span>
                    <span className="marquee-dot">★</span>
                </div>
            </div>

            {/* ========== FEATURES ========== */}
            <section id="features" className="features-section">
                <h2 className="section-title">EPIC FEATURES</h2>
                <div className="comic-panels">
                    {/* Panel 1: H2O Hero */}
                    <div className="comic-panel">
                        <div className="panel-image panel-blue">
                            <div className="panel-emoji">💧</div>
                            <div className="panel-burst">SPLASH!</div>
                        </div>
                        <h3 className="panel-title">H2O HERO</h3>
                        <p className="panel-desc">
                            Track your daily water intake like a superhero! Set goals, get
                            reminders, and watch your hydration meter fill up. Your kidneys
                            will thank you.
                        </p>
                        <div className="panel-number">PANEL 1/3</div>
                    </div>

                    {/* Panel 2: Pill Power */}
                    <div className="comic-panel">
                        <div className="panel-image panel-red">
                            <div className="panel-emoji">💊</div>
                            <div className="panel-burst">KAPOW!</div>
                        </div>
                        <h3 className="panel-title">PILL POWER</h3>
                        <p className="panel-desc">
                            Never miss a dose again. Set alarms and schedules louder than a
                            cat's meow. Track medications and keep your health in full swing.
                        </p>
                        <div className="panel-number">PANEL 2/3</div>
                    </div>

                    {/* Panel 3: Stat Attack */}
                    <div className="comic-panel">
                        <div className="panel-image panel-yellow">
                            <div className="panel-emoji">📊</div>
                            <div className="panel-burst">WHAM!</div>
                        </div>
                        <h3 className="panel-title">STAT ATTACK</h3>
                        <p className="panel-desc">
                            Charts and graphs galore! See your progress, track weekly trends
                            and smash your health goals with data-driven insights.
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

            {/* ========== TESTIMONIAL ========== */}
            <section id="testimonials" className="testimonial-section">
                <div className="testimonial-card">
                    <blockquote className="testimonial-quote">
                        "HOLY HYDRATION! I USED TO CARRY MY KIDNEYS AROUND IN A BUCKET
                        (METAPHORICALLY). NOW I'M A WATER-DRINKING MACHINE!"
                    </blockquote>
                    <div className="testimonial-author">
                        <div className="author-avatar">😎</div>
                        <div className="author-info">
                            <strong>SALLY SIP-A-LOT</strong>
                            <span>CEO, H2O INDUSTRIES</span>
                        </div>
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
            </div>

            {/* ========== CTA ========== */}
            <section id="cta" className="cta-section">
                <video ref={ctaVideoRef} className="cta-video" autoPlay loop muted playsInline>
                    <source
                        src="/Villain_s_Lair_Fog_Video_Generation.webm"
                        type="video/webm"
                    />
                </video>
                <h2 className="cta-title">
                    DON'T FLUSH
                    <br />
                    YOUR HEALTH!
                </h2>
                <div className="cta-box">
                    <p>
                        Join <strong>50,000+</strong> others who stopped kidney-ing around.
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
                    © 2024 KIDNEY PAL INC. NO KIDNEYS HARMED (JUST KIDDING).
                </p>
                <div className="cta-links">
                    <a href="#">PRIVACY</a>
                    <a href="#">TERMS</a>
                    <a href="#">CONTACT</a>
                </div>
            </section>

            {/* ========== FOOTER ========== */}
            <footer className="footer">
                <div className="footer-inner">
                    <a href="#">ABOUT MORE</a>
                    <div className="footer-social">
                        <a href="#" aria-label="Twitter">
                            𝕏
                        </a>
                        <a href="#" aria-label="Instagram">
                            📷
                        </a>
                        <a href="#" aria-label="TikTok">
                            🎵
                        </a>
                    </div>
                    <span className="footer-handle">@KIDNEYPAL</span>
                </div>
            </footer>

        </>
    );
}
