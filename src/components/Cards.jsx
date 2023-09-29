import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { format } from "timeago.js";
const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "15px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 8px;
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "100px" : "202px")};
  border-radius: 15px;
  flex: 1;
`;

const Details = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  height: 36px;
  width: 36px;
  border-radius: 50%;
  background-color: gray;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div`
  color: ${({ theme }) => theme.text};
`;
const Title = styled.h1`
  font-size: 16px;
  font-weight: 500px;
`;
const ChannelName = styled.div`
  font-size: 14px;
  margin-top: 9px;
  color: ${({ theme }) => theme.textSoft};
`;
const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Cards = ({ type, video }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(
        `https://funtubebackend.onrender.com/api/user/find/${video.userId}`
      );
      setUser(res.data);
    };
    fetchVideos();
  }, [video.userId]);

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <Container type={type}>
        <Image type={type} src={video.imageUrl} />
        <Details type={type}>
          <ChannelImage type={type} src={user.image} />
          <Texts>
            <Title>{video.title} </Title>
            <ChannelName>{user.name}</ChannelName>
            <Info>
              {video.views} views {format(video.createdAt)}
            </Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default Cards;
