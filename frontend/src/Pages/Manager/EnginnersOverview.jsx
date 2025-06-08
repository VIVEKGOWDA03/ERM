import React from "react";
import { useNavigate } from "react-router-dom";

import { CustomBadge, CustomCard, CustomProgress } from "../../Config/Custom";
import { formatEndDate } from "../../Config"; 



const EnginnersOverview = ({ engineers }) => {
  const navigate = useNavigate();

  const engineersWithCalculatedAvailability = engineers.map((engineer) => {
 
    let latestProjectEndDate = null;
    if (engineer.activeAssignments && engineer.activeAssignments.length > 0) {
      const endDatesMs = engineer.activeAssignments.map((assignment) =>
        new Date(assignment.endDate).getTime()
      );
      const maxEndDateMs = Math.max(...endDatesMs);
      latestProjectEndDate = new Date(maxEndDateMs);
    }

    let availableFromDate = "Immediately";
    if (latestProjectEndDate) {
      const nextDay = new Date(latestProjectEndDate);
      nextDay.setDate(nextDay.getDate() + 1); 
      availableFromDate = nextDay.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // Calculate available capacity from maxCapacity and currentAllocatedPercentage (provided by backend)
    const engineerMaxCapacity = Number(engineer.maxCapacity) || 0;
    const allocated = engineer.currentAllocatedPercentage || 0;
    const availableCapacity = engineerMaxCapacity - allocated;

    return {
      ...engineer, // Keep all properties from the backend
      availableFromDate: availableFromDate,
      availableCapacity: availableCapacity, // Frontend calculates this from backend provided data
    };
  });

  return (
    <CustomCard className="p-6   mt-8 shadow-lg rounded-lg mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Engineer Capacity Overview
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
                Department
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Seniority
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]"
              >
                Current Allocation
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Available Capacity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Available From
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {engineersWithCalculatedAvailability.length > 0 ? (
              engineersWithCalculatedAvailability.map((engineer) => (
                <tr
                  key={engineer._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {engineer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {engineer.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CustomBadge variant="secondary">
                      {engineer.seniority?.charAt(0)?.toUpperCase() +
                        engineer.seniority?.slice(1) || "N/A"}
                    </CustomBadge>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <CustomProgress
                        value={engineer.currentAllocatedPercentage}
                        className="w-[100px]"
                      />
                      <span className="text-sm text-gray-600">
                        {engineer.currentAllocatedPercentage?.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`font-semibold ${
                        engineer.availableCapacity < 0
                          ? " text-red-600"
                          : engineer.availableCapacity < 30
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {engineer.availableCapacity.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {engineer.availableFromDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/engineers/${engineer._id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/assignments/new?engineerId=${engineer._id}`)
                      }
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8" 
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No engineers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CustomCard>
  );
};

export default EnginnersOverview;
