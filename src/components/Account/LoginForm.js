


import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaPhone } from "react-icons/fa6";
import { MdEmail, MdOutlineMail } from "react-icons/md";
import { GoogleLogin } from "@react-oauth/google";
import apiClient from "@/api/client";
import useAuth from "@/auth/useAuth";
import LogoInformation from "./LogoInformation";

const LoginForm = ({ 
  isOpen, 
  setIsOpen, 
  setIsVerificationModalOpen,
  mobile,
  setMobile,
  email,
  setEmail,
  isEmailMode,
  setIsEmailMode
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { logIn } = useAuth();

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMobile(value);
    setError(value.length !== 10 ? "Mobile number must be 10 digits" : "");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    setError(!emailRegex.test(value) ? "Enter a valid email address" : "");
  };

  const toggleMode = () => {
    setIsEmailMode(!isEmailMode);
    setError("");
    setMobile("");
    setEmail("");
  };

  const handleSendOtp = async () => {
    const url = `/user/${
      isEmailMode ? "login-with-email" : "login-with-mobile"
    }`;

   
    try {
      setLoading(true);
      const response = await apiClient.post(url, {
        [isEmailMode ? "email" : "phone"]: isEmailMode ? email : mobile,
      });

    

      if (!response.ok) {
        toast.error(response?.data?.message || "Failed to send OTP");
        return;
      }
      
      toast.success(response?.data?.message);
      setIsVerificationModalOpen(); // This will close login and open OTP modal
    } catch (error) {
      toast.error(error?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    
    try {
      const response = await apiClient.post("/user/auth-google", {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        jwtToken: idToken,
      });

      if (response?.ok) {
        toast.success(response.data.message?.en || "Login successful");
        logIn(response?.data?.accessToken);
        setIsOpen(false);
      } else {
        toast.error(response.data.message?.en || "Google login failed");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginError = () => {
    toast.error("Google Login Failed");
  };

  const isMobileValid = !isEmailMode && mobile.length === 10;
  const isEmailValid = isEmailMode && email && !error;
  const isDisabled = !isMobileValid && !isEmailValid;

  return (
    <>
      <LogoInformation />
      
      <form onSubmit={(e) => e.preventDefault()}>
        {/* <div className="mb-5">
          <label className="text-gray-600 text-sm font-medium mb-2 block">
            {isEmailMode ? "Email Address" : "Mobile Number"}
          </label>

          <div
            className={`flex items-center bg-white border rounded-lg px-4 transition w-full ${
              error
                ? "border-red-400"
                : isMobileValid || isEmailValid
                  ? "border-green-500"
                  : "border-gray-300"
            }`}
          >
            {!isEmailMode ? (
              <div className="flex items-center gap-2 pr-3 border-r border-gray-300">
                <span>🇮🇳</span>
                <span className="text-sm text-gray-700 font-medium">+91</span>
              </div>
            ) : (
              <div className="flex items-center border-gray-300">
                <MdOutlineMail className="text-gray-700 text-xl" />
              </div>
            )}

            <input
              type={isEmailMode ? "email" : "text"}
              value={isEmailMode ? email : mobile}
              onChange={isEmailMode ? handleEmailChange : handleMobileChange}
              maxLength={isEmailMode ? undefined : 10}
              inputMode={isEmailMode ? "email" : "numeric"}
              placeholder={
                isEmailMode ? "Enter email address" : "Enter mobile number"
              }
              className="flex-1 py-3 px-3 bg-white text-gray-700 text-sm focus:outline-none rounded-lg"
            />
          </div>

          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div> */}

        {/* <button
          type="button"
          onClick={handleSendOtp}
          disabled={isDisabled || loading}
          className={`bg-btnBg-primary text-white w-full font-bold py-3 px-4 focus:outline-none focus:shadow-outline transition ${
            !isDisabled && !loading
              ? "hover:opacity-90 cursor-pointer"
              : "opacity-60 cursor-not-allowed"
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or continue with</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div> */}

           {/* NEW: static heading above Google button */}
        <div className="text-center mb-5">
      
          <p className="text-sm text-gray-500 mt-1">
            Sign in to continue shopping handcrafted treasures
          </p>
        </div>

        <div className="w-full mb-3">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={handleGoogleLoginError}
            size="large"
            text="continue_with"
            logo_alignment="center"
            shape="rectangular"
            width={"100%"}
          />
        </div>

        {/* NEW: static content below Google button */}
        <div className="mt-5 space-y-2 text-center">
          <p className="text-xs text-gray-500">
            Secure sign-in powered by Google
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400">
            <span>✔ No spam</span>
            <span>✔ One-tap login</span>
            <span>✔ Safe & secure</span>
          </div>
        </div>

        {/* <button
          type="button"
          onClick={toggleMode}
          className="w-full cursor-pointer rounded-lg bg-gray-100 p-3 flex items-center justify-center gap-3 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all"
        >
          {isEmailMode ? (
            <>
              <FaPhone size={20} />
              Continue with Phone
            </>
          ) : (
            <>
              <MdEmail size={20} />
              Continue with Email
            </>
          )}
        </button> */}

        <p className="text-xs text-gray-500 mt-5 text-center">
          By continuing, you agree to our Terms & Conditions.
        </p>
      </form>
    </>
  );
};

export default LoginForm;