import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { settingsQuery, str, bool } from "@/lib/cms/api";
import { whatsappLink } from "@/lib/cms/utils";

export function WhatsAppFloat() {
  const { data: settings } = useQuery(settingsQuery);
  const contact = settings?.["contact"];
  const number = str(contact, "whatsapp");
  if (!number || !bool(contact, "whatsapp_float_enabled", true)) return null;
  const href = whatsappLink(number, str(contact, "whatsapp_message"));
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-5 left-5 z-50 flex size-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-elegant transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
