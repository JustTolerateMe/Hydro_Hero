"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/Shared";

export default function IntelPage() {
    const { user, profile, loading } = useAuth();
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [expandedVillain, setExpandedVillain] = useState<string | null>(null);
    const [dossierOpen, setDossierOpen] = useState(false);

    const toggleCard = (card: string) => {
        setExpandedCard(prev => prev === card ? null : card);
        if (card !== "villains") {
            setExpandedVillain(null);
        }
    };

    const toggleVillain = (villain: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedVillain(prev => prev === villain ? null : villain);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="dash">
            <Sidebar user={user} profile={profile} />

            <div className="dash-main">
                {/* HEADER */}
                <div className="dash-header">
                    <h1 className="dash-header-title">INTEL BRIEFING</h1>
                    <div className="dash-header-right">
                        <span className="intel-classified-badge">&#x1F512; CLASSIFIED</span>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="dash-content intel-content">

                    {/* CARD 1: THE FILTERS */}
                    <div className={`dash-card intel-card ${expandedCard === "filters" ? "intel-card-open" : ""}`}>
                        <div className="intel-card-header" onClick={() => toggleCard("filters")}>
                            <div className="intel-card-header-left">
                                <span className="intel-card-icon">&#x1FAC0;</span>
                                <div>
                                    <h3 className="dash-card-title">THE FILTERS</h3>
                                    <span className="intel-card-subtitle">How Your Kidneys Work</span>
                                </div>
                            </div>
                            <span className="intel-card-chevron">{expandedCard === "filters" ? "\u25B2" : "\u25BC"}</span>
                        </div>
                        {expandedCard === "filters" && (
                            <div className="intel-card-body">
                                <p className="intel-card-intro">
                                    Your kidneys are amazing organs that filter your blood, remove waste, and balance fluids and electrolytes. Meet the squad:
                                </p>
                                <div className="intel-fact-list">
                                    <div className="intel-fact">
                                        <span className="intel-fact-icon">&#x1F9EC;</span>
                                        <div>
                                            <strong>THE NEPHRON SQUAD:</strong> Each kidney houses approximately <strong>1 million nephrons</strong> &mdash; tiny filtration units that work around the clock to clean your blood. Think of them as a million-strong superhero team!
                                        </div>
                                    </div>
                                    <div className="intel-fact">
                                        <span className="intel-fact-icon">&#x1F4AA;</span>
                                        <div>
                                            <strong>THE WORKLOAD:</strong> Your kidneys filter roughly <strong>50 gallons of blood every single day</strong> &mdash; that&apos;s more than a bathtub full! They never take a break.
                                        </div>
                                    </div>
                                    <div className="intel-fact">
                                        <span className="intel-fact-icon">&#x1F4A7;</span>
                                        <div>
                                            <strong>THE PLUMBING:</strong> Hydration acts as a <strong>lubricant and pressure regulator</strong>, ensuring the inner kidney (medulla) receives enough oxygen to survive the high-energy task of filtration. Without enough water, your filters lose power!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CARD 2: THE 3 VILLAINS */}
                    <div className={`dash-card intel-card ${expandedCard === "villains" ? "intel-card-open" : ""}`}>
                        <div className="intel-card-header" onClick={() => toggleCard("villains")}>
                            <div className="intel-card-header-left">
                                <span className="intel-card-icon intel-card-icon-red">&#x1F9B9;</span>
                                <div>
                                    <h3 className="dash-card-title">THE 3 VILLAINS</h3>
                                    <span className="intel-card-subtitle">Kidney Stressors</span>
                                </div>
                            </div>
                            <span className="intel-card-chevron">{expandedCard === "villains" ? "\u25B2" : "\u25BC"}</span>
                        </div>
                        {expandedCard === "villains" && (
                            <div className="intel-card-body">
                                <p className="intel-card-intro">
                                    Three everyday factors silently stress your kidneys. Click each villain to learn their tactics:
                                </p>
                                <div className="villain-cards">
                                    {/* VILLAIN 1: DEHYDRATION */}
                                    <div className={`villain-card ${expandedVillain === "dehydration" ? "villain-card-open" : ""}`}>
                                        <div
                                            className="villain-card-header villain-dehydration"
                                            onClick={(e) => toggleVillain("dehydration", e)}
                                        >
                                            <span className="villain-icon">&#x1F3DC;&#xFE0F;</span>
                                            <span className="villain-name">THE VILLAIN: DEHYDRATION</span>
                                            <span className="villain-chevron">{expandedVillain === "dehydration" ? "\u25B2" : "\u25BC"}</span>
                                        </div>
                                        {expandedVillain === "dehydration" && (
                                            <div className="villain-card-body">
                                                <p>
                                                    Low water intake makes urine more concentrated, increasing the workload on your nephrons.
                                                </p>
                                                <p>
                                                    <strong>The Stone Forming Belt:</strong> Residents in hot climates, including the Philippines, face a significantly higher risk of dehydration and stone formation.
                                                </p>
                                                <p>
                                                    <strong>The Result:</strong> When fluid is low, concentrations of calcium, oxalate, and uric acid rise, leading to <strong>&ldquo;supersaturation&rdquo;</strong> &mdash; the primary trigger for kidney stones. Stay hydrated to keep this villain at bay!
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* VILLAIN 2: SALT OVERLOAD */}
                                    <div className={`villain-card ${expandedVillain === "salt" ? "villain-card-open" : ""}`}>
                                        <div
                                            className="villain-card-header villain-salt"
                                            onClick={(e) => toggleVillain("salt", e)}
                                        >
                                            <span className="villain-icon">&#x1F9C2;</span>
                                            <span className="villain-name">THE VILLAIN: SALT OVERLOAD</span>
                                            <span className="villain-chevron">{expandedVillain === "salt" ? "\u25B2" : "\u25BC"}</span>
                                        </div>
                                        {expandedVillain === "salt" && (
                                            <div className="villain-card-body">
                                                <p>
                                                    Many students consume processed snacks and fast foods that are high in sodium.
                                                </p>
                                                <p>
                                                    <strong>The Limit:</strong> The WHO recommends less than <strong>2g of sodium per day</strong> (approx. 5g of salt).
                                                </p>
                                                <p>
                                                    <strong>Silent Stress:</strong> High salt increases <strong>&ldquo;glomerular hyperfiltration&rdquo;</strong> (kidney filtration pressure), which can strain the kidneys even if you feel perfectly fine. Watch out for processed foods and fast food!
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* VILLAIN 3: NSAID ABUSE */}
                                    <div className={`villain-card ${expandedVillain === "nsaid" ? "villain-card-open" : ""}`}>
                                        <div
                                            className="villain-card-header villain-nsaid"
                                            onClick={(e) => toggleVillain("nsaid", e)}
                                        >
                                            <span className="villain-icon">&#x1F48A;</span>
                                            <span className="villain-name">THE VILLAIN: NSAID ABUSE</span>
                                            <span className="villain-chevron">{expandedVillain === "nsaid" ? "\u25B2" : "\u25BC"}</span>
                                        </div>
                                        {expandedVillain === "nsaid" && (
                                            <div className="villain-card-body">
                                                <p>
                                                    Common pain relievers like ibuprofen are called NSAIDs (Non-Steroidal Anti-Inflammatory Drugs).
                                                </p>
                                                <p>
                                                    <strong>The Problem:</strong> They reduce the production of <strong>prostaglandins</strong> &mdash; chemicals that help keep your kidneys well-perfused with blood.
                                                </p>
                                                <p>
                                                    <strong>The Risk:</strong> Chronic use can reduce blood flow and cause <strong>&ldquo;tubular collapse.&rdquo;</strong>
                                                </p>
                                                <p className="villain-warning">
                                                    &#x26A0;&#xFE0F; <strong>NEVER take NSAIDs while dehydrated!</strong> Dehydration + NSAIDs creates a dangerous &ldquo;pre-renal state&rdquo; of injury.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CARD 3: THE SAFETY TABLE */}
                    <div className={`dash-card intel-card ${expandedCard === "safety" ? "intel-card-open" : ""}`}>
                        <div className="intel-card-header" onClick={() => toggleCard("safety")}>
                            <div className="intel-card-header-left">
                                <span className="intel-card-icon intel-card-icon-green">&#x1F6E1;&#xFE0F;</span>
                                <div>
                                    <h3 className="dash-card-title">THE SAFETY TABLE</h3>
                                    <span className="intel-card-subtitle">Your Action Plan</span>
                                </div>
                            </div>
                            <span className="intel-card-chevron">{expandedCard === "safety" ? "\u25B2" : "\u25BC"}</span>
                        </div>
                        {expandedCard === "safety" && (
                            <div className="intel-card-body">
                                <div className="safety-table">
                                    <div className="safety-table-header">
                                        <span></span>
                                        <span>FOCUS</span>
                                        <span>RECOMMENDATION</span>
                                        <span>WHY?</span>
                                    </div>
                                    <div className="safety-row">
                                        <span className="safety-icon">&#x1F4A7;</span>
                                        <span className="safety-category">WATER</span>
                                        <span className="safety-action">Drink 2.0&ndash;3.0 L of fluid daily.</span>
                                        <span className="safety-reason">Flushes away materials before they can form stones.</span>
                                    </div>
                                    <div className="safety-row">
                                        <span className="safety-icon">&#x1F9C2;</span>
                                        <span className="safety-category">SALT</span>
                                        <span className="safety-action">Limit processed/fast foods.</span>
                                        <span className="safety-reason">Prevents faster declines in kidney function (eGFR).</span>
                                    </div>
                                    <div className="safety-row">
                                        <span className="safety-icon">&#x1F48A;</span>
                                        <span className="safety-category">MEDS</span>
                                        <span className="safety-action">Avoid frequent/unnecessary NSAID use.</span>
                                        <span className="safety-reason">Protects the kidneys from drug-induced stress.</span>
                                    </div>
                                    <div className="safety-row safety-row-critical">
                                        <span className="safety-icon">&#x1F6E1;&#xFE0F;</span>
                                        <span className="safety-category">SAFETY</span>
                                        <span className="safety-action">Never take NSAIDs while dehydrated.</span>
                                        <span className="safety-reason">Dehydration + NSAIDs creates a &ldquo;pre-renal state&rdquo; of injury.</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DID YOU KNOW? */}
                    <div className="dash-card intel-funfacts">
                        <div className="dash-card-header">
                            <h3 className="dash-card-title">&#x26A1; DID YOU KNOW?</h3>
                        </div>
                        <div className="intel-funfacts-body">
                            <div className="intel-funfact">
                                <span className="intel-funfact-icon">&#x1F4A1;</span>
                                <span>Mild dehydration is common in teens and young adults &mdash; it silently increases kidney stress without any obvious symptoms.</span>
                            </div>
                            <div className="intel-funfact">
                                <span className="intel-funfact-icon">&#x1F4A1;</span>
                                <span>Early Chronic Kidney Disease (CKD) is silent: fewer than <strong>10%</strong> of people with early-stage kidney impairment even know they have it.</span>
                            </div>
                            <div className="intel-funfact">
                                <span className="intel-funfact-icon">&#x1F4A1;</span>
                                <span><strong>Microalbuminuria:</strong> An early increase in protein in your urine reflects damage before you even feel sick. It&apos;s the earliest detectable sign of kidney trouble.</span>
                            </div>
                        </div>
                    </div>

                    {/* SECRET FOLDER (ABOUT US) */}
                    <div className={`dash-card intel-dossier ${dossierOpen ? "intel-dossier-open" : ""}`}>
                        <div className="intel-dossier-header" onClick={() => setDossierOpen(!dossierOpen)}>
                            <span className="intel-dossier-icon">&#x1F4C2;</span>
                            <h3 className="dash-card-title">SECRET FOLDER</h3>
                            <span className="intel-dossier-stamp">DECLASSIFIED</span>
                            <span className="intel-card-chevron">{dossierOpen ? "\u25B2" : "\u25BC"}</span>
                        </div>
                        {dossierOpen && (
                            <div className="intel-dossier-body">
                                <div className="dossier-field">
                                    <span className="dossier-label">AGENCY</span>
                                    <span className="dossier-value">Stop Kidney-ing Around</span>
                                </div>
                                <div className="dossier-field">
                                    <span className="dossier-label">OPERATIVES</span>
                                    <span className="dossier-value">Medical Students (SGD 14) &mdash; Xavier University</span>
                                </div>
                                <div className="dossier-field">
                                    <span className="dossier-label">MISSION</span>
                                    <span className="dossier-value">Empowering students and rural communities to protect renal health.</span>
                                </div>
                                <div className="dossier-field">
                                    <span className="dossier-label">FULL NAME</span>
                                    <span className="dossier-value">Stop Kidney-ing Around: Safe Hydration, Smarter Medication</span>
                                </div>
                                <div className="dossier-description">
                                    <p>
                                        This initiative is led by first-year medical students (SGD 14) from Xavier University &mdash; Dr. Jose P. Rizal School of Medicine. We aim to empower students and rural communities with the knowledge to protect their long-term renal health.
                                    </p>
                                    <p>
                                        We provide evidence-based education on hydration, salt intake, and safe medication practices through creative advocacy and community outreach &mdash; because everyone deserves to understand how to protect their kidneys.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* MEDICAL DISCLAIMER */}
                <div className="intel-disclaimer">
                    <div className="intel-disclaimer-icon">&#x26A0;&#xFE0F;</div>
                    <h4 className="intel-disclaimer-title">MEDICAL DISCLAIMER</h4>
                    <p className="intel-disclaimer-lead">We provide evidence-based education only.</p>
                    <ul className="intel-disclaimer-list">
                        <li>We do not diagnose kidney disease</li>
                        <li>We do not recommend medication switches</li>
                        <li>We do not provide specific dosages</li>
                        <li>We do not promote herbal remedies as primary therapy</li>
                    </ul>
                    <p className="intel-disclaimer-note">Always consult a licensed healthcare professional for medical advice.</p>
                </div>

                {/* FOOTER */}
                <div className="dash-footer">
                    &#x1F512; DATA ENCRYPTED SECURELY. CONSULT YOUR GP BEFORE CHANGING DOSAGE.
                </div>
            </div>
        </div>
    );
}
