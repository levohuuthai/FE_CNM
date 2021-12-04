import React from "react";
import classes from "./formOutGroup.module.scss";
import { useState, useEffect } from "react";
import groupAPI from "../../../api/groupAPI";
import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

toast.configure()
const FormDeleteGroup = (props) => {
  const [isOpenForm, setIsOpenForm] = useState("");

  //truyền false cho BoxChat
  const cancelHandler = (e) => {
    e.preventDefault();
    setIsOpenForm("");
    props.onFormFalse(false);
  };

  useEffect(() => {
    if (props.isOpenFormDeleteGroup) {
      setIsOpenForm(classes.active);
    } else {
      setIsOpenForm("");
    }
  }, [props.isOpenFormDeleteGroup]);

// console.log(props.room);
  const outGroupHandler = (event) => {
      event.preventDefault()
    const fetchDeleteGroup = async () => {
        try {
          const deleteGroup = await groupAPI.deleteGroup({
            id: props.room._id
          });
          if (deleteGroup.status === 200) {
            toast.success("Xóa nhóm thành công", {position: toast.POSITION.TOP_RIGHT, autoClose: 2000})
            props.onFormFalse(false);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchDeleteGroup();
  }

  return (
    <div className={classes.modalFormAddFriend}>
      <div className={` ${classes.backdrop} ${isOpenForm}`}></div>
      <div className={` ${classes.viewFormAddFriend} ${isOpenForm}`}>
        <div className={classes.header}>
          <h2>Xóa nhóm</h2>
          <div className={classes.cancel} onClick={cancelHandler}>
            <div className={classes.blur}>
              <i className="bi bi-x"></i>
            </div>
          </div>
        </div>
        <div className={classes.body}>
            <p>Bạn có chắc chắn muốn xóa nhóm này không?</p>
        </div>
        <div className={classes.footer}>
            <div className={classes.button}>
                <button className={classes.cancel} onClick={cancelHandler}>
                    Hủy
                </button>
                <button className={classes.search} onClick={outGroupHandler}>Xóa Nhóm</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FormDeleteGroup;
