import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  fetchFailure,
  fetchStart,
  fetchSuccess,
  handleDisikes,
  handleLikes,
  handleViews,
} from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscribe } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";
import ReactPlayer from "react-player";
import { current } from "@reduxjs/toolkit";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;
const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;
const Title = styled.div`
  margin: 5px 0px;
  font-weight: 600px;
  font-size: 24px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: ${({ theme }) => theme.textSoft};
`;

const Hr = styled.hr`
  margin: 12px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: ${({ theme }) => theme.bgLighter};
  border-radius: 20px;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: ${(props) =>
    props.type === "Subscribed"
      ? ({ theme }) => theme.soft
      : ({ theme }) => theme.textSoft};
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 50px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const root = process.env.REACT_APP_URL;
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const [channel, setChannel] = useState({});
  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];

  const likeVideo = async () => {
    await axios.put(`${root}user/like/${path}`, {}, { withCredentials: true });
    dispatch(handleLikes(currentUser._id));
  };

  const dislikeVideo = async () => {
    await axios.put(
      `${root}user/dislike/${path}`,
      {},
      { withCredentials: true }
    );
    dispatch(handleDisikes(currentUser._id));
  };

  const handleEnd = async () => {
    await axios.put(`${root}video/view/${path}`);
    dispatch(handleViews());
  };

  const handleSubscribe = async () => {
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(
          `${root}user/unsub/${channel._id}`,
          {},
          { withCredentials: true }
        )
      : await axios.put(
          `${root}user/sub/${channel._id}`,
          {},
          { withCredentials: true }
        );
    dispatch(subscribe(channel._id));
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        dispatch(fetchStart());
        const videoRes = await axios.get(`${root}video/find/${path}`);
        const channelInfo = await axios.get(
          `${root}user/find/${videoRes.data.userId}`
        );
        setChannel(channelInfo.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (e) {
        dispatch(fetchFailure(e));
      }
    };
    fetch();
  }, [path]);

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame
            src={currentVideo.videoUrl}
            muted
            playsinline
            autoplay
            controls
            onEnded={handleEnd}
          />
          {/* <ReactPlayer url={currentVideo.videoUrl} /> */}
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>
            {currentVideo.views} views {format(currentVideo.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={likeVideo}>
              {currentVideo.likes?.includes(currentUser._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
              {currentVideo.likes.length}
            </Button>
            <Button onClick={dislikeVideo}>
              {currentVideo.dislikes?.includes(currentUser._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}
              {currentVideo.dislikes.length}
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.image} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>{currentVideo.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe
            onClick={handleSubscribe}
            type={
              currentUser.subscribedUsers.includes(channel._id)
                ? "Subscribed"
                : "Subscribe"
            }
          >
            {currentUser.subscribedUsers.includes(channel._id)
              ? "Subscribed"
              : "Subscribe"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={path} />
      </Content>
      <Recommendation tags={currentVideo.tags} videoId={currentVideo._id} />
    </Container>
  );
};

export default Video;
