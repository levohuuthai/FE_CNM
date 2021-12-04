import React, { useEffect } from "react";
import classes from "./home.module.scss";
import { useState } from "react";
// import { useSelector } from "react-redux";
import roomAPI from "../../api/roomAPI";
import Group from "./Group"

const ListGroup = (props) => {

    const [arrayGroup, setArrayGroup] = useState([])
    //const loggedInUser = useSelector((state) => state.user.current);
    // const idLogin = loggedInUser._id;


  useEffect(() => {
    const fetchGetRoomGroup = async () => {
      try {
        const requestGetRoomGroup = await roomAPI.getRoomGroup({});
        setArrayGroup(requestGetRoomGroup.data);
        // console.log(requestGetRoomGroup);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetRoomGroup();
  }, []);

  return (
    <div className={classes.container_listGroup}>
        <div className={classes.title}>
            <i className="fas fa-users"></i>
            <p>Danh sách nhóm</p>
        </div>
        <div className={classes.body_listGroup}>
            <div className={classes.text_listgroup}>
                <p>Tất cả ({arrayGroup.length})</p>
            </div>
            <div className={classes.groups}>
                {arrayGroup.map((group) => {
                    return <Group group={group}></Group>
                })}
            </div>
        </div>
    </div>
  );
};

export default ListGroup;
