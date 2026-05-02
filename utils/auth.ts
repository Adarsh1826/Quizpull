import { supabase } from "./client";

export async function getUser() {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    console.log("Error in fetching active user");
  }
}

export const handleLogin = async (email: string, password: string, router: any) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.push("/dashboard");
  } catch {
    console.log("Login error");
  }
};

export const handleSignup = async (email: string, password: string, router: any) => {
  try {
    const { error } = await supabase.auth.signUp({ email, password });
    if (!error) router.push("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

export const handleLogout = async (router: any) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/");
  } catch (error) {
    console.log(error);
  }
};

// Google OAuth — uses PKCE flow via server-side callback route
// redirectTo points to /auth/callback which exchanges the code server-side
// and sets the session cookie, then redirects to /dashboard
export const handleAuthWithGoogle = async (_router: any) => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("Google OAuth error:", error.message);
    // Do NOT call router.push here — browser is navigating to Google
  } catch (error) {
    console.log("Unexpected OAuth error:", error);
  }
};