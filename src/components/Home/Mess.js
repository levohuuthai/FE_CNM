import classes from "./home.module.scss";
import { useState } from "react";
import React, { useEffect } from "react";
import addFriendAPI from "../../api/addFriendAPI";
const ListMess = (props) => {
  const [user, setUser] = useState(null);

  // console.log(props.data);
  useEffect(() => {
    if (props.data.users.length > 2) {
      setUser(props.data);
      const fetchGetUser = async () => {
        try {
          setUser(props.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchGetUser();
    } else {
      const nameMessUserId = props.data.users.find((m) => m !== props.idLogin);
      const fetchGetUser = async () => {
        try {
          const requestGetUser = await addFriendAPI.getUser({
            userID: nameMessUserId,
          });
          setUser(requestGetUser.data.users);
        } catch (error) {
          console.log(error);
        }
      };
      fetchGetUser();
    }
  }, []);

  const isChatHandler = (e) => {
    props.onSendListMess({
      user: user,
      room: props.data,
    });
  };

  //  console.log(props.index);
  return (
    <div
      className={`${classes.mess}`}
      //key={user?._id}
      data-id={props.data._id}
      onClick={isChatHandler}
    >
      <div className={classes.avatar}>
        <img src={user?.avatar} alt="" />
      </div>
      <div className={classes.name}>
        <p>{user?.name}</p>
      </div>
    </div>
  );
};

export default ListMess;
