"use client";

import React from "react";
import toast from "react-hot-toast";

const ProfilePage = ({ params }: any) => {
  // Use React's use() to unwrap params
  const unwrappedParams: any = React.use(params);

  // Display a toast when the page is rendered
  React.useEffect(() => {
    // toast.success(`Welcome to the Profile Page for ID: ${unwrappedParams.id}`);
  }, [unwrappedParams.id]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to the Profile Detail Page
        </h1>
        <p className="text-center text-gray-600 mb-4">
          This page is {unwrappedParams.id}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
