import React, { Fragment } from "react";
import classes from "./formAddFriend.module.scss";
import { useState, useEffect } from "react";
import tung from "../../../assets/tung.jpg";
import addFriendAPI from "../../../api/addFriendAPI";
const FormAddFriend = (props) => {
  const [isOpenForm, setIsOpenForm] = useState("");
  const [enteredPhone, setEnterPhone] = useState("");
  const [resultUser, setResultUser] = useState(false);
  const [resultRequest, setResultRequest] = useState("Thêm");
  const [user, setUser] = useState({});
  const [isError, setIsError] = useState("");
  //let userName = "";

  const enteredPhoneHandler = (event) => {
    setEnterPhone(event.target.value);
  };

  //truyền false cho ListFriend
  const cancelHandler = (e) => {
    e.preventDefault();
    setIsOpenForm("");
    props.onFormFalse(false);
  };

  useEffect(() => {
    if (props.onSendIsFormAddFriend) {
      setIsOpenForm(classes.active);
    } else {
      setIsOpenForm("");
    }
  }, [props.onSendIsFormAddFriend]);

  const addRequestHandler = (e) => {
    const fetchRequestAddFriend = async () => {
      try {
        const requestAddFriend = await addFriendAPI.requestAddFriend({
          id_UserWantAdd: user._id,
        });
        setResultRequest("Đã gửi");
      } catch (error) {
        console.log(error);
      }
    };
    fetchRequestAddFriend();
  };

  const searchHandler = (event) => {
    event.preventDefault();
    const fetchUserByPhone = async () => {
      try {
        const userByPhone = await addFriendAPI.GetUserByPhone({
          phone: enteredPhone,
        });
        if (userByPhone.status == 200) {
          setResultUser(true);
          setUser(userByPhone.data.users);

          //kiểm tra đã gửi hay chưa
          const FetchcheckSendRequest = async () => {
            const requestCheckSendRequest = await addFriendAPI.checkSendRequest(
              userByPhone.data.users._id
            );
            if (requestCheckSendRequest.data.success === true) {
              setResultRequest((pre) => {
                return pre, "Đã gửi";
              });
            } else {
              //kiểm tra đã là bạn hay chưa
              const FetchcheckFriend = async () => {
                const requestCheckcheckFriend = await addFriendAPI.checkFriend(
                  userByPhone.data.users._id
                );
                if (requestCheckcheckFriend.data.success === true) {
                  setResultRequest("Đã là bạn bè");
                } else {
                  setResultRequest("Thêm");
                }
              };
              FetchcheckFriend();
            }
          };
          FetchcheckSendRequest();
        }
      } catch (error) {
        setResultUser(false);
        setIsError(error);
      }
    };
    fetchUserByPhone();
  };

  return (
    <div className={classes.modalFormAddFriend}>
      <div className={` ${classes.backdrop} ${isOpenForm}`}></div>
      <div className={` ${classes.viewFormAddFriend} ${isOpenForm}`}>
        <div className={classes.header}>
          <h2>Thêm Bạn</h2>
          <div className={classes.cancel} onClick={cancelHandler}>
            <div className={classes.blur}>
              <i className="bi bi-x"></i>
            </div>
          </div>
        </div>
        <div className={classes.body}>
          <div className={classes.phone}>
            <p>
              <span style={{ fontSize: "15px" }}>VN</span>
              <span>(+84)</span>
            </p>
            <input
              type="phone"
              placeholder="Số điện thoại"
              onChange={enteredPhoneHandler}
            />
          </div>
          <div className={classes.result}>
            {resultUser && (
              <div
                className={`${classes.user} ${
                  resultRequest === "Đã là bạn bè"
                    ? classes.active_checkFriend
                    : ""
                }`}
              >
                <div className={classes.left}>
                  <div className={classes.avatar}>
                    <img src={user.avatar} alt="tung" />
                  </div>
                  <p>{user.name}</p>
                </div>
                <div className={classes.right}>
                  <button onClick={addRequestHandler}>{resultRequest}</button>
                </div>
              </div>
            )}
            {!resultUser && <span className={classes.error}>{isError}</span>}
          </div>

          <br />
          <div className={classes.button}>
            <button className={classes.cancel} onClick={cancelHandler}>
              Hủy
            </button>
            <button className={classes.search} onClick={searchHandler}>
              Tìm Kiếm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddFriend;
