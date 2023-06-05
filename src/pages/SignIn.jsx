import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { signInWithPopup } from "firebase/auth";
import { GoogleProvider, auth } from "../Firebase";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 85vh;
  justify-content: center;
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  display: flex;
  gap: 5px;
  align-items: center;
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};

  &:hover {
    background-color: ${({ theme }) => theme.bg};
  }
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;
const SignIn = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const res = await axios.post(
        "http://localhost:8800/api/auth/signin",
        {
          email: name,
          password: pass,
        },
        { withCredentials: true }
      );
      dispatch(loginSuccess(res.data));
      navigate("/");
      console.log(res.data);
    } catch (e) {
      dispatch(logout());
    }
  };

  const root = process.env.REACT_APP_URL;
  const GoogleLogin = async () => {
    console.log(root);
    signInWithPopup(auth, GoogleProvider)
      .then((result) => {
        axios
          .post(
            `${root}auth/google`,
            {
              name: result.user.displayName,
              email: result.user.email,
              image: result.user.photoURL,
            },
            { withCredentials: true }
          )
          .then((res) => {
            dispatch(loginSuccess(res.data));
            navigate("/");
          });
      })
      .catch((err) => {
        dispatch(loginFailure(err));
      });
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to FunTube</SubTitle>
        <Input
          placeholder="username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setPass(e.target.value)}
        />
        <Button onClick={handleLogin}>Sign in</Button>

        <Title>or</Title>
        <Button onClick={GoogleLogin}>
          <GoogleIcon /> SignIn with Google
        </Button>

        <Title>or</Title>
        <SubTitle>Register Now!!</SubTitle>
        <Input
          placeholder="username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setPass(e.target.value)}
        />
        <Button>Sign up</Button>
      </Wrapper>
      <More>
        English
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
