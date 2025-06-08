import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Collapse } from "@mui/material";
import { X } from "lucide-react";

const Modal = ({ className, children, isOpen, closeFn }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed z-[999] top-0 left-0 right-0 bg-dark-green bg-opacity-85 w-full h-full flex ${className}`}
    >
      <button
        className="absolute top-1 right-4 w-11 h-11 z-[55]"
        onClick={closeFn}
        type="button"
      >
        {/* <img
          src="/assets/close.svg"
          alt="close"
          className="w-[48px] bg-slate-100 rounded-full h-[48px]"
        /> */}
        <p className="w-[48px] flex items-center bg-slate-100 rounded-full h-[48px]">
          <X className="w-full" />
        </p>
      </button>
      {children}
    </motion.div>
  );
};

export default Modal;
