import React from 'react';

// This component creates a generic pulsating shimmer effect.
// It can be used as a background for loading placeholders.
const Shimmer = ({ className = "" }) => {
  return (
    <div
      className={`animate-shimmer relative overflow-hidden bg-gray-200 rounded-md
                  before:absolute before:inset-0 before:-translate-x-full
                  before:animate-[shimmer_1.5s_infinite]
                  before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent
                  ${className}`}
    >
      {/* Content will be placed on top of this shimmer if needed, or this div itself acts as the shimmer */}
    </div>
  );
};

export default Shimmer;