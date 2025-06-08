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
<div className="relative h-screen w-full overflow-hidden">

  {/* Background Grid Pattern */}
  <div className="absolute inset-0 -z-20 bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]" />

  {/* Radial Gradient Overlay */}
  <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]" />

  {/* Foreground Content */}
  <div className="relative z-10 w-full h-full flex bg-white">

    {/* Splash Screen Section */}
    <div
      className={`${
        showSplash && isSmallScreen ? "flex w-full" : "hidden"
      } lg:flex items-center justify-center w-1/2 px-12 box-border bg-white`}
    >
      <div className="w-full flex flex-col items-center justify-center text-center h-full overflow-hidden">
        <SpotlightPreview
          images={images}
          isSmallScreen={isSmallScreen}
          showSplash={showSplash}
          currentImage={currentImage}
        />
      </div>
    </div>

    {/* Main Content Section */}
    <div
      className={`${
        !showSplash || !isSmallScreen ? "flex" : "hidden"
      } flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white`}
    >
      <Outlet />
    </div>
    
  </div>
</div>

  );
};

export default Authlayout;

// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import { SpotlightPreview } from "../Ui/Spotlights";
// import RetroGrid from "../Ui/retro-grid";
// import { LampContainer } from "../Ui/Lamp";

// const Authlayout = () => {
//   const [showSplash, setShowSplash] = useState(false);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const images = ["/assets/logos/trolley.png", "/assets/logos/bucket.png"];
//   const [currentImage, setCurrentImage] = useState(0);

//   useEffect(() => {
//     // Show splash only if it's the user's first visit
//     const hasVisited = localStorage.getItem("hasVisited");
//     if (!hasVisited) {
//       setShowSplash(true);
//       localStorage.setItem("hasVisited", "true");
//     }
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prevImage) => (prevImage + 1) % images.length); // Cycle through images
//     }, 2000); // Change image every 2 seconds

//     return () => clearInterval(interval); // Cleanup the interval on component unmount
//   }, [images.length]);

//   useEffect(() => {
//     if (window.innerWidth < 1024) {
//       setIsSmallScreen(true); // Set to true for small screens
//     }
//   }, []);

//   useEffect(() => {
//     if (showSplash && isSmallScreen) {
//       const timer = setTimeout(() => {
//         setShowSplash(false);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [showSplash, isSmallScreen]);

//   return (
//     <div className="w-full h-screen overflow-hidden flex bg-purple-10 ">
//       {/* Splash Screen Section */}
//       <LampContainer
//         children="💻ERM"
//         className="text-4xl font-inter text-white  text-center"
//       />

//       {/* Main Content Section */}
//       <div
//         className={`${
//           !showSplash || !isSmallScreen ? "flex" : "hidden"
//         } flex bg-red-20 bg-blac relative flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8`}
//       >
//         {/* <Outlet className="z-20" /> */}
//       </div>
//     </div>
//   );
// };

// export default Authlayout;
