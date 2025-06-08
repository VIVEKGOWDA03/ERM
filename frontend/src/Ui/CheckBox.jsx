import * as React from "react";
import Checkbox from "@mui/material/Checkbox";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function Checkboxes({ checked, onChange }) {
  return (
    <div>
      {/* <Checkbox {...label} defaultChecked /> */}
      <Checkbox checked={checked} onChange={onChange} />
      {/* <Checkbox {...label} disabled /> */}
      {/* <Checkbox {...label} disabled checked /> */}
    </div>
  );
}
