import React, { Fragment } from "react";
import classes from "./formDeleteFriend.module.scss";
import { useState, useEffect } from "react";
import groupAPI from "../../../api/groupAPI";
import logoutAPI from "../../../api/logoutAPI";
import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import addFriendAPI from "../../../api/addFriendAPI";

toast.configure()
const FormDeleteFriend = (props) => {
  const [isOpenForm, setIsOpenForm] = useState("");


  const cancelHandler = (e) => {
    e.preventDefault();
    setIsOpenForm("");
    props.onFormFalse(false);
  };

  useEffect(() => {
    if (props.isFormDeleteFriend) {
      setIsOpenForm(classes.active);
    } else {
      setIsOpenForm("");
    }
  }, [props.isFormDeleteFriend]);

//   console.log(props.user);

  const DeleteFriendHandler = (event) => {
      event.preventDefault()
    const fetchDeleteFriend = async () => {
        try {
          const deleteFriend = await addFriendAPI.deleteFriend({
            friendId: props.user.users._id
          })
            if (deleteFriend.status === 200) {
                toast.success("Xóa bạn thành công", {position: toast.POSITION.TOP_RIGHT, autoClose: 2000})
                props.onFormFalse(false);
            }
        } catch (error) {
          console.log(error);
          toast.error("Xóa bạn không thành công", {position: toast.POSITION.TOP_RIGHT, autoClose: false})
        }
      };
      fetchDeleteFriend();
  }

  return (
    <div className={classes.modalFormLogOut}>
      <div className={` ${classes.backdrop} ${isOpenForm}`}></div>
      <div className={` ${classes.viewFormLogOut} ${isOpenForm}`}>
        <div className={classes.header}>
          <h2>Xác nhận</h2>
          <div className={classes.cancel} onClick={cancelHandler}>
            <div className={classes.blur}>
              <i className="bi bi-x"></i>
            </div>
          </div>
        </div>
        <div className={classes.body}>
            <p>Bạn có muốn hủy kết bạn với người dùng này?</p>
        </div>
        <div className={classes.footer}>
            <div className={classes.button}>
                <button className={classes.cancel} onClick={cancelHandler}>Hủy</button>
                <button className={classes.confirm} onClick={DeleteFriendHandler}>Xác nhận</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FormDeleteFriend;
