import { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { openInAppBrowser } from "@/utils/inAppBrowser";

interface AdminSettings {
  whatsapp_number: string;
  telegram_link: string;
}

export const ContactIcons = () => {
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);

  useEffect(() => {
    const fetchAdminSettings = async () => {
      const { data, error } = await supabase
        .from('admin_settings')
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
      const message = encodeURIComponent("Hello admin, I need assistance");
      openInAppBrowser(`https://wa.me/${adminSettings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${message}`);
    }
  };

  const handleTelegramContact = () => {
    if (adminSettings?.telegram_link) {
      openInAppBrowser(adminSettings.telegram_link);
    }
  };

  if (!adminSettings) return null;

  return (
    <div className="fixed top-4 right-4 flex gap-3 z-50">
      <button
        onClick={handleWhatsAppContact}
        className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 cyber-glow"
        title="Contact via WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      
      <button
        onClick={handleTelegramContact}
        className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 cyber-glow"
        title="Contact via Telegram"
      >
        <Send className="w-6 h-6" />
      </button>
    </div>
  );
};