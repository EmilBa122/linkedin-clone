import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// The First/Welcome Page of this website 
const IndexPage = ({ setFormData }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const history = useHistory();
    const { user, setUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('https://localhost:8443/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok)
            {    
                setUser(data.user);
                console.log("ok!");
                // Direct to Home Page on successful login
                if (data.user.isAdmin === "yes"){
                    return history.replace('/admin'); 
                }
                else{
                history.replace('/home'); 
                }
                return null;
            } 
            else 
            {
                setMessage(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    useEffect(() => {
        const fetchEmail = async () => {
            try {
				const response = await fetch('https://localhost:8443/api/user', { 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include credentials (cookies)
                });
            
                if (response.ok) 
                {
                    const data = await response.json();
                    console.log(data);
                    if (data.user.isAdmin === "yes"){
                        return history.replace('/admin'); 
                    }
                    else{
                    history.replace('/home');
                    }
                    return null;
                }
                    
            } catch (error) {
                console.error('Error fetching email:', error);
            }
        };

        fetchEmail();
    }, []);
    
  
    return (
        <div>
            <h1>Welcome to your professional community </h1>
            <div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {message && <div>{message}</div>}
                    <button type="submit">Login</button>
                </form>
            </div>
            New to LinkedIn? <a href="register">Join now</a> 
        </div>
    );
};

export default IndexPage;