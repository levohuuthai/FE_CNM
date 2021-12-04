import React, { useEffect, useState } from "react";
import classes from "./formAddUser.module.scss";


const AddUser = (props) => {
    const [isOpenForm, setIsOpenForm] = useState("");


const cancelHandler = (e) => {
    e.preventDefault();
    setIsOpenForm("");
    props.onFormFalse(false);
};
    
    useEffect(() => {
    if (props.openFormAddUserFromAdmin) {
        setIsOpenForm(classes.active);
    } else {
        setIsOpenForm("");
    }
    }, [props.openFormAddUserFromAdmin]);

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
         
      </div>
    </div>
  </div>
  );
};

export default AddUser;
