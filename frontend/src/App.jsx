import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./tailwind.css";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./Compontes/Error";

const App = () => {
  return (
    <ErrorBoundary>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div>
        <Outlet />
      </motion.div>
    </AnimatePresence>
    </ErrorBoundary>
  );
};

export default App;
