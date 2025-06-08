import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index";
import dataReducer from "./Slice/index"; // 
import assignmentReducer from "./Slice/AssignmentSlice";
import projectReducer from "./Slice/ProjectsSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    projects: projectReducer,
    assignments: assignmentReducer, 
  },
});

export default store;
