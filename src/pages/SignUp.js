import SignUpForm from "../components/Account/SignUp/SignUpForm";
import VerifyForm from "../components/Account/SignUp/VerifyForm";
import UserPass from "../components/Account/SignUp/UserPass";
import { Route } from "react-router-dom";
import { Fragment } from "react";
import { useState } from "react";
const SignUp = (props) => {
  const [valuePhone, setvaluePhone] = useState("");

  const receivePhoneHandler = (phone) => {
    setvaluePhone(phone);
  };

  return (
    <Fragment>
      <Route path="/signup" exact>
        <SignUpForm onSendPhoneToPage={receivePhoneHandler} />{" "}
        {/*Nhận phone từ signupform*/}
      </Route>
      <Route path="/signup/verify">
        <VerifyForm onSendPhoneToVerify={valuePhone} />{" "}
        {/*truyền phone xuống cho verifyform */}
      </Route>
      <Route path="/signup/userpass">
        <UserPass onSendPhoneToUserPass={valuePhone}/>
      </Route>
    </Fragment>
  );
};

export default SignUp;
