import React from "react";
import classes from "./formOutGroup.module.scss";
import { useState, useEffect } from "react";
import groupAPI from "../../../api/groupAPI";
import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

toast.configure()
const FormAddFriend = (props) => {
  const [isOpenForm, setIsOpenForm] = useState("");

  //truyền false cho BoxChat
  const cancelHandler = (e) => {
    e.preventDefault();
    setIsOpenForm("");
    props.onFormFalse(false);
  };

  useEffect(() => {
    if (props.isFormOuGroup) {
      setIsOpenForm(classes.active);
    } else {
      setIsOpenForm("");
    }
  }, [props.isFormOuGroup]);

  // console.log(props.room.users);
  const outGroupHandler = (event) => {
      event.preventDefault()
    const fetchExitGroup = async () => {
        try {
          const exitGroup = await groupAPI.exitGroup({
            id: props.room._id
          });
          if (exitGroup.status === 200) {
            //kiểm tra còn dưới 3 người là xóa group
            if(props.room.users.length - 1 < 3){
              const fetchDeleteGroup = async () => {
                try {
                  const deleteGroup = await groupAPI.deleteGroup({
                    id: props.room._id
                  });
                  if (deleteGroup.status === 200) {
                    console.log("Delete Group luôn nè má tại còn dưới 3 ngừ à huhu");
                  }
                } catch (error) {
                  console.log(error);
                }
              };
              fetchDeleteGroup();
            }
            toast.success("Rời nhóm thành công", {position: toast.POSITION.TOP_RIGHT, autoClose: 2000})
            props.onFormFalse(false);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchExitGroup();
  }

  return (
    <div className={classes.modalFormAddFriend}>
      <div className={` ${classes.backdrop} ${isOpenForm}`}></div>
      <div className={` ${classes.viewFormAddFriend} ${isOpenForm}`}>
        <div className={classes.header}>
          <h2>Rời nhóm và xóa hội thoại</h2>
          <div className={classes.cancel} onClick={cancelHandler}>
            <div className={classes.blur}>
              <i className="bi bi-x"></i>
            </div>
          </div>
        </div>
        <div className={classes.body}>
            <p>Bạn sẽ không thể xem lại tin nhắn trong nhóm này sau khi rời nhóm!</p>
        </div>
        <div className={classes.footer}>
            <div className={classes.button}>
                <button className={classes.cancel} onClick={cancelHandler}>
                    Hủy
                </button>
                <button className={classes.search} onClick={outGroupHandler}>Rời Nhóm</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddFriend;
