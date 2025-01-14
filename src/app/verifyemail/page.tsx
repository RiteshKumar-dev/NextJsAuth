"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string>(""); // Explicitly typed as string
  const [verify, setVerify] = useState<boolean>(false); // Explicitly typed as boolean
  const [error, setError] = useState<boolean>(false); // Explicitly typed as boolean

  const verifyUserEmail = useCallback(async () => {
    try {
      const res = await axios.post("/api/users/verifyemail", { token });
      console.log(res.data);
      setVerify(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data || "Error verifying email");
      } else {
        console.error("An unexpected error occurred:", err);
      }
      setError(true);
    }
  }, [token]); // Ensure token is included as a dependency

  useEffect(() => {
    // Extract token from URL
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, []);

  useEffect(() => {
    // Trigger verification when token is set
    if (token.length > 0) verifyUserEmail();
  }, [token, verifyUserEmail]);

  // Set the document title
  useEffect(() => {
    document.title = "Verify Email - My App";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verify Your Email
        </h1>

        {token ? (
          verify ? (
            <div className="text-center">
              <p className="text-green-600 font-semibold">
                Your email has been successfully verified!
              </p>
              <Link
                href="/login"
                className="mt-4 inline-block text-blue-500 hover:underline"
              >
                Go to Login
              </Link>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 font-semibold">
                Verification failed. Please try again or contact support.
              </p>
            </div>
          ) : (
            <p className="text-gray-600 text-center">Verifying your email...</p>
          )
        ) : (
          <p className="text-center text-gray-600">
            No token found in the URL. Please check the link and try again.
          </p>
        )}
      </div>
    </div>
  );
}
