export const whatsappNumber = "254724736495";

export function buildWhatsAppUrl(message?: string) {
  const text =
    message ||
    "Hello Me & Mommy, I am interested in your breastmilk storage bags and sterilising tablets. Please help me choose the right products for my feeding routine.";

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}
