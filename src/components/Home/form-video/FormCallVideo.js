import React, { Fragment } from "react";
import classes from "./formCallvideo.module.scss";
import { useState, useEffect, useRef } from "react";
import tung from "../../../assets/tung.jpg";
import addFriendAPI from "../../../api/addFriendAPI";
import { useSelector } from "react-redux";
import messageAPI from "../../../api/messageAPI";

// import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";
// import TextField from "@material-ui/core/TextField";
// import AssignmentIcon from "@material-ui/icons/Assignment";
// import PhoneIcon from "@material-ui/icons/Phone";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
const FormCallVideo = (props) => {
  //Lấy thông tin từ redux
  const loggedInUser = useSelector((state) => state.user.current);
  const [activeCalling, setActiveCalling] = useState(false);
  const [user, setUser] = useState(null);
  const [UserNeedCall, setUserNeedCall] = useState(null);
  const [isOpenForm, setIsOpenForm] = useState("");
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isFromBoxChat, setIsFromBoxChat] = useState(false);
  const [myVdoStatus, setMyVdoStatus] = useState(true);
  const [myMicStatus, setMyMicStatus] = useState(true);
  const [userVdoStatus, setUserVdoStatus] = useState();
  const [userMicStatus, setUserMicStatus] = useState();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  //navigator
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream; //undefined
      });
  }, []);

  useEffect(() => {
    const nameMessUserId = props.onSendRoomToCallVideo?.users.find(
      (m) => m !== loggedInUser.idLogin
    );
    const fetchGetUser = async () => {
      try {
        const requestGetUser = await addFriendAPI.getUser({
          userID: nameMessUserId,
        });
        //setUser(requestGetUser.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetUser();
  }, [props.onSendRoomToCallVideo]);

  useEffect(() => {
    if (props.isFormVideoCall || props.onSendActiveAnswerToCallVideo) {
      setIsOpenForm(classes.active);
    } else {
      setIsOpenForm("");
    }
  }, [props.isFormVideoCall || props.onSendActiveAnswerToCallVideo]);

  const cancelHandler = (e) => {
    e.preventDefault();
    setIsOpenForm("");
    props.onFormFalse(false);
    //connectionRef.current.destroy();
    // window.location.reload();
  };

  useEffect(() => {
    const callVideo = async () => {
      try {
        const res = await messageAPI.CallVideo({
          idRoom: props.onSendFormCallVideo?._id,
        });
      } catch (error) {
        console.log(error);
      }
    };
    callVideo();
  }, [isOpenForm]);

  useEffect(() => {
    props.onSendSocketToFormCallVideo.current.on(
      "updateUserMedia",
      ({ type, currentMediaStatus }) => {
        if (currentMediaStatus !== null || currentMediaStatus !== []) {
          console.log("dong 102" + currentMediaStatus);
          switch (type) {
            case "video":
              setUserVdoStatus(currentMediaStatus);
              break;
            case "mic":
              setUserMicStatus(currentMediaStatus);
              break;
            default:
              setUserMicStatus(currentMediaStatus[0]);
              setUserVdoStatus(currentMediaStatus[1]);
              break;
          }
        }
      }
    );
  }, []);

  useEffect(() => {
    console.log(userMicStatus + "dong 118");
  }, [userMicStatus]);

  useEffect(() => {
    props.onSendSocketToFormCallVideo.current.on(
      "me",
      (socketId, UserAnother) => {
        setMe(socketId);
        setUserNeedCall(UserAnother);
      }
    );
  }, [props.onSendSocketToFormCallVideo]);

  useEffect(() => {
    //Gửi biến receiving lên box chat
    if (props.isOpenFormCallVideo) {
      props.onReceiveFromCallVideo({
        receivingCall: receivingCall,
        callAccepted: callAccepted,
        name: loggedInUser.name,
        activeCalling: activeCalling,
      });
    }
    console.log(loggedInUser.name);
  }, [
    receivingCall,
    callAccepted,
    name,
    activeCalling,
    props.onIsOpenFormCallVideo,
  ]);

  useEffect(() => {
    props.onSendSocketToFormCallVideo.current.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setAvatar(data.avatar);
      setCallerSignal(data.signal);
    });
  }, [props.onSendActiveAnswerToCallVideo]);

  useEffect(() => {
    if (props.onSendActiveAnswerToCallVideo) {
      // navigator.mediaDevices
      //   .getUserMedia({ video: true, audio: true })
      //   .then((stream) => {
      //     setStream(stream);
      //     myVideo.current.srcObject = stream; //undefined
      //   });
      setCallAccepted(true);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (data) => {
        console.log("DONG 175");
        props.onSendSocketToFormCallVideo.current.emit("answerCall", {
          signal: data,
          to: caller,
          type: "both",
          myMediaStatus: [myMicStatus, myVdoStatus],
        });
      });
      peer.on("stream", (stream) => {
        userVideo.current.srcObject = stream;
      });

      if (callerSignal != null) {
        peer.signal(callerSignal);
      }
      connectionRef.current = peer;
    }
  }, [, callerSignal]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      props.onSendSocketToFormCallVideo.current.emit("callUser", {
        userToCall: UserNeedCall?.socketId,
        signalData: data,
        from: me,
        name: loggedInUser.name,
        avatar: loggedInUser.avatar,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    connectionRef.current = peer;

    props.onSendSocketToFormCallVideo.current.emit("callVideoToUser", {
      socketId: UserNeedCall?.socketId,
      name: loggedInUser.name,
      avatar: loggedInUser.avatar,
    });
    props.onSendSocketToFormCallVideo.current.on("callAccepted", (signal) => {
      setTimeout(() => {
        setCallAccepted(true);
        peer.signal(signal);
        props.onSendSocketToFormCallVideo.current.emit("updateMyMedia", {
          type: "both",
          currentMediaStatus: [myMicStatus, myVdoStatus],
        });
      }, 800);
    });
    setActiveCalling(true);
  };

  const leaveCall = async () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  const microHandler = () => {
    setMyMicStatus((currentStatus) => {
      props.onSendSocketToFormCallVideo.current.emit("updateMyMedia", {
        type: "mic",
        currentMediaStatus: !currentStatus,
      });
      stream.getAudioTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  const cameraHandler = () => {
    setMyVdoStatus((currentStatus) => {
      props.onSendSocketToFormCallVideo.current.emit("updateMyMedia", {
        type: "video",
        currentMediaStatus: !currentStatus,
      });
      stream.getVideoTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };
  // console.log("usermic " + userMicStatus);
  // console.log("Mymic " + myMicStatus);
  console.log(UserNeedCall);
  return (
    <div className={classes.modalFormAddFriend}>
      <div className={` ${classes.backdrop} ${isOpenForm}`}></div>
      <div className={` ${classes.viewFormAddFriend} ${isOpenForm}`}>
        <div className={classes.header}>
          <h2>Gọi Video Call</h2>
          <div className={classes.cancel} onClick={cancelHandler}>
            <div className={classes.blur}>
              <i className="bi bi-x"></i>
            </div>
          </div>
        </div>
        <div className={classes.body}>
          <div className={classes.container}>
            <div className={classes.videoContainer}>
              <div className="Myvideo">
                {stream && (
                  <div>
                    <img
                      src={loggedInUser.avatar}
                      className={classes.imgMyAvatar}
                      style={{
                        width: "180px",
                        height: "180px",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "15%",
                        left: "5%",
                        opacity: `${myVdoStatus ? "0" : "1"}`,
                      }}
                    />
                    <video
                      playsInline
                      muted
                      ref={myVideo}
                      autoPlay
                      style={{
                        width: "300px",
                        opacity: `${myVdoStatus ? "1" : "0"}`,
                      }}
                    />

                    <p>{loggedInUser.name}</p>
                  </div>
                )}
              </div>
              <div className="Uservideo">
                {callAccepted && !callEnded ? (
                  <div>
                    <img
                      src={avatar === "" ? UserNeedCall?.avatar : avatar}
                      className={classes.imgUserAvatar}
                      style={{
                        width: "180px",
                        height: "180px",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "15%",
                        right: "14%",
                        opacity: `${userVdoStatus ? "0" : "1"}`,
                      }}
                    />
                    <video
                      playsInline
                      ref={userVideo}
                      autoPlay
                      style={{
                        width: "300px",
                        opacity: `${userVdoStatus ? "1" : "0"}`,
                      }}
                    ></video>
                    {!userMicStatus && (
                      <i
                        style={{
                          position: "absolute",
                          top: "10%",
                          left: "50%",
                          padding: "0.3rem",
                          backgroundColor: "#fefefebf",
                          fontSize: "20px",
                        }}
                        className="fa fa-microphone-slash"
                        aria-hidden="true"
                        aria-label="microphone muted"
                      ></i>
                    )}
                    {name === "" ? UserNeedCall?.name : name}
                  </div>
                ) : null}
              </div>
            </div>
            <div className={classes.groupFunction}>
              <div
                className={classes.micro}
                onClick={microHandler}
                tabIndex="0"
              >
                <i
                  className={`fa fa-microphone${myMicStatus ? "" : "-slash"}`}
                  style={{ transform: "scaleX(-1)" }}
                  aria-label={`${myMicStatus ? "mic on" : "mic off"}`}
                  aria-hidden="true"
                ></i>
              </div>
              <div
                className={classes.camera}
                onClick={cameraHandler}
                tabIndex="0"
              >
                {myVdoStatus ? (
                  <i class="fas fa-video"></i>
                ) : (
                  <i class="fas fa-video-slash"></i>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={classes.footer}>
          {callAccepted && !callEnded ? (
            <button className={classes.call} onClick={leaveCall}>
              Tắt
            </button>
          ) : (
            <button
              className={classes.call}
              onClick={() => callUser(UserNeedCall?.socketId)}
              tabIndex="0"
            >
              Gọi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCallVideo;
