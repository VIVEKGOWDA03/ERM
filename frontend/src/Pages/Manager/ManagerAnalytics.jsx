import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'; // Recharts for charting
import { Card, CardContent, CardHeader, Typography, Box, CircularProgress } from '@mui/material'; // Material-UI for card layout

const COLORS = ['#0088FE', '#FFBB28', '#00C49F', '#FF8042', '#AF19FF']; // Colors for charts

const ManagerAnalytics = () => {
  // Select data from the correct Redux slices
  const { projects, isLoading: projectsLoading, error: projectsError } = useSelector((state) => state.projects);
  // We need all engineers and their assignments to calculate utilization.
  // The assignments loaded into state.assignments are usually 'myAssignments' for engineer dashboard
  // For manager, fetchAllAssignments should get all assignments, and fetchAllEngineers will get all engineers.
  // Assuming assignments in state.assignments from `fetchAllAssignments` are comprehensive.
  const { engineers, isLoading: engineersLoading, error: engineersError } = useSelector((state) => state.data);
  const { assignments, isLoading: assignmentsLoading, error: assignmentsError } = useSelector((state) => state.assignments);

  const [projectStatusData, setProjectStatusData] = useState([]);
  const [engineerUtilizationData, setEngineerUtilizationData] = useState([]);

  const isLoading = projectsLoading || engineersLoading || assignmentsLoading;
  const error = projectsError || engineersError || assignmentsError;

  useEffect(() => {
    if (projects.length > 0) {
      // Calculate project status data
      const planningCount = projects.filter(p => p.status === 'planning').length;
      const activeCount = projects.filter(p => p.status === 'active').length;
      const completedCount = projects.filter(p => p.status === 'completed').length;

      setProjectStatusData([
        { name: 'Planning', value: planningCount },
        { name: 'Active', value: activeCount },
        { name: 'Completed', value: completedCount },
      ]);
    }

    if (engineers.length > 0 && assignments.length > 0) {
      // Calculate engineer utilization data
      const utilizationMap = new Map();

      engineers.forEach(engineer => {
        let totalAllocated = 0;
        const now = new Date();

        assignments.forEach(assignment => {
          // Ensure projectId and engineerId are populated objects, not just IDs
          const assignmentEngineerId = assignment.engineerId?._id || assignment.engineerId;

          if (String(assignmentEngineerId) === String(engineer._id)) {
            const startDate = new Date(assignment.startDate);
            const endDate = new Date(assignment.endDate);

            // Consider an assignment "active" if its duration overlaps with 'now'
            if (now >= startDate && now <= endDate) {
              totalAllocated += assignment.allocationPercentage;
            }
          }
        });

        // Cap allocation at maxCapacity for display if it exceeds (e.g., due to overlapping assignments)
        const effectiveAllocation = Math.min(totalAllocated, engineer.maxCapacity);
        const available = engineer.maxCapacity - effectiveAllocation;
        const utilizationPercentage = engineer.maxCapacity > 0 ? (effectiveAllocation / engineer.maxCapacity) * 100 : 0;

        let status = 'Underutilized';
        if (utilizationPercentage > 75) {
          status = 'Highly Utilized';
        }
        if (utilizationPercentage >= 95) { // Often 100% or slightly over is considered overloaded
          status = 'Overloaded';
        }
        if (utilizationPercentage < 25) {
          status = 'Very Low Utilization';
        }


        utilizationMap.set(engineer._id, {
          name: engineer.name,
          'Allocated Capacity': effectiveAllocation, // Raw percentage allocated
          'Max Capacity': engineer.maxCapacity,      // Engineer's max capacity
          'Available Capacity': available,
          'Utilization (%)': parseFloat(utilizationPercentage.toFixed(2)), // Percentage utilization
          status: status // Categorical status
        });
      });
      setEngineerUtilizationData(Array.from(utilizationMap.values()));
    }
  }, [projects, engineers, assignments]); // Recalculate if any source data changes


  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        Loading analytics data...
      </Box>
    );
  }

  if (error) {
    return <Box sx={{ p: 4, color: 'error.main', textAlign: 'center' }}>Error loading analytics: {error}</Box>;
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary' }}>
        Team Analytics
      </Typography>

      {/* Project Status Overview */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <CardHeader title={<Typography variant="h5" sx={{ fontWeight: 'semibold' }}>Project Status Distribution</Typography>} />
        <CardContent>
          {projectStatusData.length > 0 && projectStatusData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
              No project data available for charts.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Engineer Utilization Overview */}
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardHeader title={<Typography variant="h5" sx={{ fontWeight: 'semibold' }}>Engineer Utilization</Typography>} />
        <CardContent>
          {engineerUtilizationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={engineerUtilizationData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Allocation %', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                <Legend />
                <Bar dataKey="Allocation Capacity" fill="#8884d8" />
                <Bar dataKey="Available Capacity" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
              No engineer or assignment data available for utilization charts.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManagerAnalytics;
