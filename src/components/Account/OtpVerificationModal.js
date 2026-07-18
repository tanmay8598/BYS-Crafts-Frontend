import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiClient from "@/api/client";
import useAuth from "@/auth/useAuth";
import LogoInformation from "./LogoInformation";

const OTPVerificationModal = ({
  email,
  setEmail,
  mobile,
  setMobile,
  isEmailMode,
  setIsEmailMode,
  setIsVerificationModalOpen,
  setIsOpen,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoader, setResendLoader] = useState(false);
  const { logIn } = useAuth();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = async (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const updatedOtp = [...otp];

      if (!otp[index] && index > 0) {
        updatedOtp[index - 1] = "";
        document.getElementById(`otp-${index - 1}`).focus();
      } else {
        updatedOtp[index] = "";
      }
      setOtp(updatedOtp);
    }
  };

  const otpValue = otp.join("");

  const handleVerifyProfile = async () => {
    if (otpValue.length === 0) {
      toast.error("Please enter the OTP");
      return;
    }
    if (otpValue.length === 4) {
      const payload = {
        [isEmailMode ? "email" : "phone"]: isEmailMode ? email : mobile,
        otp: otpValue,
      };
      // console.log("payload of verify", payload )

      try {
        setVerifyLoading(true);
        const response = await apiClient.post(`/user/verify`, payload);
        // console.log("repsonse of verify ", response )

        if (!response.ok) {
          toast.error(response?.data?.message || "Verification Failed");
          return;
        }

        logIn(response?.data?.accessToken);
        toast.success(response?.data?.message || "Login successful");

        // Reset states
        if (isEmailMode) {
          setEmail("");
        } else {
          setMobile("");
        }
        setOtp(["", "", "", ""]);
        setIsEmailMode(false);
        setIsVerificationModalOpen(false);

        // Check for redirect to checkout
        const shouldRedirect = localStorage.getItem("redirectToCheckout");
        if (shouldRedirect === "true") {
          localStorage.removeItem("redirectToCheckout");
          window.location.href = "/checkout";
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error(error?.message || "Verification Failed");
      } finally {
        setVerifyLoading(false);
      }
    }
  };

  const handleResendCode = async () => {
    setResendLoader(true);
    try {
      const url = `/user${isEmailMode ? "/resend-otp" : "/resend-mobile-otp"}`;

      // console.log("url of verify resend", url)

      const response = await apiClient.post(url, {
        [isEmailMode ? "email" : "phone"]: isEmailMode ? email : mobile,
      });
      // console.log("repsonse of verify resend", response )

      if (!response.ok) {
        throw new Error("Failed to resend OTP");
      }
      setResendTimer(180);
      toast.success(response?.data?.message || "OTP resent successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to resend OTP");
    } finally {
      setResendLoader(false);
    }
  };

  return (
    <>
      <LogoInformation />

      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-2">
          {isEmailMode ? "Email Verification" : "Mobile Verification"}
        </h2>

        <p className="text-gray-500 text-center mb-6 text-sm">
          We've sent a 4-digit code to your {isEmailMode ? "email" : "mobile"}.
          Enter it below to verify your account.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-8">
        {otp.map((digit, index) => (
          <input
            id={`otp-${index}`}
            key={index}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-14 text-center text-lg font-medium rounded-lg bg-white border border-gray-300 focus:border-btnBg-primary focus:ring-2 focus:ring-btnBg-primary/30 outline-none transition-all"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleVerifyProfile}
        disabled={verifyLoading}
        className={`bg-btnBg-primary text-white w-full font-bold py-3 px-4 focus:outline-none focus:shadow-outline transition ${
          verifyLoading
            ? "opacity-60 cursor-not-allowed"
            : "hover:opacity-90 cursor-pointer"
        }`}
      >
        {verifyLoading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Verifying...
          </div>
        ) : (
          "Verify"
        )}
      </button>

      <div className="mt-6 text-sm flex justify-center gap-2 text-gray-500">
        <span>Didn't receive the code?</span>
        {resendTimer > 0 ? (
          <span className="text-gray-400 font-medium">
            Resend in {resendTimer}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendLoader}
            className="text-btnBg-primary font-medium hover:opacity-80 hover:underline cursor-pointer transition"
          >
            {resendLoader ? "Sending..." : "Resend"}
          </button>
        )}
      </div>
    </>
  );
};

export default OTPVerificationModal;
