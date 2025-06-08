import React from "react";

export function SpotlightPreview({
  images,
  isSmallScreen,
  showSplash,
  currentImage,
}) {
  return (
    <div
      className={`${
        showSplash && isSmallScreen ? "justify-between" : "justify-center"
      } flex flex-col h-full items-center pt-[2%] overflow-hidden gap-10`}
    >
      {/* <img
        className="w-full min-h-[200px]"
        src="/assets/logonovanex.jpeg"
      ></img> */}
      <p className="text-6xl font-sans"> ERM</p>
    </div>
  );
}
