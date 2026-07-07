"use client";

import { useEffect } from "react";
import { attentionTitles } from "@/lib/promotions";

export function AttentionTitle() {
  useEffect(() => {
    let index = 0;
    const originalTitle = document.title;
    const interval = window.setInterval(() => {
      index = (index + 1) % attentionTitles.length;
      document.title = attentionTitles[index];
    }, 2600);

    const restore = () => {
      document.title = originalTitle;
    };

    window.addEventListener("focus", restore);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", restore);
      document.title = originalTitle;
    };
  }, []);

  return null;
}

