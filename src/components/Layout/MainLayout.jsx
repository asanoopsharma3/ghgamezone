import React from 'react';
import Hero from '../Hero/Hero';
import Navbar from '../Navbar/Navbar';
import Categories from '../Categories/Categories';
import TrendingGames from '../TrendingGames/TrendingGames';
import Footer from '../Footer/Footer';
import LeaderBoard from '../Leaderboard/LeaderBoard';
import MobileNav from '../MobileNav/MobileNav';
import { useNavigate } from 'react-router-dom';
import './MainLayout.scss';

const MainLayout = ({ onGameClick, onSubscribeClick, onAuthClick, onPolicyClick }) => {
  const navigate = useNavigate();
  return (
    <div className="main-layout-wrapper">
      <Navbar onSubscribeClick={onSubscribeClick} />
      <Hero onExploreClick={onGameClick} onLeaderboardClick={() => navigate('/leaderboard')} />
      <div className="section1">
        <div className="top-grid">
          <div className="main-content">
            <Categories />
            <TrendingGames onGameClick={onGameClick} />
          </div>
          <div className="sidebar-content">
            <LeaderBoard />
          </div>
        </div>

        <div className="bottom-section">
          <Footer onPolicyClick={onPolicyClick} />
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default MainLayout;