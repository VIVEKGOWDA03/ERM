import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { resetTokenAndCredentials } from "../store/auth-slice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProfileMenu({ profileName }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // console.log("ProfileMenu received profileName:", profileName);

  const handleLogout = () => {
    dispatch(resetTokenAndCredentials());
    toast.success("Logged out Successfully");
    navigate("/auth/login");
    sessionStorage.clear();
  };
  const chat = profileName ? profileName[0] : "A";

  return (
    <div>
      <Button
        className="font-bold lg:text-2xl font-mono"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <p className="w-10 mr-1 h-10 lg:text-2xl rounded-full bg-amber-200 font-bold font-caroplay flex justify-center items-center">
          {chat}{" "}
        </p>
        {/* {profileName} */}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
        {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
        <MenuItem className="font-mono" onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
