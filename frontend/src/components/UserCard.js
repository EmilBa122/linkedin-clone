import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./UserCard.module.css";
import profile from "../Images/defaultProfile.png";

const UserCard = (data) => {
    const user=data.user[0];
    const pending_flag = data.user[1];
    const link = `/personal?id=${user._id}&name=${user.name}`;


    const connectHandler = (e) => {
        if (pending_flag === 0){
            const msginfo1 = {
                to: user._id,
                connect: 0,
            }
            fetch('https://localhost:8443/api/connections', {
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
        }
        else if(pending_flag === 2){
            const to = {
                id: user._id,
            }
            //delete
            fetch('https://localhost:8443/api/deleteconnection', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    },
                credentials: 'include', // Include credentials (cookies)
                body: JSON.stringify(to)
              })
                .catch(error => {
                  console.log(error);
                });
        }
        else if(pending_flag === 3){
            const to = {
                id: user._id,
            }
            //delete
            fetch('https://localhost:8443/api/deleteconnection', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    },
                credentials: 'include', // Include credentials (cookies)
                body: JSON.stringify(to)
              })
                .catch(error => {
                  console.log(error);
                });
        }
    };
    const acceptHandler = () => {
        const to = {
            id: user._id,
        }
        console.log('to',to)
        //update
        fetch('https://localhost:8443/api/addconnection', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                },
            credentials: 'include', // Include credentials (cookies)
            body: JSON.stringify(to)
          })
            .catch(error => {
              console.log(error);
            });
    };

    const declineHandler = () => {
        const to = {
            id: user._id,
        }
        console.log('to',to);
        //delete
        fetch('https://localhost:8443/api/deleteconnection', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                },
            credentials: 'include', // Include credentials (cookies)
            body: JSON.stringify(to)
          })
            .catch(error => {
              console.log(error);
            });
    };



    return (
        <div className={`col-sm-6 col-lg-4 ${styles.card}`}>
            {pending_flag === 1 &&
            <>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <a href={link} className={styles.profile}> {/* image click users profile */}
                        <img src={profile} alt={user?.name} />
                    </a>
                </header>
                <div className={styles.body}>
                    <a href={link} className={styles.name}>
                        {user?.name}
                    </a>
                    <span className={styles.title}>work</span>


                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        disableElevation
                        className={styles.card__btn}
                        onClick={acceptHandler}
                        value1={user._id}
                    >
                        Accept
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        disableElevation
                        className={styles.card__btn2}
                        onClick={declineHandler}
                        value1={user._id}
                    >
                        Decline
                    </Button>
                </div>
            </div>
        </>
        }
        {pending_flag === 4 &&
            <>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <a href={link} className={styles.profile}> {/* image click users profile */}
                        <img src={profile} alt={user?.name} />
                    </a>
                </header>
                <div className={styles.body}>
                    <a href="#!" className={styles.name}>
                        {user?.name}
                    </a>
                    <span className={styles.title}>work</span>

    
                </div>
            </div>
        </>
        }
        {(pending_flag === 0 || pending_flag === 2 || pending_flag === 3)&&
            <>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <a href={link}  className={styles.profile}> {/* image click users profile */}
                        <img src={profile} alt={user?.name} />
                    </a>
                </header>
                <div className={styles.body}>
                    <a href="#!" className={styles.name}>
                        {user?.name}
                    </a>
                    <span className={styles.title}>work</span>

                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        disableElevation
                        className={styles.card__btn}
                        onClick={connectHandler}
                        value1={user._id}
                    >
                        {pending_flag === 0 && "connect"}
                        {pending_flag === 2 && "disconnect"}
                        {pending_flag === 3 && "cancel"}
                    </Button>
                </div>
            </div>
        </>
        }
        </div>
    );
}

export default UserCard;
