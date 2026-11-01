import React, { useState, useEffect } from 'react';

const Matrix = ({}) => {
    const [message, setMessage] = useState("loading");

    useEffect(() => {
        const createDatabase = async () => {
        try {
            const response = await fetch('https://localhost:8443/api/matrix/createdb', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials (cookies)
            });

            if (response.ok) 
            {
                setMessage("done");
            }
        } catch (error) {
            console.error('Error:', error);
        }
        };

        createDatabase();
    
    }, []);


    return (
        <div>
            {message}
        </div>
    );
};

export default Matrix;