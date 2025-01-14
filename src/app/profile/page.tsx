"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const getUserInfo = async () => {
    try {
      const res = await axios.get("/api/profile");
      console.log(res.data);
      setData(res.data);
      toast.success("User information fetched successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user information.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome to the Profile Page
        </h1>
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Logout
        </button>
        <button
          onClick={getUserInfo}
          className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Fetch User Info
        </button>

        {/* Display user info */}
        {data && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700">
              User Details
            </h2>
            <Link href={`/profile/${data.user._id}`} className="text-gray-600">
              <span className="font-medium">ID:</span> {data.user._id}
            </Link>
            {/* Add additional fields as needed */}
          </div>
        )}

        {/* Link to other pages or actions */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Want to edit your profile?{" "}
          <Link href="/edit-profile" className="text-blue-500 hover:underline">
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
