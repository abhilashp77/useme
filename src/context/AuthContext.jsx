import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('useme_token');
        if (token) {
            api.getMe()
                .then(userData => setUser(userData))
                .catch(() => localStorage.removeItem('useme_token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const _syncWithBackend = async (firebaseUser, role) => {
        const data = await api.firebaseAuth({
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            uid: firebaseUser.uid,
            role
        });
        localStorage.setItem('useme_token', data.token);
        setUser(data.user);
        return data.user;
    };

    const login = async (email, password) => {
        try {
            // Try Firebase first
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return await _syncWithBackend(userCredential.user);
        } catch (err) {
            // Fallback to local mock API for the seeded dummy accounts
            const data = await api.login({ email, password });
            localStorage.setItem('useme_token', data.token);
            setUser(data.user);
            return data.user;
        }
    };

    const register = async (formData) => {
        // Create in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

        // Sync full info plus Firebase UID to local backend
        const data = await api.firebaseAuth({
            ...formData,
            uid: userCredential.user.uid
        });
        localStorage.setItem('useme_token', data.token);
        setUser(data.user);
        return data.user;
    };

    const loginWithGoogle = async (role = null) => {
        const result = await signInWithPopup(auth, googleProvider);

        try {
            // First try to login, let backend decide if it needs a role
            return await _syncWithBackend(result.user, role);
        } catch (err) {
            // If backend throws our special 409 error, pass it back to UI
            if (err.message === 'needs_role') {
                return { needs_role: true, firebaseUser: result.user };
            }
            throw err;
        }
    };

    const logout = async () => {
        await firebaseSignOut(auth).catch(() => { });
        localStorage.removeItem('useme_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
