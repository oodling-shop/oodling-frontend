"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/shopify/customer";

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
}

export function LogoutButton({ className, showIcon = true }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className={cn("transition-opacity disabled:opacity-50", className)}
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      {isPending ? "Logging out…" : "Logout"}
    </button>
  );
}
