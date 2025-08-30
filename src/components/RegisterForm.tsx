import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CyberButton } from "./CyberButton";

interface RegisterFormProps {
  onRegister: (email: string, password: string, confirmPassword: string) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onRegister, onSwitchToLogin }: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onRegister(email, password, confirmPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card/90 backdrop-blur-sm border-secondary/30 pink-glow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center cyber-text uppercase tracking-wider">
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-accent uppercase tracking-wide">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border-secondary/30 focus:border-secondary pink-glow"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-accent uppercase tracking-wide">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted border-secondary/30 focus:border-secondary pink-glow"
              placeholder="Create password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-accent uppercase tracking-wide">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-muted border-secondary/30 focus:border-secondary pink-glow"
              placeholder="Confirm password"
              required
            />
          </div>

          <CyberButton type="submit" variant="pink" className="w-full">
            Initialize User
          </CyberButton>
          
          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:text-accent transition-colors uppercase tracking-wide"
            >
              Have Account? Login
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};