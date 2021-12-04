import React from "react";
import classes from "./formChangePass.module.scss";
import { useState, useEffect } from "react";
import userAPI from "../../../api/userAPI";
const FormChangePass = (props) => {
  const [isFocusInput, setIsFocusInput] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState("");
  const [enterPassHandler, setEnterPassHandler] = useState("");
  const [enterRePassHandler, setEnterRePassHandler] = useState("");
  const [enterNewPassHandler, setEnterNewPassHandler] = useState("");
  const [isError, setIsError] = useState("");

  const InputHandler = () => {
    setIsFocusInput(true);
  };

  const cancelHandler = () => {
    props.onCancel(false);
  };

  const passHandler = (event) => {
    setEnterPassHandler(event.target.value);
  };
  const rePassHandler = (event) => {
    setEnterRePassHandler(event.target.value);
  };
  const newPassHandler = (event) => {
    setEnterNewPassHandler(event.target.value);
  };

  const updatePasswordHandler = (event) => {
    event.preventDefault();
    if (enterPassHandler === "" || enterRePassHandler === "" || enterNewPassHandler=== "") {
      setIsError("Không được rỗng");
      return;
    }
    const regex = /^[a-z0-9A-Z]{6,}$/;
    if (regex.test(enterNewPassHandler)) {
      setIsError("");
    } else {
      setIsError(
        "Mật khẩu mới ít nhất 6 kí tự!!"
      );
      return;
    }
    const fetchUpdatePassword = async () => {
      try {
        const verify = await userAPI.ChangePassword({
          password: enterPassHandler,
          reEnterPassword: enterRePassHandler,
          newPassword: enterNewPassHandler,
        });
        if (verify.status === 200) {
          console.log("Success");
          props.onFormFalse(false);
        }
      } catch (error) {
        setIsError(error);
      }
    };
    fetchUpdatePassword();
  };

  return (
    <div className={classes.ViewchangePass}>
      <div className={classes.header}>
        <h2>Tạo mật khẩu mới</h2>
        <div onClick={cancelHandler}>
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div className={classes.body}>
        <form>
          <div className={classes.currentPass}>
            <label>Mật khẩu hiện tại</label>
            <input
              type="text"
              placeholder="Nhập mật khẩu hiện tại"
              onChange={passHandler}
            />
          </div>

          <div className={classes.newPass}>
            <label>Mật khẩu mới</label>
            <input
              type="text"
              placeholder="Nhập mật khẩu cũ"
              onFocus={InputHandler}
              onChange={rePassHandler}
            />
          </div>
          <div className={classes.confirmNewPass}>
            <label>Nhập lại mật khẩu mới</label>
            <input
              type="text"
              placeholder="Nhập lại mật khẩu mới"
              onFocus={InputHandler}
              onChange={newPassHandler}
            />
          </div>
          {isError != "" && <span className={classes.error}>{isError}</span>}
          <div className={classes.button}>
            <button className={classes.cancel} onClick={cancelHandler}>
              Hủy
            </button>
            <button
              className={`${classes.updated} ${
                isFocusInput ? classes.active : ""
              }`}
              onClick={updatePasswordHandler}
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormChangePass;
