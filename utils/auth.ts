
import { supabase } from "./client";

// This function to get active user detail

export async function getUser() {

    try {
        const { data, error } = await supabase.auth.getUser();
        //console.log("Fetched Sucess",data.user);
        return data.user
    } catch (error) {
        console.log("Error in fetching active user");

    }

}

// This function to for login
export const handleLogin = async (email: string, password: string, router: any) => {

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (!error) {
            router.push("/dashboard")
        }
    } catch (error) {
        console.log("Error");

    }
}
// This function for signup
export const handleSignup = async (email: string, password: string, router: any) => {

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        if (!error) {
            router.push("/dashboard")
        }
    } catch (error) {
        console.log(error);

    }
}

// This function is for logout

export const handleLogout = async (router: any) => {

    try {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            router.push("/")
        }
    } catch (error) {
        console.log(error);

    }

}