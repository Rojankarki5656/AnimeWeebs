import React from "react";
import { FaFire, FaHeart, FaPlayCircle, FaCheckCircle, FaStar, FaTv } from "react-icons/fa";

const Heading = ({ children, className, icon }) => {
  const getIcon = () => {
    switch(icon) {
      case 'fire': return <FaFire className="text-orange-500" />;
      case 'heart': return <FaHeart className="text-pink-500" />;
      case 'play': return <FaPlayCircle className="text-emerald-500" />;
      case 'check': return <FaCheckCircle className="text-blue-500" />;
      case 'star': return <FaStar className="text-yellow-500" />;
      case 'tv': return <FaTv className="text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icon && (
        <div className="p-2 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50">
          {getIcon()}
        </div>
      )}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">
          {children}
        </h1>
        <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1.5"></div>
      </div>
    </div>
  );
};

export default Heading;