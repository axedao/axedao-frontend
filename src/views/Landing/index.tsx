import './landing.scss';
import { useState } from 'react';
import Header from './components/Header';
import { Backdrop, Button, Link, Paper } from '@material-ui/core';
import Shell from './shell.png';
import Footer from './components/Footer';
import { DiscordLink, GithubLink, TwitterLink } from 'src/constants';
import TwitterIcon from './images/twitter.svg';
import DiscordIcon from './images/icon_discord.svg';
import GithubIcon from './images/icon_github.svg';
import Otter01 from './images/otter_01.png';
import CloseIcon from './images/icon_24x24_close.svg';
import WhiteList from '../WhiteList';


//
import WelcomeSection from "./components/WelcomeSection" 
import AxeProSection from "./components/AxeProSection" 
import HowWorksSection from "./components/HowWorksSection" 
import StakingSection from "./components/StakingSection" 
import DifferentSection from "./components/DifferentSection" 
import LiquiditySection from "./components/LiquiditySection" 
import JoinCommunitySection from "./components/JoinCommunitySection" 
// 


function Landing() {
  const [open, setOpen] = useState(false);

  return (
    <div className="landing-page">
      <Header />
      <WelcomeSection/>
      <AxeProSection/>
      <HowWorksSection/>
      <StakingSection/>
      <DifferentSection/>
      <LiquiditySection/>
      <JoinCommunitySection/>
      <Footer />
      <Backdrop open={open} className="whitelist-check">
        <div className="whitelist-container">
          <WhiteList />
          <div className="close-modal-button" onClick={() => setOpen(false)}>
            <img src={CloseIcon} />
          </div>
        </div>
      </Backdrop>
    </div>
  );
}

export default Landing;
