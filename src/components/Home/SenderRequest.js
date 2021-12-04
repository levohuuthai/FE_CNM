import React, { Fragment, useEffect } from "react";
import classes from "./home.module.scss";
import background from "../../assets/background.png";
import { useState } from "react";
import addFriendAPI from "../../api/addFriendAPI";


const SenderRequest = (props) => {
  const [user, setUser] = useState(null);
  const [isRequestHandler, setIsRequestHandler] = useState(false);

  useEffect(() => {
    const fetchGetUser = async () => {
      try {
        const requestGetUser = await addFriendAPI.getUser({
          userID: props.data.sender,
        });
        setUser(requestGetUser.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetUser();
  }, []);


  const AcceptHandler = (event) => {
    event.preventDefault()
    const fetchAcceptFriend = async () => {
      try {
        const requestAcceptFriend = await addFriendAPI.acceptFriend({
          requestId: props.data._id,
        });
        setIsRequestHandler(true)
      } catch (error) {
        console.log(error);
      }
    };
    fetchAcceptFriend();
  }

  const DeclineHandler = (event) => {
    event.preventDefault()
    const fetchDeclinetFriend = async () => {
      try {
        const requestDeclineFriend = await addFriendAPI.declineFriend({
          requestId: props.data._id,
        });
        setIsRequestHandler(true)
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeclinetFriend();
  }

  return (
    <Fragment>
      {!isRequestHandler && (
        <div className={classes.invite}>
        <div className={classes.info}>
          <div className={classes["avatar-invite"]}>
            <img src={user?.users.avatar} alt="" />
          </div>
          <div className={classes["name-invite"]}>
            <p>{user?.users.name}</p>
          </div>
        </div>
        <div className={classes.btn}>
            <button className={classes.decline} onClick = {DeclineHandler}>Từ chối</button>
            <button className={classes.accept} onClick = {AcceptHandler}>Đồng ý</button>
        </div>
      </div>
      )}
    </Fragment>
      
  
    
  );
};

export default SenderRequest;
