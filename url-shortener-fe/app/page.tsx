"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import SignupForm from "@/components/ui/signupForm";
import { useRouter } from "next/navigation";
import { SnackbarProvider, useSnackbar } from 'notistack';

function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleCreateLinkClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSignup(false);
  };

  const toggleSignup = () => {
    setIsSignup(!isSignup);
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.username));
        enqueueSnackbar("Login successful!", { variant: "success" });
        // Redirect to the dashboard
        router.push("/dashboard");
      } else {
        if (response.status === 401) {
          enqueueSnackbar("Incorrect credentials. Please try again.", { variant: "error" });
        } else {
          enqueueSnackbar("Login failed. Please check your credentials and try again.", { variant: "error" });
        }
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("An error occurred during login. Please try again later.", { variant: "error" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Welcome to URL shortener</h1>
      <form className="w-full max-w-md space-y-4">
        <Input
          placeholder="Enter your long URL here"
          className="w-full"
          required
        />
        <Button type="button" onClick={handleCreateLinkClick} className="w-full">
          Create Link
        </Button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {isSignup ? (
            <SignupForm onClose={handleCloseModal} />
          ) : (
            <div className="bg-white p-8 w-96 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Login</h2>
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
              <Link onClick={toggleSignup} href="#">
                <p className="text-blue-600 text-sm mt-10 hover:underline">Don&apos;t have an account? Sign up</p>
              </Link>
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full"
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <LandingPage />
    </SnackbarProvider>
  );
}