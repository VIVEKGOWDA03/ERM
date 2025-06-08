import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import {
  Home,
  FormInputIcon,
  ListCheckIcon,
  LogOut,
  MenuIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { resetTokenAndCredentials } from "../store/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // console.log(user.role);

  const toggleDrawer = (status) => () => {
    setOpen(status);
  };

  const handleLogout = () => {
    dispatch(resetTokenAndCredentials());
    toast.success("Logged out Successfully");
    sessionStorage.clear();
    navigate("/auth/login");
  };

  return (
    <div className="relative">
      {/* Button to open sidebar */}
      <IconButton
        onClick={toggleDrawer(true)}
        className="text-blue-600 bg-slate-200"
      >
        <MenuIcon size={28} />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        className="font-mono text-white"
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: "#2E3B4E", // Dark background color
            color: "#fff", // Text color
            paddingTop: "20px",
          },
        }}
      >
        <List>
          <ListItem
            button={true}
            onClick={() => {
              navigate("/home/page");
              toggleDrawer(false)();
            }}
            className="flex items-center gap-2 p-3 hover:bg-indigo-600 rounded-lg transition-colors"
          >
            <Home size={24} />
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem
            button={true}
            onClick={() => {
              navigate("/home/profile");
              toggleDrawer(false)();
            }}
            className="flex items-center gap-2 p-3 hover:bg-indigo-600 rounded-lg transition-colors"
          >
            <ImProfile size={24} />
            <ListItemText primary="Profile" />
          </ListItem>

          <ListItem
            button={true}
            onClick={() => {
              navigate("/home/company-list");
              toggleDrawer(false)();
            }}
            className="flex items-center gap-2 p-3 hover:bg-indigo-600 rounded-lg transition-colors"
          >
            <BusinessRoundedIcon />
            <ListItemText primary="Companies List" />
          </ListItem>

          <ListItem
            button={true}
            onClick={() => {
              navigate("/home/studentform");
              toggleDrawer(false)();
            }}
            className="flex items-center gap-2 p-3 hover:bg-green-600 rounded-lg transition-colors"
          >
            <FormInputIcon />
            <ListItemText primary="Candidate Form" />
          </ListItem>

          <ListItem
            button={true}
            onClick={() => {
              navigate("/home/studentlist");
              toggleDrawer(false)();
            }}
            className="flex items-center gap-2 p-3 hover:bg-indigo-600 rounded-lg transition-colors"
          >
            <ListCheckIcon />
            <ListItemText primary="Candidate List" />
          </ListItem>

          {/* Uncomment if needed */}
          {user.role === "admin" && (
            <ListItem
              button={true}
              onClick={() => {
                navigate("/home/add-employee");
                toggleDrawer(false)();
              }}
              className="flex items-center gap-2 p-3 hover:bg-green-600 rounded-lg transition-colors"
            >
              <MenuIcon size={24} />
              <ListItemText primary="Add Employee" />
            </ListItem>
          )}

          <ListItem
            button={true}
            onClick={handleLogout}
            className="flex items-center gap-2 p-3 hover:bg-red-600 rounded-lg transition-colors"
          >
            <LogOut size={24} />
            <ListItemText primary="Log Out" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
