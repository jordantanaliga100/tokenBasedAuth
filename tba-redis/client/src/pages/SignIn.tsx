/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/SignIn.tsx
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

export default function SignIn() {
  const { login } = useAuth(); // 💡 Kunin ang login function
  const navigate = useNavigate();
  // ✨ State management para sa form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData); // 💡 Tawagin ang login function sa context
      navigate("/"); // 💡 Redirect sa dashboard pag success
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Login to your account</CardTitle>
        <CardDescription className="font-thin">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* ✨ Dito gagamitin ang handleSubmit at ID */}
        <form id="signin-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
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
                <Link
                  to="/forgot-password" // ✨ Palitan ang href="#" ng to="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
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
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </CardContent>
      <CardFooter className="flex-col gap-2">
        {/* ✨ Added form attribute */}
        <Button type="submit" form="signin-form" className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
      <CardAction className="flex m-auto w-auto gap-0.5 items-center">
        <CardContent className="text-muted-foreground text-sm">
          Don't have an account?
        </CardContent>
        <Link to="r">
          <Button variant="link">Sign Up</Button>
        </Link>
      </CardAction>
    </Card>
  );
}
