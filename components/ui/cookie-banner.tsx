"use client";

import React, { useState, useEffect } from "react";
import { BottomBanner } from "./banner";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookie_accepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <BottomBanner
      action={
        <button
          onClick={handleAccept}
          className="bg-[#141414] hover:bg-black text-white text-[13px] md:text-sm font-medium px-8 py-2.5 rounded transition-colors w-max whitespace-nowrap"
        >
          I Accept
        </button>
      }
    >
      We use cookies to ensure that we give you the best experience. If you continue to use this site we will assume that you are happy with it.
    </BottomBanner>
  );
}
