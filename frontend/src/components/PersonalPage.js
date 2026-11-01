import { React, useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import profile from "../Images/defaultProfile.png";
import { AuthContext } from '../context/AuthContext';


const PersonalPage = () => {
    const [data, setData] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [user_state,setUser_state] = useState("");
    const [con,setCon] = useState(0);

    const queryParameters = new URLSearchParams(window.location.search)
    const id = queryParameters.get("id")
    const name = queryParameters.get("name")
    console.log(id);
    const { user } = useContext(AuthContext);
    var flag = false;
    if (id !== user._id )
    {
        flag = true;
    }

    const link = `/chat?id=${id}&name=${name}`;


    useEffect(() => {
        const fetchData = async () => {
           
            
            try {
                const response = await fetch(`https://localhost:8443/api/getUsersData?id=${id}`,{ 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include credentials (cookies)
                })
                .then((res) => res.json())
                .then((data) => {
                    //data.forEach(obj,index => obj._id=index);
                    setUser_state(data[0][0]);
                    setCon(data[1]);
                    console.log('a',data);
                    //console.log('a',user);
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
  
        fetchData();
    }, [id]);

    return (
        <div className="card" style={{width: "400px", margin: "auto", height: "300px"}}>
            
        <img className="card-img-top" src={`https://localhost:8443/pics/${user_state.profile_pic}`} alt="Card image"/>
        <div className="card-body" style={{display:"inline", top: "50%", left: "50%", margin: "-100px 0 0 0"}}>
          <h4 className="card-title">{user_state.name}</h4>
          {con === 1 &&
          <p className="card-text">Some example text.</p>
          }
          {id !== null && flag &&
          <a href={link} className="btn btn-primary">Chat</a>
          }
          </div>
      

      </div>
    );
}

export default PersonalPage;
