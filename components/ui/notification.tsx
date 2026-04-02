"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { XCircle } from "@phosphor-icons/react/dist/ssr/XCircle";
import { X } from "lucide-react";
import { BottomBanner } from "./banner";

type NotificationType = "success" | "error";

interface NotificationState {
  message: string;
  type: NotificationType;
  isVisible: boolean;
  onAction?: () => void;
}

let notificationListener: (state: NotificationState) => void;

export const showSuccessNotification = (message: string, onAction?: () => void) => {
  if (notificationListener) {
    notificationListener({ message, type: "success", isVisible: true, onAction });
  }
};

export const showErrorNotification = (message: string) => {
  if (notificationListener) {
    notificationListener({ message, type: "error", isVisible: true });
  }
};

export function NotificationBanner() {
  const [state, setState] = useState<NotificationState>({
    message: "",
    type: "success",
    isVisible: false,
  });

  useEffect(() => {
    notificationListener = setState;
    return () => {
      notificationListener = () => {};
    };
  }, []);

  useEffect(() => {
    if (state.isVisible) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, isVisible: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.isVisible, state.message]);

  if (!state.isVisible) return null;

  const isSuccess = state.type === "success";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <BottomBanner
        icon={
          isSuccess ? (
            <CheckCircle weight="fill" className="w-5 h-5 md:w-6 md:h-6 text-[#22C55E]" />
          ) : (
            <XCircle weight="fill" className="w-5 h-5 md:w-6 md:h-6 text-[#EF4444]" />
          )
        }
        action={
          isSuccess ? (
            <button
              onClick={() => {
                state.onAction?.();
                setState((prev) => ({ ...prev, isVisible: false }));
              }}
              className="text-[13px] md:text-sm font-semibold text-[#1A1A1A] underline underline-offset-4 hover:text-gray-600 shrink-0"
            >
              View cart
            </button>
          ) : (
            <button
              onClick={() => setState((prev) => ({ ...prev, isVisible: false }))}
              className="text-gray-400 hover:text-gray-600 shrink-0 p-1"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )
        }
      >
        {state.message}
      </BottomBanner>
    </div>
  );
}
