"use client";

import { useRouter, usePathname } from "next/navigation";
import { Profile } from "@/types";
import { getLevelFromXP } from "@/utils/helpers";
import type { User } from "@supabase/supabase-js";

type SidebarProps = {
    user: User | null;
    profile: Profile | null;
};

export default function Sidebar({ user, profile }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <aside className="dash-sidebar">
                <div className="dash-sidebar-logo">
                    HYDRO<br />HERO
                </div>

                <nav className="dash-sidebar-nav">
                    <div
                        className={`dash-nav-item ${pathname === '/dashboard' ? 'active' : ''}`}
                        onClick={() => router.push('/dashboard')}
                    >
                        <span className="dash-nav-icon">&#x2B1A;</span>
                        <span className="dash-nav-label">BASE CAMP</span>
                    </div>
                    <div
                        className={`dash-nav-item ${pathname === '/dashboard/meds' ? 'active' : ''}`}
                        onClick={() => router.push('/dashboard/meds')}
                    >
                        <span className="dash-nav-icon">&#x1F48A;</span>
                        <span className="dash-nav-label">MEDS LOG</span>
                    </div>
                    <div
                        className={`dash-nav-item ${pathname === '/dashboard/profile' ? 'active' : ''}`}
                        onClick={() => router.push('/dashboard/profile')}
                    >
                        <span className="dash-nav-icon">&#x1F9B8;</span>
                        <span className="dash-nav-label">HERO ID</span>
                    </div>
                    <div
                        className={`dash-nav-item ${pathname === '/dashboard/intel' ? 'active' : ''}`}
                        onClick={() => router.push('/dashboard/intel')}
                    >
                        <span className="dash-nav-icon">&#x1F4CB;</span>
                        <span className="dash-nav-label">INTEL</span>
                    </div>
                    <div
                        className={`dash-nav-item ${pathname === '/dashboard/settings' ? 'active' : ''}`}
                        onClick={() => router.push('/dashboard/settings')}
                    >
                        <span className="dash-nav-icon">&#x2699;</span>
                        <span className="dash-nav-label">SETTINGS</span>
                    </div>
                </nav>

                <div className="dash-sidebar-join">
                    <p className="join-label">JOIN THE MISSION:</p>
                    <div className="dash-sidebar-socials">
                        <a href="https://www.facebook.com/profile.php?id=61588141253154" target="_blank" rel="noopener noreferrer" className="social-icon-pill dash-sidebar-social-icon fb" title="Facebook">
                            f
                        </a>
                        <a href="https://www.instagram.com/stopkidneyingaround?igsh=MTV3YzJzMHkwdWUyYQ==" target="_blank" rel="noopener noreferrer" className="social-icon-pill dash-sidebar-social-icon ig" title="Instagram">
                            ig
                        </a>
                        <a href="https://www.tiktok.com/@stopkidneyingph?lang=en&is_from_webapp=1&sender_device=mobile&sender_web_id=7610809906288182791" target="_blank" rel="noopener noreferrer" className="social-icon-pill dash-sidebar-social-icon tk" title="TikTok">
                            tk
                        </a>
                    </div>
                </div>

                <div
                    className="dash-sidebar-user"
                    onClick={() => router.push('/dashboard/profile')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="dash-user-avatar">
                        {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "H"}
                    </div>
                    <div className="dash-user-info">
                        {profile?.username || "Hero"}
                        <span>Lvl {getLevelFromXP(profile?.xp ?? null)} Hydrator</span>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation - visible only on small screens */}
            <nav className="mobile-bottom-nav">
                <div
                    className={`mobile-nav-item ${pathname === '/dashboard' ? 'active' : ''}`}
                    onClick={() => router.push('/dashboard')}
                >
                    <span className="mobile-nav-icon">&#x2B1A;</span>
                    <span className="mobile-nav-label">HOME</span>
                </div>
                <div
                    className={`mobile-nav-item ${pathname === '/dashboard/meds' ? 'active' : ''}`}
                    onClick={() => router.push('/dashboard/meds')}
                >
                    <span className="mobile-nav-icon">&#x1F48A;</span>
                    <span className="mobile-nav-label">MEDS</span>
                </div>
                <div
                    className={`mobile-nav-item ${pathname === '/dashboard/profile' ? 'active' : ''}`}
                    onClick={() => router.push('/dashboard/profile')}
                >
                    <span className="mobile-nav-icon">&#x1F9B8;</span>
                    <span className="mobile-nav-label">HERO</span>
                </div>
                <div
                    className={`mobile-nav-item ${pathname === '/dashboard/intel' ? 'active' : ''}`}
                    onClick={() => router.push('/dashboard/intel')}
                >
                    <span className="mobile-nav-icon">&#x1F4CB;</span>
                    <span className="mobile-nav-label">INTEL</span>
                </div>
                <div
                    className={`mobile-nav-item ${pathname === '/dashboard/settings' ? 'active' : ''}`}
                    onClick={() => router.push('/dashboard/settings')}
                >
                    <span className="mobile-nav-icon">&#x2699;</span>
                    <span className="mobile-nav-label">SET</span>
                </div>
            </nav>
        </>
    );
}
