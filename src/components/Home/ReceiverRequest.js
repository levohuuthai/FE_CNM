import React, { Fragment, useEffect } from "react";
import classes from "./home.module.scss";
import background from "../../assets/background.png";
import { useState } from "react";
import addFriendAPI from "../../api/addFriendAPI";


const ReceiverRequest = (props) => {
  const [user, setUser] = useState(null);
  const [isFormHandlerRequest, setIsFormHandlerRequest] = useState(false)


  useEffect(() => {
    const fetchGetUser = async () => {
      try {
        const requestGetUser = await addFriendAPI.getUser({
          userID: props.data.receiver,
        });
        setUser(requestGetUser.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetUser();
  }, []);

    // console.log(props.data.receiver);
    // console.log(user);

    const revokeHandler = (event) => {
        event.preventDefault()
        const fetchCancelRequest = async () => {
            try {
                const ReceiverRequest = await addFriendAPI.cancelSendedFriend({
                    requestId: props.data._id,
                });
                setIsFormHandlerRequest(true)
            } catch (error) {
                console.log(error);
            }
        };
        fetchCancelRequest();
    }


  return (
    <Fragment>
        {!isFormHandlerRequest && (
            <div className={classes.sendInvite}>

            <div className={classes.info}>
              <div className={classes["avatar-invite"]}>
                <img src={user?.users.avatar} alt="" />
              </div>
              <div className={classes["name-invite"]}>
                <p>{user?.users.name}</p>
              </div>
            </div>

            <div className={classes.btn}>
                <button className={classes.decline} onClick={revokeHandler}>Hủy Lời Mời Kết Bạn</button>
            </div>
        </div>
        )}
        
    </Fragment>
      
  
    
  );
};

export default ReceiverRequest;
