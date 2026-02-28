/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/ResetPassword.tsx
import { Eye, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router"; // or react-router-dom
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../hooks/useAuth"; // Siguraduhin na may resetPassword ka na sa hook

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✨ Kunin ang token galing sa URL
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuth();

  // --- LUMANG CODE NA NAKA-COMMENT OUT ---
  // const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // ----------------------------------------

  // ✅ BAGONG CODE: Object state
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error state

    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (formData.newPassword.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (!token) {
      return setError("Invalid or missing token.");
    }

    // ✅ BAGONG CODE: Tawagin ang API
    try {
      await resetPassword(token, formData.newPassword);
      setSuccess(true);
      // Redirect sa login page pagkatapos ng 3 seconds
      setTimeout(() => navigate("/a"), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password.");
    }
  };

  // --- LUMANG CODE NA NAKA-COMMENT OUT ---
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");

  //   // Basic validation
  //   if (newPassword !== confirmPassword) {
  //     return setError("Passwords do not match.");
  //   }
  //   if (newPassword.length < 6) {
  //     return setError("Password must be at least 6 characters.");
  //   }
  //   if (!token) {
  //     return setError("Invalid or missing token.");
  //   }
  // };
  // ----------------------------------------

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">
              Password Reset!
            </CardTitle>
            <CardDescription>
              Your password has been updated successfully.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/a")}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Set New Password</CardTitle>
          <section className="flex items-center justify-between  mr-5">
            <CardDescription>Enter your new password below.</CardDescription>
            <Button
              type="button"
              variant={"destructive"}
              // ✨ I-toggle ang state
              onClick={() => setShowPassword(!showPassword)}
              className="w-auto underline underline-offset-4"
            >
              {showPassword ? (
                <small className="flex gap-3 items-center">
                  <EyeOffIcon size={50} className="w-4 h-4" />
                  Hide
                </small>
              ) : (
                <small className="flex gap-3 items-center">
                  <Eye size={50} className="w-4 h-4" />
                  Show
                </small>
              )}
            </Button>
          </section>
        </CardHeader>
        <CardContent>
          <form
            id="reset-password-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                required
                // ✅ BAGONG CODE: Ginamit ang formData
                value={formData.newPassword}
                onChange={handleChange}
                // --- LUMANG CODE ---
                // value={newPassword}
                // onChange={(e) => setNewPassword(e.target.value)}
                // -------------------
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                required
                // ✅ BAGONG CODE: Ginamit ang formData
                value={formData.confirmPassword}
                onChange={handleChange}
                // --- LUMANG CODE ---
                // value={confirmPassword}
                // onChange={(e) => setConfirmPassword(e.target.value)}
                // -------------------
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="reset-password-form"
            className="w-full"
            disabled={isLoading || !token}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
