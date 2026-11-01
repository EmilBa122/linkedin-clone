import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
  MDBCardHeader,
} from "mdb-react-ui-kit";  

import styles from "./chat.module.css";
import { set } from "mongoose";

var text = React.createRef(); 

const Chat = (user) => {
    
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");
    const [currentUser,setCurrentUser] = useState("");
    const [user2,setUser2] = useState("");
    const [to,setTo] = useState("");
    const [to2,setTo2] = useState([]);
    const [data3,setData3] = useState({});
    const [data2, setData2] = useState([]);
    const [count,setCount] = useState(0);
    const [flag,setFlag] = useState(0);
    
    

    const queryParameters = new URLSearchParams(window.location.search)
    const id = queryParameters.get("id")
    const [m,setM] = useState(0);
    const [name,setName] = useState('');
    const name_ = queryParameters.get("name")
    console.log('name',name_);


    const chatOpen = () => {
      setName(name_);
      setUser2({_id: id,name: name_});
      setM(1);
    };

    const f = (data) => (
      data.map((user) => {
          //setTo(user);
          setTo(user);
      })
    );

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
                    console.log('a',data);
                    setData(data[0]);
                    setCurrentUser(data[1]);
                    if (to === ""){
                      setTo(data[0][0])
                      setCount(1);
                    }
                    console.log('to',to);
                    if (name_ && flag === 0){
                      chatOpen();
                      setFlag(1);
                    }
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
  
        fetchData();
    }, [data]);


    useEffect(() => {
      const fetchL = async () => {
          try {
              const response = await fetch(`https://localhost:8443/api/getM?from=${currentUser._id}&to=${to._id}`,{ 
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  credentials: 'include', // Include credentials (cookies)
              })
              .then((res) => res.json())
              .then((dataq) => {
                  if (Object.keys(dataq).length > 0){
               
                    var key = Object.keys(dataq)[0];
                    console.log('dataq',dataq);
                    console.log('data3',data3[key]);
                    if (data3[key] != dataq[key]){
                      data3[key] = dataq[key];
                      setData3(data3);
                      //f(data);
                    }
                  }
                  console.log('key',count)
                  if (count > data.length-1){
                    setCount(0);
                    setTo(data[0]);
                  }
                  else{
                    setTo(data[count]);
                    setCount(count+1);
                  }
                    
              });

          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchL();
  }, [to]);
  //data
    
    const fetchSearch = async (value) => {
        try {
            const response = fetch('https://localhost:8443/api/getUsers',{ 
                headers: {
                    'Content-Type': ' application/json',
                },
                credentials: 'include', // Include credentials (cookies)
            })
            .then((res) => res.json())
            .then((json) => {
                const results = json[0].filter((user) =>{
                    return (
                        value &&
                        user &&
                        user.name.toLowerCase().includes(value.toLowerCase())
                    );
                });
                setSearch(results);
            });

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [messagesArray,setmessagesArray] = useState({});
    useEffect(() => {
        const fetchData2 = async () => {
            try {
                const fetchMessages = await fetch(`https://localhost:8443/api/getmessages?from=${currentUser._id}&to=${user2._id}`,{ 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include credentials (cookies)
                })
                .then((res) => res.json())
                .then((dataq) => {
                    //console.log(data)
                    if (dataq.length != data2.length){
                      f(data);
                    }
                    else{
                      if (dataq.length > 0 && dataq[0].to_ != data2[0].to_){
                          f(data);
                      }
                    }
                    setData2(dataq);

                    //var s = new Date(Date.now()).toLocaleString()
                    //console.log('a',data);
                });
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData2();
    }, [data2]);


    const handleChange = (value) => {
        setInput(value);
        fetchSearch(value);
        console.log(search);
    };

    const [inputValue, setInputValue] = useState('');
    const handlemsgchange = (value) => {
        setInputValue(value);
        console.log(value);
    };


    const chathandler = (e) => {
        const value1 = e.currentTarget.getAttribute("value_1");
        const id = e.currentTarget.getAttribute("id");
 
        setName(value1);
        setUser2({_id: id,name: value1});
        //console.log(currentUser._id);
        console.log(user2);
        setmessagesArray({from: currentUser._id,to: user2._id});
        //console.log(messagesArray)
        setM(1);
    }

    const msghandler = (e) => {
        e.preventDefault();
        const msginfo1 = {
            from: currentUser._id,
            to: user2._id,
            message: inputValue,
            sender: currentUser._id,
        }
        fetch('https://localhost:8443/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            credentials: 'include', // Include credentials (cookies)
            body: JSON.stringify(msginfo1)
          })
            .catch(error => {
              console.log(error);
            }); 

        setInputValue('')
    }


  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee", width: '70%'}}>
    <div class="align=left" style={{position: "sticky", top: "200px"}}>
      <div class="row height d-flex justify-content-start align-items-center">

        <div class="col-md-4"> 

            <div class="search d-flex">
            <i class="fa fa-search"></i>
            <input type="text" class="form-control" placeholder="search by name" value={input} onChange={(e) => handleChange(e.target.value)}/>
            <button class="btn btn-primary">Search</button>
            </div>
            
        </div>
        
      </div>
    </div>
      <MDBRow>
        <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
          <h5 className="font-weight-bold mb-3 text-start text-lg-start">
            Members
          </h5>
          <MDBCard style={{position: "sticky", top: "240px"}}> 
            <MDBCardBody>
              <MDBTypography listUnStyled className="mb-0">
              {search && search.map((user, index)  => 
                <li
                  className="p-2 border-bottom" key={index}
                  style={{ backgroundColor: "#eee" }}
                   onClick={chathandler} value_1={user.name} id={user._id}
                >
                  <a href="#!" className="d-flex justify-content-between text-decoration-none">
                    <div className="d-flex flex-row">
                      <img
                          src={`https://localhost:8443/pics/${user.profile_pic}`}
                          alt="avatar"
                          className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                          width="60"
                        />
                      <div className="pt-1">
                        <p className="fw-bold mb-0">{user.name}</p>
                        <p className="small text-muted">
                            {data3[user._id]}
                        </p>
                      </div>
                    </div>
                    <div className="pt-1">
                      <p className="small text-muted mb-1">Just now</p>
                    </div>
                  </a>
                </li>
                )}
                {!search.length && !input && data.map((user,index) =>
                <>
                 {/*{f(user)}*/}
                 
                <li className="p-2 border-bottom" key={index} onClick={chathandler} value_1={user.name} id={user._id}>
                  <a href="#!" className="d-flex justify-content-between text-decoration-none">
                    <div className="d-flex flex-row">
                    <img                    
                        src={user.profile_pic === '' ? ("https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-1.webp" ) 
                            : 
                            // ("https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-2.webp")}
                            (`https://localhost:8443/pics/${user.profile_pic}`)}
                            alt="Profile"
                            className="rounded-circle"
                            width="50" // Adjust size as needed
                            height="50" // Adjust size as needed
                      />
                      
                      <div className="pt-1">
                        <p className="fw-bold mb-0">{user.name}</p>
                        <p className="small text-muted">
                          {data3[user._id]}
                        </p>
                      </div>
                    </div>
                    <div className="pt-1">
                      <p className="small text-muted mb-1">5 mins ago</p>
                    </div>
                  </a>
                </li>
                </>
                )}
  
              </MDBTypography>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="6" lg="7" xl="8" style={{zIndex: "1"}}>
          <MDBTypography listUnStyled>
            {name &&
                <MDBCard>
                    <MDBCardHeader className="d-flex justify-content-between p-2" >
                    <p className="fw-bold mb-0" >Chat with user: {name}</p>
                    </MDBCardHeader>
                </MDBCard>
            }
            {data2.length > 0 && data2.map((user,index) =>
            <>
            <li className="d-inline mb-4">
                
            <img
                src={user.fromSelf ? (`https://localhost:8443/pics/${currentUser.profile_pic}`)
                          : (`https://localhost:8443/pics/${user2.profile_pic}`)}
              
                alt="Profile"
                className={user.fromSelf ? ("rounded-circle d-flex float-start me-3 shadow-1-strong")//"rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                          : ("rounded-circle d-flex float-end ms-3 shadow-1-strong")}
                width="50"
                height="50" 
              />
              <MDBCard>
                <MDBCardHeader className="d-flex justify-content-between p-3">
                  <p className="fw-bold mb-0">{user.fromSelf ? (currentUser.name):(user2.name)}</p>
                  <p className="text-muted small mb-0">
                    <MDBIcon far icon="clock" /> {user.time}
                  </p>
                </MDBCardHeader>
                <MDBCardBody>
                  <p className="d-flex mb-0">
                        {user.message}
                  </p>
                </MDBCardBody>
              </MDBCard>
            </li>

            </>
            )}

           { (m === 1 || m.length > 0) &&
                <>
                <li className="bg-white mb-4">
                <MDBTextArea label="Message" id="textAreaExample" name="textAreaExample"
                value={inputValue} onChange={(e) => handlemsgchange(e.target.value)}/>
                </li>
                <MDBBtn color="info" rounded className="float-end"  onClick={msghandler}>
                Send
                </MDBBtn>
                </>
            }     
          </MDBTypography>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Chat;