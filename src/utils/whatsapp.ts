import type { CartItem } from "./supabase";

const WHATSAPP_NUMBER = "2348180018752"; // Tabitha Books WhatsApp number

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

export const generateWhatsAppMessage = (
  cartItems: CartItem[],
  finalTotal: number,
  customerInfo?: CustomerInfo,
): string => {
  let message = "📚 *Tabitha Books Order*\n\n";

  if (customerInfo) {
    message += "👤 *Customer Details:*\n";
    message += `Name: ${customerInfo.name}\n`;
    message += `Phone: ${customerInfo.phone}\n`;
    message += `Address: ${customerInfo.address}\n\n`;
  }

  message += "📦 *Order Items:*\n";

  cartItems.forEach((item, index) => {
    message += `\n${index + 1}. *${item.name}*\n`;
    message += `   Quantity: ${item.quantity} | Price: ₦${item.price.toLocaleString()}`;
    if (item.selectedSize) message += ` | Size: ${item.selectedSize}`;
    if (item.selectedColor) message += ` | Color: ${item.selectedColor}`;
    message += "\n";
  });

  message += `\n💰 *Total: ₦${finalTotal.toLocaleString()}*`;

  return encodeURIComponent(message);
};

export const openWhatsAppCheckout = (
  cartItems: CartItem[],
  finalTotal: number,
  customerInfo?: CustomerInfo,
): void => {
  const message = generateWhatsAppMessage(cartItems, finalTotal, customerInfo);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(whatsappUrl, "_blank");
};

export const formatPhoneNumber = (phone: string): string => {
  // Format phone number to international format
  return phone.replace(/\D/g, "").replace(/^(\d{10})$/, "234$1");
};
