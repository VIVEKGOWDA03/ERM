import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { SpotlightPreview } from "../Ui/Spotlights";
import RetroGrid from "../Ui/retro-grid";

const Authlayout = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const images = ["/assets/logos/trolley.png", "/assets/logos/bucket.png"];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Show splash only if it's the user's first visit
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowSplash(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length); // Cycle through images
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [images.length]);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSmallScreen(true); // Set to true for small screens
    }
  }, []);

  useEffect(() => {
    if (showSplash && isSmallScreen) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSplash, isSmallScreen]);

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]">
        <div className="w-full h-screen overflow-hidden flex bg-purple-10 ">
          {/* Splash Screen Section */}
          <div
            className={`${
              showSplash && isSmallScreen ? "flex w-full px-0" : "hidden"
            } bg-blak lg:flex items-center justify-center w-1/2 px-12 box-border`}
          >
            <div className="w-full flex flex-col items-center overflow-hidden justify-center text-center h-[100vh]">
              <p className="text-4xl font-bold font-rubikVinyl  text-center">
                💻Engineering Resource <br /> Management System
              </p>
            </div>
          </div>

          {/* Main Content Section */}
          <div
            className={`${
              !showSplash || !isSmallScreen ? "flex" : "hidden"
            } flex   relative flex-1 items-center justify-center bg- px-4 py-12 sm:px-6 lg:px-8`}
          >
            <Outlet className="z-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authlayout;
