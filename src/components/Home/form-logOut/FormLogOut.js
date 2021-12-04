import React from "react";
import classes from "./FormLogOut.module.scss";
import { useState, useEffect } from "react";
import groupAPI from "../../../api/groupAPI";
import logoutAPI from "../../../api/logoutAPI";
import { useHistory } from "react-router";
import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

toast.configure()
const FormAddFriend = (props) => {
  const [isOpenForm, setIsOpenForm] = useState("");

  const History = useHistory();

  const cancelHandler = (e) => {
    e.preventDefault();
    setIsOpenForm("");
    props.onFormFalse(false);
  };

  useEffect(() => {
    if (props.isOpenFormLogOut) {
      setIsOpenForm(classes.active);
    } else {
      setIsOpenForm("");
    }
  }, [props.isOpenFormLogOut]);

//nhận lệnh mở form Logout từ Admin
  useEffect(() => {
    if (props.openFormLogOutFromAdmin) {
      setIsOpenForm(classes.active);
    } else {
      setIsOpenForm("");
    }
  }, [props.openFormLogOutFromAdmin]);


//   console.log(props.idGroupChat);
  const LogOutHandler = (event) => {
      event.preventDefault()
    //   console.log(localStorage.getItem("refreshToken"));
    const fetchLogOut = async () => {
        try {
          const logOut = await logoutAPI.logout({
            refreshToken: localStorage.getItem("refreshToken")
          })

            if (logOut.status === 200) {
                localStorage.removeItem("refreshToken")
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                props.onFormFalse(false);
                History.push("/signin");
                toast.success("Đăng xuất thành công", {position: toast.POSITION.TOP_RIGHT, autoClose: 2000})
          }
        } catch (error) {
          console.log(error);
          console.log("fail")
        }
      };
      fetchLogOut();
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
            <p>Bạn có muốn đăng xuất khỏi ZOLA?</p>
        </div>
        <div className={classes.footer}>
            <div className={classes.button}>
                <button className={classes.cancel} onClick={cancelHandler}>Không</button>
                <button className={classes.confirm} onClick={LogOutHandler}>Xác nhận</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddFriend;
