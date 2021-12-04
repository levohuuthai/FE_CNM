import React from "react";
import classes from "./FormViewImage.module.scss";
import { useState, useEffect } from "react";
const FormViewImage = (props) => {
    const [isOpenForm, setIsOpenForm] = useState("");

    useEffect(() => {
        if (props.isOpenFormViewImage) {
          setIsOpenForm(classes.active);
        } else {
          setIsOpenForm("");
        }
      }, [props.isOpenFormViewImage]);

      const cancelHandler = (e) => {
        e.preventDefault();
        setIsOpenForm("");
        props.onFormFalse(false);
      };

  return (
    <div className={classes.modalFormAddFriend}>
    <div className={` ${classes.backdrop} ${isOpenForm}`}></div>
    <div className={` ${classes.viewFormAddFriend} ${isOpenForm}`}>
      <div className={classes.header}>
        <div className={classes.cancel} onClick={cancelHandler}>
          <div className={classes.blur}>
            <i className="bi bi-x"></i>
          </div>
        </div>
      </div>
      <div className={classes.body}> 
        <div className={classes.image}>
            <img alt="" src={props.text}/>
        </div> 
      </div>
    </div>
  </div>
  );
};

export default FormViewImage;
