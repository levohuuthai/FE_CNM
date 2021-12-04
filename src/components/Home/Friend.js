import React, { Fragment, useState, useEffect } from "react";
import classes from "./home.module.scss";
import addFriendAPI from "../../api/addFriendAPI";
import FormDeleteFriend from "./form-deleteFriend/FormDeleteFriend";

const Friend = (props) => {
  const [user, setUser] = useState(null);
  const [isFormDeleteFriend, setIsFormDeleteFriend] = useState(false);
  useEffect(() => {
    const friendId = props.data?.find((m) => m !== props.idLogin);
    const fetchGetUser = async () => {
      try {
        const requestGetUser = await addFriendAPI.getUser({
          userID: friendId || props.data1._id,
        });
        setUser(requestGetUser.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetUser();
  }, []);

  const deleteFriendHandler = () => {
    setIsFormDeleteFriend(true);
  };
  const closeFormDeleteFriend = () => {
    setIsFormDeleteFriend(false);
  };

  return (
    <Fragment>
      <div className={classes.friend}>
        <div className={classes.groupInfoFriend}>
          <div className={classes["avatar-friend"]}>
            <img src={user?.users.avatar} alt="" />
          </div>
          <div className={classes["name-friend"]}>
            <p>{user?.users.name}</p>
          </div>
        </div>
        <div className={classes.delete_Friend} onClick={deleteFriendHandler}>
          <i className="fas fa-user-minus"></i>
        </div>
      </div>

      {
        <FormDeleteFriend
          isFormDeleteFriend={isFormDeleteFriend}
          onFormFalse={closeFormDeleteFriend}
          user={user}
        ></FormDeleteFriend>
      }
    </Fragment>
  );
};

export default Friend;
