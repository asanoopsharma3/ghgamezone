import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
import "./UnsubscribeContent.scss";

const UnsubscribeContent = ({ onPolicyClick }) => {
  return (
    <div className="unsubscribe-page">
      <main className="unsubscribe-main">
        <Link to="/" className="back-home-btn">
          <FaHome />
          <span>Back to Home</span>
        </Link>
      </main>
      <Footer onPolicyClick={onPolicyClick} />
    </div>
  );
};

export default UnsubscribeContent;
