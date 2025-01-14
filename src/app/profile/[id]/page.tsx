"use client";
import React from "react";

// Define the type for the props
interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProfilePage: React.FC<ProfilePageProps> = async ({ params }) => {
  // Await the resolution of the params Promise
  const { id } = await params;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to the Profile Detail Page
        </h1>
        <p className="text-center text-gray-600 mb-4">This page is {id}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
