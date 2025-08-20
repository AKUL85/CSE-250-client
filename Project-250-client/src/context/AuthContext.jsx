import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut 
} from 'firebase/auth';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../../config/firebase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const provider = new GoogleAuthProvider();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signInWithEmailPass = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signInwithGmail = () => {
        setLoading(true);
        return signInWithPopup(auth, provider);
    };

    const signOutUser = async () => {
        setLoading(true);
        await fetch('https://language-exchange-server.onrender.com/logout', {
            method: 'POST',
            credentials: 'include'
        });
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, async (currentuser) => {
            setUser(currentuser);
            setLoading(false);
        });

        return unsubscribed;
    }, []);

    const authInfo = {
        user,
        loading, setLoading,
        signInWithEmailPass,
        signInwithGmail,
        createUser,
        signOutUser
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;