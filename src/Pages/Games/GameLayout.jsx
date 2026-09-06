import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import GameHero from './GameHero';
import MobileNav from '../../components/MobileNav/MobileNav';

const GameLayout = ({ onGameClick, onBuyAttemptsClick, onAuthClick }) => {
  return (
    <div className="game-layout-wrapper">
      <Navbar onSubscribeClick={onBuyAttemptsClick} />
      <GameHero
        onGameClick={onGameClick}
        onBuyAttemptsClick={onBuyAttemptsClick}
      />
      <MobileNav />
    </div>
  );
};

export default GameLayout;
