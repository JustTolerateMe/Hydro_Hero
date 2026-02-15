"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/Shared";
import { Medication } from "@/types";

export default function MedsPage() {
    const { user, profile, loading } = useAuth();
    const [medications, setMedications] = useState<Medication[]>([]);

    // Form State
    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [time, setTime] = useState("");
    const [type, setType] = useState("pill");

    useEffect(() => {
        if (user) {
            fetchMeds(user.id);
        }
    }, [user]);

    const fetchMeds = async (userId: string) => {
        const { data } = await supabase
            .from("medications")
            .select("*")
            .eq("user_id", userId)
            .order("schedule_time", { ascending: true });
        setMedications(data || []);
    };

    const handleAddMed = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const { error } = await supabase.from("medications").insert({
            user_id: user.id,
            name,
            dosage,
            schedule_time: time,
            type
        });

        if (error) {
            alert("Error adding med: " + error.message);
        } else {
            // Reset form and refetch
            setName("");
            setDosage("");
            setTime("");
            fetchMeds(user.id);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Remove this med from your deck?")) return;
        await supabase.from("medications").delete().eq("id", id);
        if (user) fetchMeds(user.id);
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="dashboard-container">
            <Sidebar user={user} profile={profile} />

            <main className="main-content">
                <h1 className="page-title">MEDICATION ARMORY</h1>

                <div className="meds-grid">
                    {/* ADD NEW MED PANEL */}
                    <div className="comic-panel add-med-panel">
                        <h2 className="panel-title">NEW SUPPLY</h2>
                        <form onSubmit={handleAddMed} className="med-form">
                            <input
                                className="comic-input"
                                placeholder="MED NAME (e.g. Kryptonite)"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                            <input
                                className="comic-input"
                                placeholder="DOSAGE (e.g. 500mg)"
                                value={dosage}
                                onChange={e => setDosage(e.target.value)}
                                required
                            />
                            <label className="input-label">SCHEDULE TIME:</label>
                            <input
                                type="time"
                                className="comic-input"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                required
                            />

                            <div className="type-toggle">
                                <label>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="pill"
                                        checked={type === 'pill'}
                                        onChange={e => setType(e.target.value)}
                                    /> PILL 💊
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="liquid"
                                        checked={type === 'liquid'}
                                        onChange={e => setType(e.target.value)}
                                    /> LIQUID 🧪
                                </label>
                            </div>

                            <button type="submit" className="btn btn-blue" style={{ width: '100%', marginTop: '1rem' }}>
                                ADD TO DECK
                            </button>
                        </form>
                    </div>

                    {/* LIST OF MEDS */}
                    <div className="comic-panel list-panel">
                        <h2 className="panel-title">CURRENT ARSENAL</h2>
                        <div className="med-inventory">
                            {medications.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#666' }}>No meds in stock.</p>
                            ) : (
                                medications.map(med => (
                                    <div key={med.id} className="inventory-card">
                                        <div className="inv-icon">{med.type === 'pill' ? '💊' : '🧪'}</div>
                                        <div className="inv-info">
                                            <div className="inv-name">{med.name}</div>
                                            <div className="inv-detail">{med.dosage} @ {med.schedule_time}</div>
                                        </div>
                                        <button className="btn-delete" onClick={() => handleDelete(med.id)}>
                                            🗑️
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
