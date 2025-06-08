import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { formatEndDate } from "../../Config";
import EnginnersOverview from "./EnginnersOverview";
import ProjectsOverview from "./ProjectsOverview";
import { CustomCard } from "../../Config/Custom";
import { fetchAllEngineers } from "../../store/Slice";
import { fetchAllProjects } from "../../store/Slice/ProjectsSlice";
import { fetchAllAssignments } from "../../store/Slice/AssignmentSlice";
import ManagerAnalytics from "./ManagerAnalytics";

// --- NO SHADCN IMPORTS HERE ---

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { users, engineers, isLoading, error } = useSelector(
    (state) => state.data
  );
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { assignments } = useSelector((state) => state.assignments);

  useEffect(() => {
    // Fetch all data when the component mounts if the user is a manager
    if (user && user.role === "manager") {
      dispatch(fetchAllEngineers());
      dispatch(fetchAllProjects());
      dispatch(fetchAllAssignments());
    }
  }, [dispatch, user]);

  // if (!user || user.role !== "manager") {
  //   return (
  //     <div className="p-4 text-red-500 bg-red-100 border border-red-400 rounded-md">
  //       Access Denied. You must be a manager to view this dashboard.
  //     </div>
  //   );
  // }

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-700 bg-gray-50 rounded-md">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-100 border border-red-400 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {" "}
      {/* Added bg-gray-50 for overall page */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Manager Dashboard
      </h1>
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {" "}
        {/* Increased gap for better spacing */}
        <CustomCard className="p-6">
          {" "}
          {/* Increased padding for cards */}
          <h3 className="text-lg font-semibold text-gray-700">
            Total Engineers
          </h3>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">
            {engineers.length}
          </p>
        </CustomCard>
        <CustomCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Active Projects
          </h3>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">
            {projects.filter((p) => p.status === "active").length}
          </p>
        </CustomCard>
        <CustomCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Assignments
          </h3>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">
            {assignments.length}
          </p>
        </CustomCard>
      </div>
      <ManagerAnalytics/>

      {/* Engineers Overview */}
      <EnginnersOverview
        users={users}
        engineers={engineers}
        assignments={assignments}
      />
      {/* Projects Overview */}
      <ProjectsOverview
        users={users}
        assignments={assignments}
        projects={projects}
      />
    </div>
  );
};

export default ManagerDashboard;
