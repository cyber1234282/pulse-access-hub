import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userId }: VerificationRequest = await req.json();

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Store verification code in database
    const { error: dbError } = await supabase
      .from('verification_codes')
      .insert({
        user_id: userId,
        code: code,
        email: email,
        expires_at: expiresAt
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store verification code");
    }

    // Send email with verification code
    const emailResponse = await resend.emails.send({
      from: "Black Hackers Team <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Account - BLACK HACKERS TEAM",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #0a0a0a, #1a1a1a); color: #00ff88; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; text-transform: uppercase; font-weight: bold; margin: 0; text-shadow: 0 0 10px #00ff88;">BLACK HACKERS TEAM</h1>
            <div style="height: 2px; background: linear-gradient(90deg, #00ff88, #0088ff); margin: 10px 0;"></div>
          </div>
          
          <h2 style="color: #ffffff; text-align: center; margin-bottom: 20px;">Verify Your Account</h2>
          
          <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Welcome to the BLACK HACKERS TEAM! Please use the verification code below to activate your account:
          </p>
          
          <div style="background: #000000; border: 2px solid #00ff88; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0; box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);">
            <div style="color: #00ff88; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</div>
          </div>
          
          <p style="color: #cccccc; font-size: 14px; margin-bottom: 20px;">
            ⚠️ This code will expire in 5 minutes for security reasons.
          </p>
          
          <p style="color: #cccccc; font-size: 14px; margin-bottom: 20px;">
            If you didn't request this verification, please ignore this email.
          </p>
          
          <div style="border-top: 1px solid #333333; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #666666; font-size: 12px; margin: 0;">
              © BLACK HACKERS TEAM - Secure Access Portal
            </p>
          </div>
        </div>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, message: "Verification code sent" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-verification-code function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);