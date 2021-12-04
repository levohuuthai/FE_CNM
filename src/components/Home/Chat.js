import classes from "./home.module.scss";
import { useState } from "react";
import React, { useEffect } from "react";
import addFriendAPI from "../../api/addFriendAPI";
import { format } from "timeago.js";
import { Fragment } from "react";
import tung from "../../assets/tung.jpg";
import { FileIcon, defaultStyles } from "react-file-icon";
import FormViewImage from "./form-video/FormViewImage";
import moment from "moment";
import Moment from "react-moment";
import { useSelector } from "react-redux";

const Chat = (props) => {
  const [user, setUser] = useState(null);
  const [isOpenFormViewImage, setIsOpenFormViewImage] = useState(false);

  const loggedInUser = useSelector((state) => state.user.current);
  const avatar = loggedInUser.avatar;

  // var date = new Date(props.data.createdAt);
  // var hour = date.getHours();
  // var minute = date.getMinutes();
  // var timeFormated = hour + ":" + minute

  const time = moment(props.data.createdAt);

  useEffect(() => {
    const fetchGetUser = async () => {
      try {
        const requestGetUser = await addFriendAPI.getUser({
          userID: props.data.sender,
        });
        setUser(requestGetUser.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetUser();
    // console.log(fetchGetUser());
  }, [props.data.sender]);

  const uploadFile = props.data.text.split(".");
  const filesTypes = uploadFile[uploadFile.length - 1];
  //console.log(user.name);

  const viewImageHandler = () => {
    setIsOpenFormViewImage(true);
  };
  const falseFromViewImage = () => {
    setIsOpenFormViewImage(false);
  };
  // console.log(props.data);
  return (
    <Fragment>
      <div
        className={`${classes.container} ${
          props.own ? classes.message_own : ""
        }`}
      >
        {props.own && (
          <Fragment>
            <div className={`${classes.container_mess} `}>
              <div className={classes.message}>
                <div className={classes.messageTop}>
                  {props.data.type === "img" ? (
                    <img
                      className={classes.messageImage}
                      alt=""
                      src={props.data.text}
                      onClick={viewImageHandler}
                    />
                  ) : props.data.type === "text" ? (
                    <p className={classes.messageText}>{props.data.text}</p>
                  ) : props.data.type === "video" ? (
                    <video
                      controls
                      className={classes.messageVideo}
                      alt=""
                      src={props.data.text}
                    >
                      <source src={props.data.text} />
                    </video>
                  ) : props.data.type === "file" ? (
                    <div className={classes.file}>
                      <div className={classes.imageFile}>
                        <a
                          className={classes.messageFile}
                          href={props.data.text}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className={classes.fileicon}>
                            <FileIcon
                              type="document"
                              extension={filesTypes}
                              {...defaultStyles[filesTypes]}
                              size="5"
                            />
                          </div>
                        </a>
                      </div>
                      <div className={classes.nameFile}>
                        <a
                          href={props.data.text}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {props.data.nameFile}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div className={classes.messageBottom}>
                  <Moment format="HH:mm">{time}</Moment>
                </div>
              </div>
            </div>
            <div className={classes.avatar}>
              <img src={avatar} alt="avatar" />
            </div>
          </Fragment>
        )}
        {!props.own && (
          <Fragment>
            <div className={classes.avatar}>
              <img src={user?.avatar} alt="avatar" />
            </div>
            <div className={`${classes.container_mess} `}>
              <div className={classes.message}>
                <div className={classes.messageTop}>
                  <p className={classes.nameSender}>{user?.name}</p>
                  {props.data.type === "img" ? (
                    <img
                      className={classes.messageImage}
                      alt=""
                      src={props.data.text}
                      onClick={viewImageHandler}
                    />
                  ) : props.data.type === "text" ? (
                    <p className={classes.messageText}>{props.data.text}</p>
                  ) : props.data.type === "video" ? (
                    <video
                      controls
                      className={classes.messageVideo}
                      alt=""
                      src={props.data.text}
                    >
                      <source src={props.data.text} />
                    </video>
                  ) : props.data.type === "file" ? (
                    <div className={classes.file}>
                      <div className={classes.imageFile}>
                        <a
                          className={classes.messageFile}
                          href={props.data.text}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className={classes.fileicon}>
                            <FileIcon
                              type="document"
                              extension={filesTypes}
                              {...defaultStyles[filesTypes]}
                              size="5"
                            />
                          </div>
                        </a>
                      </div>
                      <div className={classes.nameFile}>
                        <a
                          href={props.data.text}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {props.data.nameFile}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div className={classes.messageBottom}>
                  <Moment format="HH:mm">{time}</Moment>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>

      <FormViewImage
        isOpenFormViewImage={isOpenFormViewImage}
        text={props.data.text}
        onFormFalse={falseFromViewImage}
      ></FormViewImage>
    </Fragment>
  );
};

export default Chat;
