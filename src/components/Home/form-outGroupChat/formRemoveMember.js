import React from "react";
import classes from "./formOutGroup.module.scss";
import { useState, useEffect } from "react";
import groupAPI from "../../../api/groupAPI";
import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

toast.configure()
const FormRemoveMember = (props) => {
  const [isOpenForm, setIsOpenForm] = useState("");

  //truyền false cho BoxChat
  const cancelHandler = (e) => {
    e.preventDefault();
    setIsOpenForm("");
    props.onFormFalse(false);
  };

  //nhận lệnh mở form từ boxchat
  useEffect(() => {
    if (props.isOpenFormRemoveMember) {
      setIsOpenForm(classes.active);
    } else {
      setIsOpenForm("");
    }
  }, [props.isOpenFormRemoveMember]);

  // console.log(props.userFromMember);
  // console.log(props.room);

  const removeMemberHandler = (event) => {
    event.preventDefault();
    const fetchRemoveMember = async () => {
      try {
        const removeMember = await groupAPI.removeMember({
          id: props.room._id,
          userWantRemove: props.userFromMember._id
        });
        if (removeMember.status === 200) {
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
          toast.success("Đã mời ra thành công", {position: toast.POSITION.TOP_RIGHT, autoClose: 2000})
          props.onFormFalse(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRemoveMember();
  }

  return (
    <div className={classes.modalFormAddFriend}>
      <div className={` ${classes.backdrop} ${isOpenForm}`}></div>
      <div className={` ${classes.viewFormAddFriend} ${isOpenForm}`}>
        <div className={classes.header}>
          <h2>Mời rời nhóm</h2>
          <div className={classes.cancel} onClick={cancelHandler}>
            <div className={classes.blur}>
              <i className="bi bi-x"></i>
            </div>
          </div>
        </div>
        <div className={classes.body}>
            <p>Bạn muốn mời người dùng này ra khỏi nhóm?</p>
        </div>
        <div className={classes.footer}>
            <div className={classes.button}>
                <button className={classes.cancel} onClick={cancelHandler}>
                    Hủy
                </button>
                <button className={classes.search} onClick={removeMemberHandler}>Xác nhận</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FormRemoveMember;
