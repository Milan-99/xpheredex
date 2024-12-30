import React from 'react';
import styled from 'styled-components';
import background from './BG_Landing_Top.webp'; // Import your background image
// import { FaTwitter, FaGithub, FaTelegram } from 'react-icons/fa'; // Import Font Awesome icons

import twitterLogo from './twx.svg';  // Import logos
import githubLogo from './Github.svg';
import telegramLogo from './Telegram.svg';
import left from './left.svg';
import right from './right.svg';


const Container = styled.div`
  width: 100vw;
  height: 89vh;
  position: relative; /* Required for overlay positioning */
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  overflow: hidden; /* Prevent scrolling */
  margin-top:-100px
  margin-bottom: -120px
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* Dim the background */
  z-index: 1; /* Ensure overlay is above the background */
`;

const Content = styled.div`
  position: relative; /* Use relative positioning inside a flex container */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 200px;
  color: white;
  z-index: 2; /* Ensure content is above the overlay */
`;

const Title = styled.h1`
  font-family: 'Archivo'; /* Example font, adjust as needed */
  font-size: 48px;
  margin: 0;
`;

const Subtitle = styled.p`
font-family: 'Archivo'; /* Example font, adjust as needed */
  font-size: 25px;
  margin: 10px 0;
`;

const SocialLinks = styled.div`
  margin-top: 0px;
  display: flex;
  gap: 15px;

  img {
    width: 40px;  /* Set the fixed width */
    height: 40px; /* Set the fixed height */
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.2); /* Add hover effect to enlarge the icons */
    }
  }
`;

// New CSS for left and right images
const LeftImage = styled.img`
  position: absolute;
  bottom: -180px;
  left: 0;
  width: 330px; /* Adjust width as needed */
  z-index: 2; /* Ensure it stays above overlay */
`;

const RightImage = styled.img`
  position: absolute;
  bottom: -180px;
  right: 8px;
  width: 330px; /* Adjust width as needed */
  z-index: 2; /* Ensure it stays above overlay */
`;

export default function Home() {
  return (
    <Container>
      <Overlay />
      <Content>
        <Title>Dopin Protocol</Title>
        <Subtitle>
          Swap, earn, and deploy in one click on the leading decentralized <br></br>
          crypto trading protocol on Xphere chain.
        </Subtitle>
        <SocialLinks>
          <a href="https://x.com/Dopinprotocol" target="_blank" rel="noopener noreferrer">
            <img src={twitterLogo} alt="Twitter" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <img src={githubLogo} alt="GitHub" />
          </a>
          <a href="https://t.me/dopin" target="_blank" rel="noopener noreferrer">
            <img src={telegramLogo} alt="Telegram" />
          </a>
        </SocialLinks>
        <LeftImage src={left} alt="Left Image" />
        <RightImage src={right} alt="Right Image" />
      </Content>
    </Container>
  );
}
