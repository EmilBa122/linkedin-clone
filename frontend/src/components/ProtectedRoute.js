import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { user, loading, admin } = useContext(AuthContext);

    const history = useHistory();
    const [count,setCount] = useState(0);
    console.log('user',user);
    console.log('admin',admin);
    useEffect(() => {
        console.log('u',loading);
        if (!loading && !user) {
            console.log('u2',admin);
            if (!admin){
                // Redirect to login if user is not authenticated
                history.push('/');
            }
            else{
                console.log('y');
                history.push('/admin');
            }
            
        }
        console.log('u2',admin);
        if (!loading && admin){
            history.push('/admin')
        }
        if (!loading && user !== null && user.isAdmin === "yes"){
            return history.push('/admin');
        }
    }, [loading, user, history]);

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <Route
            {...rest}
            render={(props) =>{
                if (user !== null){
                    return <Component {...props} />
                }
                else{
                    if (admin !== null){
                        return <Component {...props} />
                    }
                    else{
                        return null;
                    };
                };
            }
                //user ? <Component {...props} /> : null
            }
        />
    );
};

export default ProtectedRoute;