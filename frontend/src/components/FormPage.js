import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import "./FormPage.css";
import ReCAPTCHA from 'react-google-recaptcha';
import { AuthContext } from '../context/AuthContext';

// The Page of the website that is for user registration 
const FormPage = () => {
    const [password, setPassword] = useState('');
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [stage, setStage] = useState(1);
    const [message, setMessage] = useState('');
    const [profile_pic, setProfile_pic] = useState('');
    const [phone_number, setPhone_number] = useState('');
	const [file, setFile] = useState(null);
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const { user, setUser } = useContext(AuthContext);

    const history = useHistory();

    const handleCaptchaChange = (value) => {
        // Validate reCAPTCHA response
        if (value) {
          setCaptchaVerified(true);
        } else {
          setCaptchaVerified(false);
        }
    };

    const handleSubmit = async (e) => {
        if (stage === 2)
        {
            setMessage(" ");
            if (first_name !== "" && last_name !== "")
            {
                setMessage(" ");
                setStage(3);
            }
            else
            {
                setMessage("Give First name Last name");
            }
        }
        else if (stage === 1)
        {
            if (email !== "" && password !==  "")
            {
                const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;
                if (regex.test(password)) 
                {
                    setMessage(" ");
                    setStage(2);
                }
                else
                {
                    setMessage("the password must have at least a number of small and upper character and at least "
                                + "one number one symbol");
                }
            } 
            else
            {
                setMessage("Give email and password");
            }
        }
        else if (stage === 4)
        {
            setMessage(" ");
            if (!captchaVerified) 
            {
                setMessage('Please complete the CAPTCHA verification.'); 
            }
            else
            {
                // The FormData() its a ready-made class that represents a form on HTML and match the variables 
                // of the handle state that you defined above with the fields that you do append as you see below
                e.preventDefault();
				const formData = new FormData();
			    formData.append('profile_pic', file);
			    formData.append('password', password);
			    formData.append('email', email);
			    formData.append('first_name', first_name);
			    formData.append('last_name', last_name);
			    formData.append('phone_number', phone_number);
				
				console.log(formData);

                try {
                    const response = await fetch('https://localhost:8443/api/register', { 
                        method: 'POST',
                        credentials: 'include', // Include credentials (cookies)
                        body: formData
                    });
                
                    // Check if the response is JSON
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) 
                    {
                        const data = await response.json();
                        if (response.ok) 
                        {
                            setUser(data.user);
                            console.log("User registered and logged in");
                            // Redirect to /home on successful registration and login
                            window.location.href = '/home';
                        } 
                        else 
                        {
                            setStage(1);
                            console.error(data.error);
                            setMessage(data.error); 
                        }
                    } 
                    else 
                    {
                        setStage(1);
                        setMessage("Unexpected server response");
                        console.error("Unexpected server response");
                    }
                } catch (error) {
                    setStage(1);
                    setMessage("Server error, please try again");
                    console.error('Error:', error);
                }
            }
        }  
        else
        {
            if (phone_number !== "")
            {
                setMessage(" ");
                setStage(4);
            }
            else
            {
                setMessage("Give phone number");
            }
        }  
    };
    

    return (
        <div>
            <h1>register </h1>
           
            {stage === 1 && 
            <div>
                <div className="stage1">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}    
                    />
                </div>
                <div className="stage1">    
                    <label>Password:</label>
                    <input
                        type="password" minLength="6"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>}
            {stage === 2 &&
            <div>
                <div className="stage2"> 
                    <label>First name:</label>
                    <input
                        type="text" 
                        value={first_name}
                        onChange={(e) => setFirst_name(e.target.value)}
                    />
                </div>
                <div className="stage2"> 
                    <label>Last name:</label>
                    <input
                        type="text"
                        value={last_name}
                        onChange={(e) => setLast_name(e.target.value)}
                    />
                </div>
            </div>}
            {stage === 3 &&
            <div>
                <div className="stage3"> 
                    <label>Phone number:</label>
                    <input
                        type="text" 
                        value={phone_number}
                        onChange={(e) => setPhone_number(e.target.value)}
                    />
                </div>
                <div className="stage3">     
                    <label>Profile pic:</label>
                    <input
                        type="file" 
                        value={profile_pic}
                        onChange={(e) => setFile(e.target.files[0])} 
                    />
                </div>
            </div>}
            {stage === 4 &&
            <div className="captcha-container">
                <ReCAPTCHA
                sitekey="6LeScP4pAAAAAFnN4Mx2ERbj7fbMgyuBLYLQEMYi"
                onChange={handleCaptchaChange}
                />
            </div>}
            <div id="error">
                {message}
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default FormPage;
