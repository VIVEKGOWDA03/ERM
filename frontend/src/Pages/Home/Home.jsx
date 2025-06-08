import React, { useEffect, useState } from "react";
import Banner from "../../Compontes/Banner";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../store/CompanySlice/CompanySlice";
import IconCloud from "../../Ui/icon-cloud";
import DoughnutChart from "../../Ui/DoughnutChart ";
const Home = () => {
  const { companies, loading, error } = useSelector((state) => state.companies);

  // Get 8 random companies from the companies array
  const randomCompanies = companies
    ? companies
        .slice()
        .sort(() => 0.5 - Math.random())
        .slice(0, 8)
    : [];

  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const profileName = user?.userName;
  // console.log(companies, "companies");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const iconSlugs = [
    "amazon",
    "google",
    "apple",
    "meta",
    "accenture",
    "tcs",
    "infosys",
    "wipro",
    "cognizant",
    "sap",
    "salesforce",
  ];

  return (
    <div className="absolute -0  mt-[80px --10  h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
      <div className="font-bold pb-[500px] scrollbar-hidden h-full bg-[#F2EDF3 w-full overflow-auto px-[5%]  bg-amber-10 font-mono text-[32px] font-cairoPla">
        <div className="font-bold w-full  items-star  flex-wra  flex  font-mon text-[32px] font-cairoPlay">
          <div className="w-full">
            <img
              className="w-ful h-[130px] flex  object-contain"
              src="/assets/logonovanex.jpeg"
            ></img>
            Welcome {profileName}!
            <p className="font-light text-[18px] font-cairoPlay ">Dashboard</p>
          </div>
          <div className=" w-full flex justify-end items-end ">
            <Banner />
          </div>
        </div>

        <div className=" w-full h-full flex justify-center items-center flex-wrap">
          <IconCloud iconSlugs={iconSlugs} />
          <DoughnutChart className="pt-10" companies={randomCompanies} />
        </div>
      </div>
    </div>
  );
};

export default Home;
