'use server';

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const FIVE_DAYS_IN_MS = 60 * 60 * 24 * 5; // 5 days

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists) {
            return {
                success: false,
                message: "User already exists. Please sign in instead."
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: "Account created successfully. Please sign in.", 
        }
    }
    catch (e: any) {
        console.error("Error creating a user", e);

        if(e.code=== "auth/email-already-exists") {
            return {
                success: false,
                message: "Email already exists"
            }
        }

        return {
            success: false,
            message: "Failed to create an account"
        }
    }
}

export async function signIn (params: SignInParams) {
    const { email, idToken } = params;
     
    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success: false,
                message: "User does not exist. Create an account instead."
            }
        }
        await setSessionCookie(idToken);

    } catch (e: any) {
        console.error("Error signing in", e);

        return {
            success: false,
            message: "Failed to log into an account"
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: FIVE_DAYS_IN_MS * 1000 // 5 days
    })

    cookieStore.set("session", sessionCookie, {
        maxAge: FIVE_DAYS_IN_MS,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;
    
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.
            collection('users')
            .doc(decodedClaims.uid)
            .get();
        
        if(!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (e: any) {
        console.error("Error getting current user", e);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}
