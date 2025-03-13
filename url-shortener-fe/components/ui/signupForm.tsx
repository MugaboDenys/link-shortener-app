import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSnackbar } from 'notistack';

interface SignupFormProps {
  onClose: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSignupSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (response.ok) {
        enqueueSnackbar("Signup successful!", { variant: "success" });
        // Redirect to the dashboard
        router.push("/dashboard");
      } else {
        enqueueSnackbar("Signup failed. Please try again.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred during signup. Please try again later.", { variant: "error" });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <form className="space-y-4" onSubmit={handleSignupSubmit}>
        <Input
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          Register
        </Button>
      </form>
      <Button
        type="button"
        variant="outline"
        className="mt-4 w-full"
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  );
};

export default SignupForm;