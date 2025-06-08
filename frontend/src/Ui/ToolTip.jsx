import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
export default function BasicTooltip() {
  return (
    <>
      <Tooltip title="Edit">
        <IconButton color="primary" size="large">
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton color="error" size="large">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}
