import React from "react";
// Assuming CustomBadge, CustomCard from Config/Custom.js
import { CustomBadge, CustomCard } from "../../Config/Custom";

// ProjectsOverview component now receives projects as a prop
const ProjectsOverview = ({ projects }) => { // Removed 'users' prop as it's not strictly needed for manager name
                                             // if managerId is already populated in project object
  // Helper function to get status badge styling
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800"; // Fallback
    }
  };

  return (
    <CustomCard className="p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Projects Overview
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Manager
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Start Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                End Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Required Skills
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr
                  key={project._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {project.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CustomBadge
                      className={getStatusBadgeStyle(project.status)}
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </CustomBadge>
                  </td>
                  {/* Access manager name directly as it's populated by the backend */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {project.managerId ? project.managerId.name : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(project.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(project.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.requiredSkills?.map((skill, index) => (
                        <CustomBadge key={index} variant="outline">
                          {skill}
                        </CustomBadge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CustomCard>
  );
};

export default ProjectsOverview;
