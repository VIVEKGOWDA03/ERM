import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ companies }) => {
  // Extract company names & their counts
  const labels = companies.map((company) => company.name);
  const dataValues = companies.map((company) => company.count || 1);

  const data = {
    labels,
    datasets: [
      {
        label: "Companies",
        data: dataValues,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="max-w-sm mx-auto pt-10">
      <h3 className="text-xl font-semibold text-center mb-4">
        Company Distribution
      </h3>
      <Doughnut data={data} />
    </div>
  );
};

export default DoughnutChart;
