"use client";

import { useState } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppFloatingButton() {
  const [position, setPosition] = useState({ x: 20, y: 88 });

  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      draggable
      onDragEnd={(event) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        setPosition({
          x: Math.max(12, Math.min(viewportWidth - event.clientX - 28, viewportWidth - 68)),
          y: Math.max(76, Math.min(viewportHeight - event.clientY - 28, viewportHeight - 68)),
        });
      }}
      className="fixed z-50 inline-flex h-14 w-14 touch-none items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-200 ring-2 ring-white transition hover:scale-105"
      style={{ right: position.x, bottom: position.y }}
      aria-label="Chat with Me & Mommy on WhatsApp"
      title="Drag or tap to chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-current">
        <path d="M16.04 3.2c-7.03 0-12.74 5.62-12.74 12.55 0 2.22.59 4.39 1.72 6.29L3.2 28.8l6.95-1.79a12.91 12.91 0 0 0 5.89 1.47c7.03 0 12.76-5.62 12.76-12.55S23.07 3.2 16.04 3.2Zm0 22.99c-1.89 0-3.73-.5-5.33-1.45l-.38-.22-4.12 1.06 1.1-4-.25-.41a10.18 10.18 0 0 1-1.49-5.42c0-5.66 4.7-10.27 10.47-10.27 5.78 0 10.48 4.61 10.48 10.27 0 5.67-4.7 10.44-10.48 10.44Zm5.74-7.68c-.31-.16-1.84-.89-2.13-.99-.29-.11-.5-.16-.71.16-.21.31-.81.99-1 .2-.18.21-.37.23-.68.08-.31-.16-1.31-.47-2.5-1.47-.92-.81-1.55-1.81-1.73-2.12-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.68-.97-2.3-.26-.6-.52-.52-.71-.53h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.59s1.13 3.01 1.29 3.22c.16.21 2.22 3.34 5.38 4.68.75.32 1.34.51 1.8.65.76.24 1.45.21 1.99.13.61-.09 1.84-.74 2.1-1.45.26-.71.26-1.32.18-1.45-.08-.13-.29-.21-.6-.37Z" />
      </svg>
    </a>
  );
}
