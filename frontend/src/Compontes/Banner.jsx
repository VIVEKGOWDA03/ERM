import React, { useEffect } from "react";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import BadgeIcon from "@mui/icons-material/Badge";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCompanies } from "../store/CompanySlice/CompanySlice";
import { getStudents } from "../store/Slice/StudentListSlice";

const Banner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.companies);
  const companyOptions = companies?.map((company) => company.name) || [];
  const { students } = useSelector((state) => state.studentList);
  // console.log(students, "list");

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getStudents());
  }, [dispatch]);
  return (
    <div className=" w-full flex mt-10 gap-4 flex-wrap justify-betwee">
      <div className="" onClick={() => navigate("/home/company-list")}>
        <div className="Blocks p-4 flex justify-around w-[220px] h-[100px] bg-amber-100 rounded-2xl ">
          <p className="w-full flex justify-center items-center">
            <BusinessRoundedIcon className="w-ful" />
          </p>
          <p className="w-full h-full flex  justify-center flex-col pr-[2%]">
            <span className="text-[22px] w-full flex justify-end font-medium">
              {companyOptions.length}
            </span>
            <span className="text-[22px] w-full flex justify-end font-medium">
              Companies
            </span>
          </p>
        </div>
      </div>
      <div className="" onClick={() => navigate("/home/requirements")}>
        <div className="Blocks p-4 flex justify-around w-[220px] h-[100px] bg-amber-100 rounded-2xl ">
          <p className="w-full flex justify-center items-center">
            <AssignmentTurnedInRoundedIcon className="w-ful" />
          </p>
          <p className="w-full h-full flex justify-center  flex-col pr-[2%]">
            <span className="text-[22px] w-full flex justify-end font-medium">
              {companyOptions.length}
            </span>
            <span className="text-[22px] w-full flex justify-end font-medium">
              Requirements
            </span>
          </p>
        </div>
      </div>
      <div className="">
        <div
          className="Blocks p-4 flex justify-around w-[220px] h-[100px] bg-amber-100 rounded-2xl "
          onClick={() => navigate("/home/studentlist")}
        >
          <p className="w-full flex justify-center items-center">
            <SchoolRoundedIcon className="w-ful" />
          </p>
          <p className="w-full h-full flex justify-center  flex-col pr-[2%]">
            <span className="text-[22px] w-full flex justify-end font-medium">
              {students.length}
            </span>
            <span className="text-[22px] w-full flex justify-end font-medium">
              Students
            </span>
          </p>
        </div>
      </div>
      {/* <div className="Blocks p-4 flex justify-around w-[220px] h-[100px] bg-amber-100 rounded-2xl "  onClick={() => navigate("/home/add-employee")}>
        <p className="w-full flex justify-center items-center">
          <BadgeIcon size={40} className="w-ful" />
        </p>
        <p className="w-full h-full flex justify-center  flex-col pr-[2%]">
          <span className="text-[22px] w-full flex justify-end font-medium">
            100
          </span>
          <span className="text-[22px] w-full flex justify-end font-medium">
            Employees
          </span>
        </p>
      </div> */}
    </div>
  );
};

export default Banner;
