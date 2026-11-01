import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import User from "./UserCard";
import styles from "./ConnectionPage.module.css";
import { disconnect } from "mongoose";


const Connections = () => {
    const [users, setUsers] = useState([]);
    const [pending, setPending] = useState([]);
    const [pending2, setPending2] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [disconnectList, setDisconnectList] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:8443/api/getUsers',{ 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include credentials (cookies)
                })
                .then((res) => res.json())
                .then((data) => {
                    //data.forEach(obj,index => obj._id=index);
                    setUsers(data[0]);
                    setCurrentUser(data[1]);
                    console.log(users);
                    users.map((user) => {
                        setUser(user);
                    });
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
  
        fetchData();
    }, [users]);

    useEffect(() => {
        const fetchConnections = async () => {
   
                const response = await fetch('https://localhost:8443/api/getconnections', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        },
                    credentials: 'include', // Include credentials (cookies)
                    body: JSON.stringify(users)
                })
                .then((res) => res.json())
                .then((data) => {
                    // if changed
                    setUsersList(data[0]);
                    setPending(data[1]);
                    setDisconnectList(data[2]);
                    setPending2(data[3]);
                })
                .catch(error => {
                   console.log(error);
                }); 
        };
        fetchConnections();
    },[users]);

    /*useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await fetch(`https://localhost:8443/api/getconnections}`,{ 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include credentials (cookies)
                })
                .then((res) => res.json())
                .then((data) => {
                    //data.forEach(obj,index => obj._id=index);
                    console.log('a',data);
                    //console.log('u',user._id);
                    var countl = 0;
                    usersList.map((ul) => {
                        if (ul === data[0]){
                            countl = 1;
                        }
                        else{
                            
                        }
                    });
                    if (usersList && !usersList.includes(data[0])){
                    
                        usersList.push(data[0]);
                        setUsersList(usersList);
                    }
                    if (pending && !pending.includes(data[1])){
                        //console.log("p");
                        pending.push(data[1]);
                        setPending(pending);
                    }
                    if (pending2 && !pending2.includes(data[2])){
                        pending2.push(data[2]);
                        setPending2(pending2);
                    }
                    //console.log('u',usersList);
                    //console.log('c',connection)
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
  
        fetchConnections();
    }, [users]);*/

    const [searchList,setSearch] = useState([]);
    const [searchList2,setSearch2] = useState([]);
    const [searchList3,setSearch3] = useState([]);
    const handleChange = (value) => {
        setInput(value);
        const results = usersList?.filter((user) =>{
            return (
                value &&
                user &&
                user.name.toLowerCase().includes(value.toLowerCase())
            );
        });
        const results2 = disconnectList?.filter((user) =>{
            return (
                value &&
                user &&
                user.name.toLowerCase().includes(value.toLowerCase())
            );
        });
        const results3 = pending?.filter((user) =>{
            return (
                value &&
                user &&
                user.name.toLowerCase().includes(value.toLowerCase())
            );
        });
        setSearch(results);
        setSearch2(results2);
        setSearch3(results3);
    };

    return (
        <div className="d-flex justify-content-center mt-2 col-md-12">
            
            <div class={styles.search}> 

                <div class={styles.search}>
                <i class="fa fa-search"></i>
                <input type="text" class="form-control" placeholder="search by name" value={input} onChange={(e) => handleChange(e.target.value)}/>
                <button class="btn btn-primary">Search</button>
                </div>

            </div>

            {input && 
                <div className={styles.content}>
                    <div className={styles.box2} style={{overflowY: "hidden", overflowX: "auto"}}>
                    
                   <div className={`row ${styles.users__list}`}></div>
                         {searchList.length > 0 && searchList?.map((user) => (
                             <User user={[user,0]} key={user._id + 'a'} />
                         ))}
                         {searchList2.length > 0 && searchList2?.map((user) => (
                             <User user={[user,2]} key={user._id + 'b'} />
                         ))}
                         {searchList3.length > 0 && searchList3?.map((user) => (
                             <User user={[user,3]} key={user._id + 'c'} />
                         ))}
                       </div>    
                    

                </div>            

            
            }
            {!input && 
            <div className={styles.content}>
                <div className={`${styles.box}`}>
                    <div className={styles.box__header}>
                        <span className={styles.box__text}>
                            pending invitations
                        </span>    
                        
                        <div className={`row ${styles.users__list}`}>
                        {pending.length > 0 && pending?.map((user) => (
                            <User user={[user,1]} key={user?._id+'a'} />
                        ))}
                    </div>
                    </div>
                </div>

                <div className={styles.box}>
                    <div className={styles.box__header}>
                        <span className={styles.box__text}>
                            People you may know
                        </span>
                       
                    </div>

                    <div className={`row ${styles.users__list}`}>
                        {usersList.length > 0 && usersList?.map((user) => (
                            <User user={[user,0]} key={user?._id} />
                        ))}
                        {disconnectList.length > 0 && disconnectList?.map((user) => (
                            <User user={[user,2]} key={user?._id} />
                        ))}
                        {pending2.length > 0 && pending2?.map((user) => (
                            <User user={[user,3]} key={user?._id} />
                        ))}
                    </div>
                </div>
            </div>
        }
        </div>
    );
}

export default Connections;