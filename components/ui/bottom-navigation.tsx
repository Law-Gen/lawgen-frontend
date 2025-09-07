"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MessageCircle, BookOpen, FileText, User } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const navigationItems = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/categories", label: "Categories", icon: BookOpen },
  { href: "/quiz", label: "Quiz", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
  <nav className="bg-card/90 backdrop-blur-sm border-t border-border p-2 fixed bottom-0 left-0 w-full z-50 md:static">
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 hover:scale-105",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{
                  item.href === "/chat" ? t("nav_chat") :
                  item.href === "/categories" ? t("nav_categories") :
                  item.href === "/quiz" ? t("nav_quiz") :
                  t("nav_profile")
                }</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
