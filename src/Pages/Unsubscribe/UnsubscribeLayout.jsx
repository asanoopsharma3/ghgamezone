import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import UnsubscribeContent from "./UnsubscribeContent";
import MobileNav from "../../components/MobileNav/MobileNav";

const UnsubscribeLayout = ({ onSubscribeClick, onPolicyClick }) => {
  return (
    <div className="unsubscribe-layout-wrapper">
      <Navbar onSubscribeClick={onSubscribeClick} />
      <UnsubscribeContent onPolicyClick={onPolicyClick} />
      <MobileNav />
    </div>
  );
};

export default UnsubscribeLayout;
