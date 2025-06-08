// src/Pages/Manager/ManagerProfile.jsx
import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";

const ManagerProfile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  // console.log(currentUser);

  if (!currentUser || currentUser.role !== "manager") {
    return (
      <Box sx={{ p: 4, color: "error.main", textAlign: "center" }}>
        Access Denied. This page is for managers only.
      </Box>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-100 font-roboto p-4 sm:p-6 md:p-10">
      <Box className="max-w-5xl mx-auto">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 6,
            overflow: "hidden",
          }}
        >
          <CardHeader
            title={
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Manager Profile
              </Typography>
            }
            subheader={
              <Typography
                variant="subtitle1"
                sx={{ color: "text.secondary", fontSize: "1rem" }}
              >
                Welcome, {currentUser.name}
              </Typography>
            }
            sx={{
              backgroundColor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "grey.300",
              px: 4,
              py: 3,
            }}
          />

          <CardContent sx={{ px: 4, py: 3 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                ["Name", currentUser.name],
                ["Email", currentUser.email],
                [
                  "Role",
                  currentUser.role
                    ? currentUser.role.charAt(0).toUpperCase() +
                      currentUser.role.slice(1)
                    : "N/A",
                ],
                ["Department", currentUser.department || "N/A"],
                [
                  "Seniority",
                  currentUser.seniority
                    ? currentUser.seniority.charAt(0).toUpperCase() +
                      currentUser.seniority.slice(1)
                    : "N/A",
                ],
              ].map(([label, value]) => (
                <Box key={label}>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                    gutterBottom
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: "text.primary",
                      fontSize: "1rem",
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              ))}
            </div>

            <Divider sx={{ my: 4 }} />

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
              More manager-specific details will be available here soon.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default ManagerProfile;
