import React, {  useEffect } from "react";
import classes from "./home.module.scss";
import { useState } from "react";
import addFriendAPI from "../../api/addFriendAPI";
import SenderRequest from "./SenderRequest";
import ReceiverRequest from "./ReceiverRequest";
import { useSelector } from "react-redux";
const ListSenderRequest = (props) => {

  const loggedInUser = useSelector((state) => state.user.current);
  const idLogin = loggedInUser._id;
  const [arrayListSenderRequest, setArrayListSenderRequest] = useState([]);
  const [arrayListReceiverRequest, setArrayListReceiverRequest] = useState([]);


  //lấy ds ai gửi kết bạn
  useEffect(() => {
    const fetchListSenderRequest = async () => {
      try {
        const requestListSenderRequest = await addFriendAPI.getListSenderRequest(
          {}
        );
        setArrayListSenderRequest(requestListSenderRequest.data);
      
      } catch (error) {
        console.log(error);
      }
    };
    fetchListSenderRequest();
  }, []);

  //lấy ds đã gửi kb cho ai
  useEffect(() => {
    const fetchListReceiverRequest = async () => {
      try {
        const requestListReceiverRequest = await addFriendAPI.getListReceiver({});
        setArrayListReceiverRequest(requestListReceiverRequest.data);
      
      } catch (error) {
        console.log(error);
      }
    };
    fetchListReceiverRequest();
  }, []);

  // console.log(arrayListReceiverRequest);
  // useEffect(() => {

  // }, [reload])

  useEffect(()=>{
    props.onSendSocketToListSenderRequest.current.on('friend-request-status',async (data)=>{
      console.log("Thằng "+ data.name +" vừa gửi cho mày yêu cầu kết bạn kìa !!!");
      try {
        const requestListSenderRequest = await addFriendAPI.getListSenderRequest(
          {}
        );
        setArrayListSenderRequest(requestListSenderRequest.data);
      
      } catch (error) {
        console.log(error);
      }
    })
  },[])

  useEffect(()=>{
    props.onSendSocketToListSenderRequest.current.on('cancel-friend-request',async (data)=>{
      console.log("Thằng "+ data.name +" vừa gửi cho mày yêu cầu kết bạn kìa !!!");
      try {
        const requestListSenderRequest = await addFriendAPI.getListSenderRequest(
          {}
        );
        setArrayListSenderRequest(requestListSenderRequest.data);
        
      } catch (error) {
        console.log(error);
      }
    })
  },[])

  //này là socket của người vừa đc gửi kết bạn
  useEffect(()=>{
    props.onSendSocketToListSenderRequest.current.on('my-request-to-friend',async (data)=>{
      try {
        const requestListReceiverRequest = await addFriendAPI.getListReceiver(
          {}
        );
        setArrayListReceiverRequest(requestListReceiverRequest.data);
      
      } catch (error) {
        console.log(error);
      }
    })
  },[])

  useEffect(()=>{
    props.onSendSocketToListSenderRequest.current.on('friend-request-accept-status',async (data)=>{
      try {
        const requestListReceiverRequest = await addFriendAPI.getListReceiver(
          {}
        );
        setArrayListReceiverRequest(requestListReceiverRequest.data);
        console.log("ListSender: " + data.room._id)
        props.onSendSocketToListSenderRequest.current
          .emit('join-room-after-acceptFriend', data)
        
      } catch (error) {
        console.log(error);
      }
    })
  },[])


  useEffect(()=>{
    props.onSendSocketToListSenderRequest.current.on('friend-request-decline-status',async (data)=>{
      try {
        const requestListReceiverRequest = await addFriendAPI.getListReceiver(
          {}
        );
        setArrayListReceiverRequest(requestListReceiverRequest.data);
      
      } catch (error) {
        console.log(error);
      }
    })
  },[])


  return (
    <div className={classes["right-phonebook"]}>
      <div className={classes.title}>
        <i className="fas fa-user-plus"></i>
        <p>Danh sách kết bạn</p>
      </div>
      <div className={classes.body}>
        <div className={classes.invites}>
          <div className={classes.text}>
            <p>Lời mời kết bạn ({arrayListSenderRequest.length})</p>
          </div>

          {arrayListSenderRequest.map((data) => {
            return <SenderRequest data={data} idLogin={idLogin} key={data._id} />;
          })}
        </div>


        <div className={classes.sendInvites}>
          <div className={classes.text}>
              <p>Lời mời đã gửi ({arrayListReceiverRequest.length})</p>
          </div>
          
          {arrayListReceiverRequest.map((data) => {
           return <ReceiverRequest data={data}></ReceiverRequest>
          })}
        </div>
      </div>
      
    </div>
  );
};

export default ListSenderRequest;
