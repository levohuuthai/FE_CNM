import React, { useEffect, useState, Fragment } from "react";
import adminAPI from "../../api/adminAPI";
import classes from "./admin.module.scss";
import User from "./User"
import FormLogOut from "../Home/form-logOut/FormLogOut"
import AddUser from "./form-addUser/FormAddUser";

const Admin = (props) => {

const [arrayUser, setArrayUser] = useState(null)
const [isFormLogOut, setIsFormLogOut] = useState(false)
const [isFormAddUser, setIsFormAddUser] = useState(false)

  useEffect(() => {
    const fetchGetAllUser = async () => {
      try {
        const requestGetAllUser = await adminAPI.getAllUser({});
        setArrayUser(requestGetAllUser.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetAllUser();
  }, []);

  // console.log(arrayUser?.users?._id);
  
  const LogoutHandler = () => {
    setIsFormLogOut(true)
  }
  const closeFormLogOut = () => {
    setIsFormLogOut(false)
  }
  const AddUserHandler = () => {
    setIsFormAddUser(true)
  }
  const closeFormAddUser = () => {
    setIsFormAddUser(false)
  }

  return (
    <Fragment>
        <div className={classes.manage}>
          <div className={classes.header}>
            <div className={classes.headerTop}>
              <div className={classes.logo}>
                <h2>LOGO</h2>
                <h2>Quản lí người dùng</h2>
              </div>
              <div className={classes.logout} onClick={LogoutHandler}>
                <button>
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
            <div className={classes.headerBottom}>
              <div className={classes.left}>
                <input type="text" placeholder="Tìm kiếm" />
                <button>
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <div className={classes.right}>
                <button className={classes.reset}>
                  <i className="fas fa-undo-alt"></i>Reset
                </button>
                <button className={classes.addUser} onClick={AddUserHandler}>
                  <i className="fas fa-user-plus"></i>Thêm người dùng
                </button>
              </div>
            </div>
          </div>
          <div className={classes.body}>
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>ID</th>
                  <th>Họ và tên</th>
                  <th>Giới tính</th>
                  <th>Số điện thoại</th>
                  <th>Xóa tài khoản</th>
                </tr>
              </thead>
              <tbody>
                {arrayUser?.users.map((user, index) => {
                    return <User user={user} index={index}></User>
                })}
              </tbody>
            </table>
          </div>
        </div>

        {<FormLogOut
          openFormLogOutFromAdmin={isFormLogOut}
          onFormFalse={closeFormLogOut}
        >
          </FormLogOut>}

        {<AddUser
          openFormAddUserFromAdmin={isFormAddUser}
          onFormFalse={closeFormAddUser}
        >
          </AddUser>}
    </Fragment>
  );
};

export default Admin;
