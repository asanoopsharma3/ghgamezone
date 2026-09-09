import React from "react";
import "./BrandLogo.scss";

const BrandLogo = ({ size = 42, className = "" }) => {
  return (
    <span className={`brand-logo ${className}`.trim()}>
      <img src="/logo1.png" alt="" className="brand-logo-mark" style={{ height: size }} />
      <span className="brand-logo-text" aria-label="THEGameio">
        <span className="brand-logo-the">THE</span>
        <span className="brand-logo-name">Gameio</span>
      </span>
    </span>
  );
};

export default BrandLogo;
