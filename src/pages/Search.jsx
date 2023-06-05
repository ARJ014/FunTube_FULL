import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Cards from "../components/Cards";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Label = styled.h3`
  text-align: center;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.text};
`;

const Search = () => {
  const root = process.env.REACT_APP_URL;
  const query = useLocation().search;
  const [video, setVideo] = useState([]);

  useEffect(() => {
    const search = async () => {
      const res = await axios.get(`${root}video/search${query}`);
      setVideo(res.data);
    };
    search();
  }, [query]);

  return (
    <Container>
      {video.length !== 0 &&
        video.map((data) => <Cards key={data._id} video={data} />)}
      {video.length === 0 && <Label></Label>}
    </Container>
  );
};

export default Search;
