import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// It pulls the user from the backend session
export const AuthProvider = ({ children }) => {
    // the argument { children } is all the App function (see index.js lines 12-14) 
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await fetch('https://localhost:8443/api/user', {
                credentials: 'include',
            });
            if (res.ok) {
                console.log('auth');
                const data = await res.json();
                console.log(user);
                if (data.user.isAdmin === "yes"){   
                    setAdmin(data.user);
                    setUser(null);
                }
                else{
                    setUser(data.user);
                    setAdmin(null);
                };
            } else {
                console.log('opa');
                setUser(null);
            }
        } catch (err) {
            console.log('error in auth');
            console.error(err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        // With the value={{ user, setUser, loading }} I choose which states and setter the other pages 
        // can use and I specify in the AuthContext which "global" states and setter it will have
        <AuthContext.Provider value={{ user, setUser, loading, admin, setAdmin}}>
            {children}
        </AuthContext.Provider>
    );
};