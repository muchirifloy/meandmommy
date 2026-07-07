export const whatsappNumber = "254724736495";

export function buildWhatsAppUrl(message?: string) {
  const text =
    message ||
    "Hello Me & Mommy, I am interested in your baby care essentials. Please help me choose the right products for my baby.";

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

