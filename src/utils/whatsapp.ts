import type { CartItem } from "./supabase";

const WHATSAPP_NUMBER = "234802784294"; // Mashafy WhatsApp number

export const generateWhatsAppMessage = (
  cartItems: CartItem[],
  finalTotal: number,
): string => {
  let message = "🎉 *Mashafy Lifestyle Order*\n\n";
  message += "📦 *Order Items:*\n";

  cartItems.forEach((item, index) => {
    message += `\n${index + 1}. *${item.name}*\n`;
    message += `   Quantity: ${item.quantity} | Price: ₦${item.price.toLocaleString()}`;
    if (item.selectedSize) message += ` | Size: ${item.selectedSize}`;
    if (item.selectedColor) message += ` | Color: ${item.selectedColor}`;
    message += "\n";
  });

  message += `\n💰 *Total: ₦${finalTotal.toLocaleString()}*\n\n`;
  message +=
    "Please confirm your details (name, phone number, address) and we'll process your order.";

  return encodeURIComponent(message);
};

export const openWhatsAppCheckout = (
  cartItems: CartItem[],
  finalTotal: number,
): void => {
  const message = generateWhatsAppMessage(cartItems, finalTotal);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(whatsappUrl, "_blank");
};

export const formatPhoneNumber = (phone: string): string => {
  // Format phone number to international format
  return phone.replace(/\D/g, "").replace(/^(\d{10})$/, "234$1");
};
