import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import axios from "axios";
import { IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSelector } from "react-redux";
const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: gray;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  outline: none;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  padding: 5px;
  width: 100%;
`;

const Comments = ({ videoId }) => {
  const root = process.env.REACT_APP_URL;
  const [value, setValue] = useState("");
  const [newPost, setnewPost] = useState("");

  const post = async () => {
    const newPost = await axios.post(
      `${root}comment`,
      { videoId, comment: value },
      { withCredentials: true }
    );
    setValue("");
    setnewPost(newPost.data);
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${root}comment/get/${videoId}`);
      setData(res.data);
    };
    fetchData();
  }, [videoId]);

  return (
    <Container>
      <NewComment>
        <Avatar />
        <Input
          value={value}
          placeholder="Add a comment..."
          onSubmit={post}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <IconButton aria-label="post" onClick={post} color="primary">
          <ChevronRightIcon />
        </IconButton>
      </NewComment>
      <div style={{ padding: "5px" }}>
        {newPost && <Comment key={newPost._id} comment={newPost} />}
        {data.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </Container>
  );
};

export default Comments;
