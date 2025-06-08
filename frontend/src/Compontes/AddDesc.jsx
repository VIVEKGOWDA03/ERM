import React, { useState } from "react";
import { updateCompanyDescription } from "../store/CompanySlice/CompanySlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Modal } from "@mui/material";

const AddDesc = ({ companyId, companyName, isOpen, closeFn }) => {
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  //   console.log(companyId, "id");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyId) {
      toast.error("Invalid company ID!");
      return;
    }

    if (!description.trim()) {
      toast.error("Description cannot be empty!");
      return;
    }

    try {
      const resultAction = await dispatch(
        updateCompanyDescription({ companyId, description })
      );

      if (updateCompanyDescription.fulfilled.match(resultAction)) {
        toast.success(`${companyName} requirement added`);
        closeFn();
      } else {
        toast.error(
          resultAction.payload || "Failed to update company description"
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeFn}
      className="bg-black bg-opacity-75 flex flex-col items-center justify-center"
    >
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">
        <h2 className="text-2xl lg:text-4xl font-mono font-semibold text-center mb-4">
          Add{" "}
          <span className="bg-yellow-300 text-black px-1 rounded">
            {companyName}
          </span>{" "}
          Description
        </h2>
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border font-mono text-2xl border-gray-300 p-6 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-2xl font-mono text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors w-full"
          >
            Save
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddDesc;
