import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageCircle, BookOpen, FileText, User } from "lucide-react";

const navigationItems = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/categories", label: "Categories", icon: BookOpen },
  { href: "/quiz", label: "Quiz", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
];

export function MainNavigation() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex w-full mr:50 py-4">
      <div className="flex gap-40">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 transition-all duration-200",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
