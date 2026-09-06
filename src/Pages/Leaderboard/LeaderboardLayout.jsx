import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import LeaderboardContent from "./LeaderboardContent";
import MobileNav from "../../components/MobileNav/MobileNav";

const LeaderboardLayout = ({ onSubscribeClick, onAuthClick, onPolicyClick }) => {
  return (
    <div className="leaderboard-layout-wrapper">
      <Navbar onSubscribeClick={onSubscribeClick} />
      <LeaderboardContent onSubscribeClick={onSubscribeClick} onPolicyClick={onPolicyClick} />
      <MobileNav />
    </div>
  );
};

export default LeaderboardLayout;
