import React, { Fragment, useEffect } from "react";
import classes from "./home.module.scss";
import { useState } from "react";
import messageAPI from "../../api/messageAPI";
import Chat from "./Chat";
import { useSelector } from "react-redux";
import { useRef } from "react";
import FormUserInfomation from "./form-information/FormUserInfomation";
import FormAddMember from "./form-addGroup/FormAddMember";
import FormCallVideo from "./form-video/FormCallVideo";
import FormOutGroup from "./form-outGroupChat/formOutGroup";
import FormRemoveMember from "./form-outGroupChat/formRemoveMember";
import FormDeleteGroup from "./form-outGroupChat/formDeleteGroupChat";
import Member from "./Member";
import Picker from "emoji-picker-react";
import axios from "axios";
// import groupAPI from "../../api/groupAPI";

const BoxChat = (props) => {
  const [enteredChat, setEnteredChat] = useState("");
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isFormInfomation, setIsFormInfomation] = useState(false);
  const [isOpenFormAddGroup, setIsOpenFormAddGroup] = useState(false);
  const [
    isOpenFormBoxChatInfoHandler,
    setIsOpenFormBoxChatInfoHandler,
  ] = useState(false);
  const [isOpenFormCallVideo, setIsOpenFormCallVideo] = useState(false);
  const [isOpenFormOutGroup, setIsOpenFormOutGroup] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isOpenFormDeleteGroup, setIsOpenFormDeleteGroup] = useState(false);
  const [isOpenFormRemoveMember, setIsOpenFormRemoveMember] = useState(false);
  const [userFromMember, setUserFromMember] = useState(null);

  const [roomSended, setRoomSended] = useState("");

  const loggedInUser = useSelector((state) => state.user.current);
  const idLogin = loggedInUser._id;
  const _isMounted = useRef(true);

  //Set biến true để mở form FormUserInformation cho thằng FormUserInformation
  const openFormUserInfomation = () => {
    setIsFormInfomation(true);
  };

  //Nhận biến false từ FormUserInformation để đóng form
  const closeFormInformation = (falseFromFUI) => {
    setIsFormInfomation(falseFromFUI);
  };

  const chatHandler = (event) => {
    setEnteredChat(event.target.value);
  };
  // console.log(props.onSendSocketToBoxChat);

  // console.log(props.onSendRoomToBoxChat._id); //lấy object room từ bên home gửi qua
  //console.log(props.onSendUserToBoxChat);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await messageAPI.GetMessage({
          idRoom: props.onSendRoomToBoxChat?._id,
        });
        //if (_isMounted.current) {
        setMessages(res.data);
        // }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessage();
    // return () => {
    //   _isMounted.current = false;
    // };
  }, [props.onSendRoomToBoxChat]);

  const SendMessageHandler = async (e) => {
    e.preventDefault();
    const newMessage = {
      sender: idLogin,
      type: "text",
      text: enteredChat,
      RoomId: props.onSendRoomToBoxChat?._id,
    };
    const fetchAddMessage = async () => {
      try {
        const res = await messageAPI.AddMessage({
          message: newMessage,
        });
        setMessages([...messages, res.data]);
        //console.log(res.data);
        setEnteredChat("");
        setShowEmoji(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddMessage();
  };

  useEffect(() => {
    // try {
    props.onSendSocketToBoxChat.current.on("send-message", (data) => {
      // console.log(
      //   props.onSendRoomToBoxChat._id,
      //   "----------------------" + data.RoomId
      // );
      if (props.onSendRoomToBoxChat?._id === data.RoomId) {
        if (_isMounted.current) {
          setRoomSended(data.RoomId);
          setArrivalMessage({
            sender: data.sender,
            type: data.type,
            text: data.text,
            createdAt: Date.now(),
          });
        }
      }
    });
    // } catch (error) {
    //   console.log(error);
    // }

    return () => {
      _isMounted.current = false;
    };
  }, [props.onSendRoomToBoxChat]);

  useEffect(() => {
    if (props.onSendRoomToBoxChat?._id === roomSended) {
      arrivalMessage &&
        props.onSendRoomToBoxChat?.users.includes(arrivalMessage.sender) &&
        _isMounted.current &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }

    return () => {
      _isMounted.current = false;
    };
  }, [arrivalMessage || props.onSendRoomToBoxChat || roomSended]);

  const scrollRef = useRef();
  useEffect(() => {
    if (_isMounted.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    return () => {
      _isMounted.current = false;
    };
  }, [messages]);

  const formfalseHandler = (falseFromForm) => {
    setIsOpenFormAddGroup(falseFromForm);
  };

  const addMemberHandler = () => {
    setIsOpenFormAddGroup(true);
  };

  const openFormBoxChatInfoHandler = () => {
    setIsOpenFormBoxChatInfoHandler(!isOpenFormBoxChatInfoHandler);
  };

  const openFormCallVideoHandler = () => {
    setIsOpenFormCallVideo(true);
  };

  const closeFormCallVideo = (falseFromCallVideo) => {
    setIsOpenFormCallVideo(falseFromCallVideo);
  };

  //hiện form out group chat
  const outGroupHandler = () => {
    setIsOpenFormOutGroup(true);
  };
  //đóng form out group chat
  const closeFormOutGroup = (falseFormOutGroup) => {
    setIsOpenFormOutGroup(falseFormOutGroup);
  };
  // console.log(props.onSendUserToBoxChat);
  // console.log(props.onSendRoomToBoxChat.group);

  const onEmojiClick = (event, emojiObject) => {
    // console.log(emojiObject);
    setEnteredChat(enteredChat + emojiObject.emoji);
  };

  const showEmojiHandler = () => {
    setShowEmoji(!showEmoji);
  };

  const fileUploadHandler = async (e) => {
    e.preventDefault();
    const fileSelected = e.target.files[0];
    const fd = new FormData();
    //for(let i = 0; i < selectedFile.length; i++) {
    fd.append("uploadFile", fileSelected);
    //     }
    axios
      .post("//localhost:3000/messages/addFile", fd)
      .then((res) => {
        console.log(res.data);
        // if();
        const uploadFile = res.data.split(".");
        const filesTypes = uploadFile[uploadFile.length - 1];
        let newMessage;
        if (filesTypes === "mp4" || filesTypes === "mkv") {
          newMessage = {
            sender: idLogin,
            text: res.data,
            RoomId: props.onSendRoomToBoxChat?._id,
            type: "video",
          };
        } else if (
          filesTypes === "png" ||
          filesTypes === "jpg" ||
          filesTypes === "gif" ||
          filesTypes === "jpeg"
        ) {
          newMessage = {
            sender: idLogin,
            text: res.data,
            RoomId: props.onSendRoomToBoxChat?._id,
            type: "img",
          };
        } else {
          newMessage = {
            sender: idLogin,
            text: res.data,
            RoomId: props.onSendRoomToBoxChat?._id,
            type: "file",
            nameFile: fileSelected.name,
          };
        }
        const fetchAddMessage = async () => {
          try {
            const res = await messageAPI.AddMessage({
              message: newMessage,
            });
            setMessages([...messages, res.data]);
            //console.log(res.data);
            //setEnteredChat("");
          } catch (error) {
            console.log(error);
          }
        };
        fetchAddMessage();
      })
      .catch((aa) => {
        console.log("Khong Gui dc", aa);
      });
  };

  // console.log(props.onSendRoomToBoxChat._id);

  const deleteGroupHandler = () => {
    setIsOpenFormDeleteGroup(true);
  };
  const cancelFormDeleteGroup = (falseFromDeleteForm) => {
    setIsOpenFormDeleteGroup(falseFromDeleteForm);
  };
  //nhận lệnh mở form removeMember và truyền cho FormRemoveMember
  const openRemoveMemberHandler = (trueFromRemoverMember) => {
    setIsOpenFormRemoveMember(trueFromRemoverMember);
  };
  //nhận lệnh đóng form từ removeMember và truyền qua cho Member
  const closeFormRemoveMember = (falseFromRemoveMember) => {
    setIsOpenFormRemoveMember(falseFromRemoveMember);
  };
  const ReceiveUserFromMember = (user) => {
    setUserFromMember(user);
  };
  document.addEventListener("click", function (e) {
    const target = e.target;
    if (target.classList?.contains("secondRight")) {
      console.log("haha");
    }
  });

  const [clickedOutside, setClickedOutside] = useState(false);
  const myRef = useRef();

  const handleClickOutside = (e) => {
    if (window.innerWidth < 992) {
      if (!myRef.current?.contains(e.target)) {
        setIsOpenFormBoxChatInfoHandler(false);
        setClickedOutside(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  });

  //calvideo
  //NHận biến answer từ form call video
  const receiveFromCallVideoHandler = ({
    receivingCall,
    callAccepted,
    name,
    activeCalling,
  }) => {
    props.onReceiveCallingFromBoxChat({
      receivingCall: receivingCall,
      callAccepted: callAccepted,
      name: name,
      activeCalling: activeCalling,
    }); //đẩy biến này lên home
    console.log(name);
  };

  // console.log(props.onSendActiveAnswerToBoxChat);
  return (
    <Fragment>
      <div className={classes.second}>
        <div
          className={`${classes.secondLeft} ${
            isOpenFormBoxChatInfoHandler ? classes.openFormBoxChatInfo : ""
          } `}
        >
          <div className={classes["top-right"]}>
            <div className={classes.topName}>
              <div className={classes.avatar} onClick={openFormUserInfomation}>
                <img src={props.onSendUserToBoxChat.avatar} alt="" />
              </div>
              <div className={classes.name}>
                <h2>{props.onSendUserToBoxChat.name}</h2>
                {props.onSendRoomToBoxChat.users.length > 2 ? (
                  <p>
                    <i className="far fa-user"></i>{" "}
                    {props.onSendRoomToBoxChat.users.length} thành viên
                  </p>
                ) : (
                  "Các bạn đã là bạn bè"
                )}
              </div>
            </div>
            {props.onSendRoomToBoxChat.group ? (
              <div className={classes.topFunction}>
                <i className="fas fa-user-plus" onClick={addMemberHandler}></i>
                <i
                  className="fas fa-video"
                  onClick={openFormCallVideoHandler}
                ></i>
                <i
                  className="far fa-address-card"
                  onClick={openFormBoxChatInfoHandler}
                ></i>
              </div>
            ) : (
              <div
                className={`${classes.topFunction} ${classes.topFunction_active}`}
              >
                <i
                  className="fas fa-video"
                  onClick={openFormCallVideoHandler}
                ></i>
              </div>
            )}
          </div>
          <div className={`${classes["center-right"]}`}>
            {messages.map((data, index) => {
              return (
                <div
                  ref={scrollRef}
                  className={`${classes.listChat} ${
                    data.sender === idLogin ? classes.message_own : ""
                  }`}
                  key={index}
                >
                  <Chat
                    data={data}
                    key={data._id}
                    own={data.sender === idLogin}
                    isOpenFormBoxChatInfoHandler={isOpenFormBoxChatInfoHandler}
                  />
                </div>
              );
            })}
            <div className={classes.emoji}>
              {showEmoji && <Picker onEmojiClick={onEmojiClick} />}
            </div>
          </div>
          <div className={classes["botom-right"]}>
            <div className={classes.toolbar}>
              <i className="bi bi-image">
                <input type="file" onChange={fileUploadHandler} multiple />
              </i>
              <i className="bi bi-paperclip">
                <input type="file" onChange={fileUploadHandler} multiple />
              </i>
            </div>
            <div className={classes["input-chat"]}>
              <input
                type="text"
                placeholder="Nhập tin nhắn của bạn"
                onChange={chatHandler}
                value={enteredChat}
              />
              <i
                className="far fa-paper-plane"
                onClick={SendMessageHandler}
              ></i>
              <i className="far fa-laugh-beam" onClick={showEmojiHandler}></i>
            </div>
          </div>
        </div>

        {/* {isOpenFormBoxChatInfoHandler && ( */}
        {props.onSendRoomToBoxChat.group && (
          <div
            onClick={handleClickOutside}
            ref={myRef}
            className={`${classes.secondRight} ${
              isOpenFormBoxChatInfoHandler ? classes.openFormBoxChatInfo : ""
            }`}
          >
            <div
              data-id=""
              className={`${classes.secondRightBoxChatInfo} ${
                isOpenFormBoxChatInfoHandler ? classes.openFormBoxChatInfo : ""
              }`}
            >
              <div className={classes.titleBoxChatInfo}>
                <h2>Thông tin nhóm</h2>
              </div>
              <div className={classes.groupNameAvatar}>
                <div className={classes.avatarBoxChatInfo}>
                  <img src={props.onSendUserToBoxChat.avatar} alt="" />
                </div>
                <div className={classes.nameBoxChatInfo}>
                  <p>{props.onSendUserToBoxChat.name}</p>
                </div>
              </div>
              <div className={classes.memberGroup}>
                <h6>
                  Thành viên nhóm ({props.onSendRoomToBoxChat.users.length})
                </h6>
                <div className={classes.listMember}>
                  {props.onSendRoomToBoxChat.users.map((user, index) => {
                    return (
                      <Member
                        user={user}
                        master={props.onSendRoomToBoxChat.roomMaster}
                        room={props.onSendRoomToBoxChat}
                        OpenFormRemoveMember={openRemoveMemberHandler} //nhận lệnh mở form remove member từ member
                        isCloseFormRemoveMember={isOpenFormRemoveMember} // nhận lệnh đóng form remove member từ form remove member
                        SendUserToBoxChat={ReceiveUserFromMember}
                        key={index}
                      />
                    );
                  })}
                </div>
              </div>
              <div className={classes.out_deleteGroup}>
                {props.onSendRoomToBoxChat.roomMaster === idLogin && (
                  <Fragment>
                    <div className={classes.outgroup} onClick={outGroupHandler}>
                      <i className="fas fa-sign-out-alt"></i>
                      <p>Rời nhóm</p>
                    </div>
                    <div
                      className={classes.deletegroup}
                      onClick={deleteGroupHandler}
                    >
                      <i className="far fa-trash-alt"></i>
                      <p>Xóa nhóm</p>
                    </div>
                  </Fragment>
                )}

                {props.onSendRoomToBoxChat.roomMaster !== idLogin && (
                  <Fragment>
                    <div className={classes.outgroup}>
                      <i className="fas fa-sign-out-alt"></i>
                      <p onClick={outGroupHandler}>Rời nhóm</p>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {
        <FormUserInfomation
          isFormInfomation={isFormInfomation}
          SendFalseToBoxChat={closeFormInformation}
          user={props.onSendUserToBoxChat}
          room={props.onSendRoomToBoxChat}
        ></FormUserInfomation>
      }
      {
        <FormAddMember
          isOpenFormAddGroup={isOpenFormAddGroup}
          onFormFalse={formfalseHandler}
          onSendRoomToAddMember={props.onSendRoomToBoxChat}
        />
      }
      {isOpenFormCallVideo ? (
        <FormCallVideo
          isFormVideoCall={isOpenFormCallVideo}
          onSendFormCallVideo={props.onSendRoomToBoxChat}
          onSendSocketToFormCallVideo={props.onSendSocketToBoxChat}
          onFormFalse={closeFormCallVideo}
          onSendRoomToCallVideo={props.onSendRoomToBoxChat}
          onReceiveFromCallVideo={receiveFromCallVideoHandler} //Nhận từ form call video
          onSendActiveAnswerToCallVideo={props.onSendActiveAnswerToBoxChat}
          onIsOpenFormCallVideo={isOpenFormCallVideo}
        />
      ) : null}
      {
        <FormOutGroup
          isFormOuGroup={isOpenFormOutGroup}
          onFormFalse={closeFormOutGroup}
          room={props.onSendRoomToBoxChat}
        ></FormOutGroup>
      }

      {
        <FormDeleteGroup
          isOpenFormDeleteGroup={isOpenFormDeleteGroup}
          onFormFalse={cancelFormDeleteGroup}
          room={props.onSendRoomToBoxChat}
        ></FormDeleteGroup>
      }

      {
        <FormRemoveMember
          isOpenFormRemoveMember={isOpenFormRemoveMember}
          onFormFalse={closeFormRemoveMember}
          userFromMember={userFromMember}
          room={props.onSendRoomToBoxChat}
        ></FormRemoveMember>
      }
    </Fragment>
  );
};
export default BoxChat;
