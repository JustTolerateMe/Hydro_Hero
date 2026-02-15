import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { Profile } from "@/types";
import type { User } from "@supabase/supabase-js";

interface UseAuthOptions {
    requireAuth?: boolean;
    skipOnboardingCheck?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
    const { requireAuth = true, skipOnboardingCheck = false } = options;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (requireAuth && !user) {
                router.push("/auth");
                return;
            }

            setUser(user);

            if (user) {
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                // Onboarding Check (skip for the onboarding page itself)
                if (requireAuth && !skipOnboardingCheck && profileData && !profileData.onboarding_complete) {
                    router.push("/onboarding");
                    return;
                }

                setProfile(profileData);
            }

            setLoading(false);
        };

        checkUser();
    }, [router, requireAuth, skipOnboardingCheck]);

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push("/auth");
    };

    return { user, profile, loading, setProfile, signOut };
}
