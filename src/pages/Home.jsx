import Card from "../components/Cards";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Home = ({ type }) => {
  const [videos, setvideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`http://localhost:8800/api/video/${type}`, {
        withCredentials: true,
      });
      setvideos(res.data);
    };
    fetchVideos();
  }, [type]);
  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Home;
