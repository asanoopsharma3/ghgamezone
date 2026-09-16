import React from "react";
import UnsubscribeLayout from "./UnsubscribeLayout";

const Unsubscribe = ({ onSubscribeClick, onPolicyClick }) => {
  return (
    <UnsubscribeLayout
      onSubscribeClick={onSubscribeClick}
      onPolicyClick={onPolicyClick}
    />
  );
};

export default Unsubscribe;
