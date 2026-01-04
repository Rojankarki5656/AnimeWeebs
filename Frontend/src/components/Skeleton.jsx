import React from "react";

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse w-full ${className}`}>
      <div className="h-full bg-gray-600 w-full"></div>
    </div>
  );
};

export default Skeleton;
