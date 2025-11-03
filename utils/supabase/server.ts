import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async (
    cookieStoreOrPromise: ReturnType<typeof cookies> | Promise<ReturnType<typeof cookies>>
) => {
    const cookieStore = await cookieStoreOrPromise;

    return createServerClient(
        supabaseUrl!,
        supabaseKey!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
                    try {
                        const storeWithSet = cookieStore as unknown as {
                            set?: (name: string, value: string, options?: CookieOptions) => void;
                        };
                        const setter = storeWithSet.set;
                        if (typeof setter === "function") {
                            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                        }
                    } catch {}
                },
            },
        },
    );
};
