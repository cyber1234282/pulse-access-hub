import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { CyberButton } from "./CyberButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VerificationFormProps {
  email: string;
  userId: string;
  onVerified: () => void;
  onBack: () => void;
}

export const VerificationForm = ({ email, userId, onVerified, onBack }: VerificationFormProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Check if code exists and is valid
      const { data: verificationData, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('user_id', userId)
        .eq('code', code)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error checking verification code:", error);
        throw new Error("Failed to verify code");
      }

      if (!verificationData) {
        toast({
          title: "Invalid or Expired Code",
          description: "The verification code is incorrect or has expired. Please try again.",
          variant: "destructive"
        });
        setCode("");
        return;
      }

      // Mark code as verified
      const { error: updateError } = await supabase
        .from('verification_codes')
        .update({ verified: true })
        .eq('id', verificationData.id);

      if (updateError) {
        console.error("Error updating verification code:", updateError);
        throw new Error("Failed to update verification status");
      }

      // Update user profile status to approved
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ status: 'approved' })
        .eq('user_id', userId);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw new Error("Failed to update profile status");
      }

      toast({
        title: "Account Verified!",
        description: "Your account has been successfully verified and approved.",
      });

      onVerified();
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "An error occurred during verification.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);

    try {
      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, userId }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
      setCode("");
    } catch (error: any) {
      console.error("Resend error:", error);
      toast({
        title: "Failed to Resend",
        description: "Could not resend verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md cyber-glow bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold cyber-text">
            Verify Your Account
          </CardTitle>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to:
          </p>
          <p className="text-primary font-medium">{email}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              value={code}
              onChange={setCode}
              maxLength={6}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-3">
            <CyberButton
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </CyberButton>

            <div className="flex gap-2">
              <CyberButton
                onClick={onBack}
                variant="outline"
                className="flex-1"
              >
                Back
              </CyberButton>
              
              <CyberButton
                onClick={handleResendCode}
                disabled={resending}
                variant="outline"
                className="flex-1"
              >
                {resending ? "Sending..." : "Resend Code"}
              </CyberButton>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Code expires in 5 minutes
          </p>
        </CardContent>
      </Card>
    </div>
  );
};