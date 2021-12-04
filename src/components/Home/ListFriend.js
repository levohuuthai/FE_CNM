import React, { Fragment, useEffect } from "react";
import classes from "./home.module.scss";
import { useState } from "react";
import FormAddFriend from "./form-addFriend/FormAddFriend";
import FormAddGroup from "./form-addGroup/FormAddGroup";
import { useSelector } from "react-redux";
import roomAPI from "../../api/roomAPI";
import Friend from "./Friend";
import userAPI from "../../api/userAPI";

const ListFriend = (props) => {
  const [isFormAddFriend, setIsFormAddFriend] = useState(false);
  const [isFormAddGroup, setIsFormAddGroup] = useState(false);
  const [arrayFriend, setArrayFriend] = useState([]);
  const [arrayFriend2, setArrayFriend2] = useState([]);
  const loggedInUser = useSelector((state) => state.user.current);
  const idLogin = loggedInUser._id;
  const username = loggedInUser.name;

  const [isListSenderRequest, setIsListSenderRequest] = useState({
    isListSenderRequest: true,
  });
  const [isBtnDanhSachKetBan, setIsBtnDanhSachKetBan] = useState(true);
  const [isBtnDanhSachNhom, setIsBtnDanhSachNhom] = useState(false);

  // console.log(loggedInUser);

  useEffect(() => {
    const fetchGetRoomFriend = async () => {
      try {
        const requestGetRoomByFriend = await roomAPI.getRoomFriend({});
        setArrayFriend(requestGetRoomByFriend.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetRoomFriend();
  }, []);

  useEffect(() => {
    props.onSendSocketToListFriend.current.on("delete-friend", async (data) => {
      try {
        const requestGetRoomByFriend = await roomAPI.getRoomFriend({});
        setArrayFriend(requestGetRoomByFriend.data);
      } catch (error) {
        console.log(error);
      }
    });
  }, []);
  useEffect(() => {
    props.onSendSocketToListFriend.current.on(
      "delete-friend-by-me",
      async (data) => {
        try {
          const requestGetRoomByFriend = await roomAPI.getRoomFriend({});
          setArrayFriend(requestGetRoomByFriend.data);
        } catch (error) {
          console.log(error);
        }
      }
    );
  }, []);

  useEffect(() => {
    props.onSendSocketToListFriend.current.on(
      "friend-request-accept-status",
      async (data) => {
        try {
          const requestGetRoomByFriend = await roomAPI.getRoomFriend({});
          setArrayFriend(requestGetRoomByFriend.data);
        } catch (error) {
          console.log(error);
        }
      }
    );
  }, []);

  useEffect(() => {
    props.onSendSocketToListFriend.current.on("accept-by-me", async (data) => {
      try {
        const requestGetRoomByFriend = await roomAPI.getRoomFriend({});
        setArrayFriend(requestGetRoomByFriend.data);
        console.log("List Friend: " + data.room._id);
        props.onSendSocketToListFriend.current.emit(
          "join-room-after-accept-by-me",
          data
        );
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  //truyền true xuống cho formAddFriend
  const openFormAddFriendHandler = () => {
    setIsFormAddFriend(true);
  };

  const openFormAddGroupHandler = () => {
    setIsFormAddGroup(true);
  };

  //nhận false từ formAddFriend
  const FalseFromFormAddFriend = (False) => {
    setIsFormAddFriend(False);
  };

  const FalseFromFormAddGroup = (False) => {
    setIsFormAddGroup(False);
  };

  const btnDanhSachKetBanHandler = () => {
    setIsListSenderRequest((pre) => {
      return { ...pre, isListSenderRequest: true };
    });
    setIsBtnDanhSachKetBan(true);
    setIsBtnDanhSachNhom(false);
  };

  const btnDanhSachGroupHandler = () => {
    setIsListSenderRequest((pre) => {
      return { ...pre, isListSenderRequest: false };
    });
    setIsBtnDanhSachKetBan(false);
    setIsBtnDanhSachNhom(true);
  };
  useEffect(() => {
    props.isListSenderRequest(isListSenderRequest.isListSenderRequest);
  }, [isListSenderRequest.isListSenderRequest]);

  const findFriendByNameHandler = (event) => {
    event.preventDefault();
    if (event.target.value == "") {
      const fetchGetRoomFriend = async () => {
        try {
          const requestGetRoomByFriend = await roomAPI.getRoomFriend({});
          setArrayFriend(requestGetRoomByFriend.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchGetRoomFriend();
    } else {
      const fetchFriendByName = async () => {
        try {
          const userByName = await userAPI.GetFriendByName({
            name: event.target.value,
          });
          if (userByName.status === 200) {
            setArrayFriend(userByName.data.users);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchFriendByName();
    }
  };

  return (
    <Fragment>
      <div className={classes["center-phonebook"]}>
        <div className={classes.search}>
          <div className={classes["input-group"]}>
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm Kiếm"
              onChange={findFriendByNameHandler}
            />
          </div>
          <div className={classes["icon-add"]}>
            <i
              className="fas fa-user-plus"
              onClick={openFormAddFriendHandler}
            ></i>
            <i className="fas fa-users" onClick={openFormAddGroupHandler}></i>
          </div>
        </div>
        <div className={classes.add}>
          <h5>Chào mừng, {username}</h5>
          <div className={classes["add-group"]}>
            <div
              className={classes["add-friend"]}
              onClick={openFormAddFriendHandler}
            >
              <i className="fas fa-plus"></i>
              <p>Thêm bạn bè</p>
            </div>
            <div
              className={classes["add-chat"]}
              onClick={openFormAddGroupHandler}
            >
              <i className="fas fa-user-friends"></i>
              <p>Tạo nhóm</p>
            </div>
          </div>
        </div>
        <div className={classes.group}>
          <div
            className={`${classes.groupAddFriend} ${
              isBtnDanhSachKetBan ? classes.activetoggle_2 : ""
            }`}
            onClick={btnDanhSachKetBanHandler}
          >
            <div className={classes.left_groupAddFriend}>
              <i className="fas fa-user-plus"></i>
            </div>
            <div className={classes.right_groupAddFriend}>
              <p>Danh sách kết bạn</p>
            </div>
          </div>
          <div
            className={`${classes.groupGroup} ${
              isBtnDanhSachNhom ? classes.activetoggle_2 : ""
            }`}
            onClick={btnDanhSachGroupHandler}
          >
            <div className={classes.left_groupGroup}>
              <i className="fas fa-users"></i>
            </div>
            <div className={classes.right_groupGroup}>
              <p>Danh sách nhóm</p>
            </div>
          </div>
        </div>
        <div className={classes["list-friend"]}>
          <div className={classes.title}>
            <p>Bạn bè ({arrayFriend?.length})</p>
          </div>
          <div className={classes.friends}>
            {arrayFriend.map((data, index) => {
              return (
                <Friend
                  data={data?.users}
                  data1={data}
                  idLogin={idLogin}
                  key={index}
                />
              );
            })}
          </div>
        </div>
      </div>
      {
        <FormAddFriend
          onSendIsFormAddFriend={isFormAddFriend}
          onFormFalse={FalseFromFormAddFriend}
        />
      }
      {
        <FormAddGroup
          onSendIsFormAddGroup={isFormAddGroup}
          onFormFalse={FalseFromFormAddGroup}
        />
      }
    </Fragment>
  );
};

export default ListFriend;
