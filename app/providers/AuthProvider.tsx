import { useRouter, useSegments } from 'expo-router';
import { signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../../src/config/firebaseConfig';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    reloadUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

        if (user && inAuthGroup) {
            // If user is logged in and trying to access login/register, redirect to account
            router.replace('/account');
        } else if (!user && !inAuthGroup && (segments[0] as string) !== 'index' && (segments[0] as string) !== 'splash' && (segments[0] as string) !== 'onboarding-info') {
            // Optional: Protect routes here if needed, or handle in individual screens
            // For now, we allow access to public screens, but maybe redirect from protected ones
        }
    }, [user, loading, segments]);

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            router.replace('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const reloadUser = async () => {
        try {
            await auth.currentUser?.reload();
            if (auth.currentUser) {
                setUser({ ...auth.currentUser });
            }
        } catch (error) {
            console.error('Error reloading user:', error);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, signOut, reloadUser }}>
            {children}
        </AuthContext.Provider>
    );
}
