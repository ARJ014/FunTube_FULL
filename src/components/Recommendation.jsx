import Cards from "./Cards";
import axios from "axios";
import { connectStorageEmulator } from "firebase/storage";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  flex: 2;
`;

const Recommendation = ({ tags, videoId }) => {
  const root = process.env.REACT_APP_URL;
  const [video, setVideo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${root}video/tags?tags=${tags.join(",")}`);
      setVideo(res.data);
    };
    fetchData();
  }, [tags]);

  return (
    <Container>
      {video.map(
        (data) =>
          data._id !== videoId && (
            <Cards key={data._id} type="sm" video={data} />
          )
      )}
    </Container>
  );
};

export default Recommendation;
