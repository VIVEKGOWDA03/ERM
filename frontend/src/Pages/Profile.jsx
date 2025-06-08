import { Camera, Mail, PhoneCall, User, Workflow } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  updateAdditionalDetails,
  updateProfilePicture,
} from "../store/auth-slice";
import toast from "react-hot-toast";
import Modal from "../Compontes/Modal";

const Profile = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [address, setAddress] = useState(user?.address || "");
  const [designation, setDesignation] = useState(user?.designation || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const profilePic = user?.profilePic;
  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpenModel, setIsOpenModel] = useState(false);

  // Adjust to use user.id or user._id (depending on your API)
  const userId = user?.id || user?._id;

  useEffect(() => {
    // Make sure user is fetched if not available
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  const handleImageUpload = (e) => {
    if (!userId) {
      console.warn("User ID not available. Cannot upload image.");
      return;
    }
    const file = e.target.files[0];
    console.log("File selected:", file);
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);
    // Optionally, log the FormData contents
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Optional: update local preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImg(reader.result);
    };

    console.log("Dispatching updateProfilePicture with userId:", userId);
    dispatch(updateProfilePicture({ userId, formData }))
      .unwrap()
      .then((response) => {
        toast.success("Uploaded Successfully");
      })
      .catch((error) => {
        toast.error("Upload failed");
      });
  };

  const handleDetailsUpdate = () => {
    if (!userId) {
      console.warn("User ID not available. Cannot update details.");
      return;
    }
    dispatch(
      updateAdditionalDetails({ userId, address, designation, phoneNumber })
    );
    closeModal();
    fetchUser();
  };

  const openModal = () => {
    setIsOpenModel(true);
  };

  const closeModal = () => {
    setIsOpenModel(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 ">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isLoading ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isLoading
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-6 shadow-xl rounded-lg z-10 p-4 border bg-white/20 backdrop-blur-sm">
            <div className="w-full flex justify-end">
              <button
                className="p-1 bg-green-300 rounded-md text-[12px] font-mono text-green-500"
                onClick={openModal}
              >
                Update
              </button>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {user?.userName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {user?.email}
              </p>
            </div>

            {user?.address && (
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {user?.address}
                </p>
              </div>
            )}
            {user?.designation && (
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Workflow className="w-4 h-4" /> Designation
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {user?.designation}
                </p>
              </div>
            )}
            {user?.phoneNumber && (
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" /> Phone
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {user?.phoneNumber}
                </p>
              </div>
            )}
          </div>

          <Modal
            className="bg-black bg-opacity-75 flex flex-col items-center justify-center"
            isOpen={isOpenModel}
            closeFn={closeModal}
          >
            <div className="w-fit h-fit bg-white rounded-md p-6">
              <h2 className="text-lg font-medium mb-4">Additional Details</h2>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 bg-base-200 rounded-lg border"
                placeholder="Enter address"
              />
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-4 py-2 bg-base-200 rounded-lg border mt-3"
                placeholder="Enter designation"
              />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 bg-base-200 rounded-lg border mt-3"
                placeholder="Enter phone number"
              />
              <button
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={handleDetailsUpdate}
              >
                Update Profile
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Profile;
