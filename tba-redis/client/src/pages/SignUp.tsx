/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../hooks/useAuth";

export default function SignUp() {
  const [localError, setLocalError] = useState<string | null>(null); // ✨ Local error state

  const { register, isLoading, error: contextError } = useAuth(); // ✨ Gamitin ang Auth Context
  const navigate = useNavigate(); // ✨ useNavigate hook
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await register(formData); // ✨ Tawagin ang register function
      navigate("/dashboard"); // ✨ Redirect to dashboard
    } catch (err: any) {
      setLocalError(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription className="font-thin">
          Enter your details below to register your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" onSubmit={handleSubmit}>
          {/* ✨ Display Errors */}
          {(localError || contextError) && (
            <p className="text-red-500 text-sm mb-4">
              {localError || contextError}
            </p>
          )}
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="user123"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {/* ✨ Disable button while loading */}
        <Button
          type="submit"
          form="signup-form"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
        <Button variant="outline" className="w-full">
          Signup with Google
        </Button>
      </CardFooter>
      <CardAction className="flex m-auto w-auto gap-0.5 items-center">
        <CardContent className="text-muted-foreground text-sm">
          Already have an account?
        </CardContent>
        <Link to="/a">
          <Button variant="link">Sign In</Button>
        </Link>
      </CardAction>
    </Card>
  );
}
