import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { openInAppBrowser } from "@/utils/inAppBrowser";

interface AdminSettings {
  whatsapp_number: string;
  telegram_link: string;
}

export const PendingApproval = () => {
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);

  useEffect(() => {
    const fetchAdminSettings = async () => {
      const { data, error } = await supabase
        .from('public_app_settings')
        .select('whatsapp_number, telegram_link')
        .maybeSingle();
      
      if (data) {
        setAdminSettings(data);
      }
    };

    fetchAdminSettings();
  }, []);

  const handleWhatsAppContact = () => {
    if (adminSettings?.whatsapp_number) {
      const message = encodeURIComponent("Hello, I would like to make payment for toolkit access");
      openInAppBrowser(`https://wa.me/${adminSettings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${message}`);
    }
  };

  const handleTelegramContact = () => {
    if (adminSettings?.telegram_link) {
      openInAppBrowser(adminSettings.telegram_link);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg mx-auto bg-card/90 backdrop-blur-sm border-secondary/30 pink-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold cyber-text uppercase tracking-wider">
            Account Pending
          </CardTitle>
          <p className="text-accent text-lg mt-4 modern-text font-medium">
            HELLO, ACCOUNT CREATED. NOW IT'S PENDING. MAKE IT APPROVED.
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="p-6 bg-muted/50 rounded-lg border border-primary/20">
            <p className="text-muted-foreground mb-6 modern-text">
              Contact admin via WhatsApp or Telegram for payment in order to activate your account and access the toolkit.
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleWhatsAppContact}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold modern-text"
                disabled={!adminSettings?.whatsapp_number}
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              
              <button
                onClick={handleTelegramContact}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold modern-text"
                disabled={!adminSettings?.telegram_link}
              >
                <Send className="w-5 h-5" />
                Telegram
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Payment required for toolkit access
          </p>
        </CardContent>
      </Card>
    </div>
  );
};