import React from "react";
import classes from "./home.module.scss";

const Group = (props) => {

// console.log(props.group);

  return (
    <div className={classes.group}>
        <div className={classes.imageGroup}>
            <img src={props.group.avatar} alt="" />
        </div>
        <div className={classes.nameGroup}>
            <p>{props.group.name}</p>
        </div>
        <div className={classes.memberGroup}>
            <p>{props.group.users.length} thành viên</p>
        </div>
    </div>
  );
};

export default Group;
