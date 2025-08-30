import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CyberButton } from "./CyberButton";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onLogin, onSwitchToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card/90 backdrop-blur-sm border-primary/30 cyber-glow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center cyber-text uppercase tracking-wider">
          Access Portal
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
              className="bg-muted border-primary/30 focus:border-primary cyber-glow"
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
              className="bg-muted border-primary/30 focus:border-primary cyber-glow"
              placeholder="Enter your password"
              required
            />
          </div>

          <CyberButton type="submit" className="w-full">
            Initialize Access
          </CyberButton>
          
          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-secondary hover:text-accent transition-colors uppercase tracking-wide"
            >
              New User? Register
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};