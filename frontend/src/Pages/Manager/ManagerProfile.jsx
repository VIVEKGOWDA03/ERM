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

  if (!currentUser || currentUser.role !== "manager") {
    return (
      <Box sx={{ p: 4, color: "error.main", textAlign: "center" }}>
        Access Denied. This page is for managers only.
      </Box>
    );
  }

  return (
    <Box className="container mx-auto p-6 md:p-10">
      <Card
        sx={{
          maxWidth: "900px",
          margin: "0 auto",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardHeader
          title={
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              My Profile
            </Typography>
          }
          subheader={
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Details for {currentUser.name}
            </Typography>
          }
          sx={{
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "grey.300",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            padding: 3,
          }}
        />
        <CardContent sx={{ padding: 3, "& > *:not(:last-child)": { mb: 3 } }}>
          <Box>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              gutterBottom
            >
              Name
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: "medium", color: "text.primary" }}
            >
              {currentUser.name}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              gutterBottom
            >
              Email
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: "medium", color: "text.primary" }}
            >
              {currentUser.email}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              gutterBottom
            >
              Role
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: "medium", color: "text.primary" }}
            >
              {currentUser.role?.charAt(0)?.toUpperCase() +
                currentUser.role?.slice(1) || "N/A"}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              gutterBottom
            >
              Department
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: "medium", color: "text.primary" }}
            >
              {currentUser.department || "N/A"}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              gutterBottom
            >
              Seniority
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: "medium", color: "text.primary" }}
            >
              {currentUser.seniority?.charAt(0)?.toUpperCase() +
                currentUser.seniority?.slice(1) || "N/A"}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            More manager-specific details can be added here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManagerProfile;
