/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link } from "react-router";
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
import { useAuth } from "../hooks/useAuth"; // Siguraduhin na may sendPasswordResetEmail ka na rito

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { sendPasswordResetEmail, isVerifying } = useAuth(); // Gamitin natin yung isVerifying as loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // 💡 Tatawag sa backend endpoint mo

      const res = await sendPasswordResetEmail(email);
      setMessage(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="forgot-password-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {message && (
              <p className="text-green-600 text-sm font-medium">{message}</p>
            )}
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            form="forgot-password-form"
            className="w-full"
            disabled={isVerifying}
          >
            {isVerifying ? "Sending..." : "Send Reset Link"}
          </Button>
          <Link
            to="/a"
            className="text-sm text-center underline underline-offset-4"
          >
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
