import React from "react";

const User = (props) => {

  // console.log(props.user);
  // console.log(props.index);

  return (
      <tr>
        <td>{props.index + 1}</td>
        <td>{props.user._id}</td>
        <td>{props.user.name}</td>
        <td>Giới tính</td>
        <td>{props.user.phone}</td>
        <td>
        <button>
            <i className="far fa-trash-alt"></i>Xóa
        </button>
        </td>
    </tr>

  );
};

export default User;
