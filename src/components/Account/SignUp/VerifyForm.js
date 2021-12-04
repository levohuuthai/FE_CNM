import React from "react";
import classes from "./verifyForm.module.scss";
import logo from "../../../assets/logo.png";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import signupAPI from "../../../api/signupAPI";
const VerifyForm = (props) => {
  const History = useHistory();
  const [enteredCode, setEnteredCode] = useState("");
  const CodeInputChangeHandler = (event) => {
    setEnteredCode(event.target.value);
  };

  console.log(props.onSendPhoneToVerify);
  const formSubmitHandler = (event) => {
    event.preventDefault();
    const fetchVerify = async () => {
      try {
        const verify = await signupAPI.verifyOTPSignUp({
          phone: props.onSendPhoneToVerify,
          code: enteredCode,
        });
        if (verify.status === 200) {
          History.push("/signup/userpass");
        }
      } catch (error) {
        //setIsError("mã Code không tồn tại");
        console.log(error);
      }
    };
    fetchVerify();
  };
  return (
    <div className={classes.verify}>
      <header>
        <img src={logo} alt="" />
      </header>
      <form onSubmit={formSubmitHandler}>
        <div className={classes["title-form"]}>
          <p>
            Bạn sẽ nhận được tin nhắn có mã kích hoạt từ <br /> Zalo
          </p>
          <h2>0327364753</h2>
        </div>
        <div className={classes["content-form"]}>
          <p>NHẬP MÃ KÍCH HOẠT</p>
          <div className={classes.inputCode}>
            <input
              type="text"
              placeholder="Mã kích hoạt"
              onChange={CodeInputChangeHandler}
            />
          </div>
          <button className={classes["btn-first"]}>Xác nhận</button>
        </div>
      </form>
      <footer>
        <Link to="/signup">Quay lại</Link>
      </footer>
    </div>
  );
};

export default VerifyForm;
