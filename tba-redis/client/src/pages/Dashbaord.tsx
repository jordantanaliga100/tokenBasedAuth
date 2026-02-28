/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"; // ✨ 1. Import useState
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
// ✨ Import mo rito 'yung mga UI components mo (Button, Input, Modal/Dialog)
import { ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const Dashboard = () => {
  const {
    user,
    logout,
    requestVerification,
    verifyEmail,
    isVerifying,
    successMessage,
  } = useAuth(); // ✨ 2. Add verification methods
  const navigate = useNavigate();

  // ✨ 3. Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    try {
      logout();
      navigate("/a");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // ✨ 4. Verification Handlers
  const handleSendOTP = async () => {
    try {
      const res = (await requestVerification()) as any;
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to send code");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("OTP", otp);
      console.log("OTP type", typeof otp);

      verifyEmail(otp);

      setIsModalOpen(false); // Close modal on success

      setMessage("");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Invalid Code");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ✨ SUCCESS POPUP MESSAGE ✨ */}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md mb-4 animate-fade-in">
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}
      {/* ⚠️ VERIFICATION BANNER ⚠️ */}
      {user && !user.is_verified && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg flex justify-between items-center shadow-sm">
          <div>
            <p className="font-bold">Email not verified</p>
            <p className="text-sm">
              Please verify your email to unlock all features.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="bg-white"
          >
            Verify Now
          </Button>
        </div>
      )}

      {/* 👤 Profile Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-950">
            Welcome Back, {user?.username}!
          </h2>
          <p className="text-zinc-600 ">
            Email:{" "}
            <span className="font-semibold text-zinc-900 flex gap-2">
              {user?.email}
              {user?.is_verified ? (
                <ShieldCheck color="blue" size={20} />
              ) : (
                <ShieldX color="red" size={20} />
              )}
            </span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* 📊 Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-5 bg-white shadow-sm">
          <p className="text-sm text-zinc-500">Role</p>
          <p className="text-xl font-bold text-zinc-900 capitalize">
            {user?.role}
          </p>
        </div>

        <div className="border rounded-lg p-5 bg-white shadow-sm">
          <p className="text-sm text-zinc-500">User ID</p>
          <p className="text-lg font-mono text-zinc-700 truncate">{user?.id}</p>
        </div>
      </div>

      {/* ✨ OTP MODAL ✨ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Enter Verification Code</h2>
            <p className="text-sm font-thin text-zinc-600 mb-4">
              We sent a code to{" "}
              <span className="font-serif text-orange-500">{user?.email}</span>
            </p>

            <Button
              onClick={handleSendOTP}
              disabled={isVerifying}
              variant="destructive"
              className="mb-4 w-full cursor-pointer"
            >
              {isVerifying ? "Sending..." : "Resend Code"}
            </Button>

            <form onSubmit={handleVerify}>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                className="mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isVerifying}>
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
            {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
