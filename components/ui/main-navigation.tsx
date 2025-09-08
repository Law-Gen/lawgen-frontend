import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageCircle, BookOpen, FileText, User , LayoutDashboard} from "lucide-react";
import { useSession } from "next-auth/react";

const navigationItems = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/categories", label: "Categories", icon: BookOpen },
  { href: "/quiz", label: "Quiz", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
    {
    href: "/user_analysis",
    label: "Analytics",
    icon: LayoutDashboard,
    enterpriseOnly: true, // This item is for enterprise users
  },
];

export function MainNavigation() {
  const pathname = usePathname();
    const { data: session } = useSession(); // Get session data
    console.log("session on nav",session?.user)
  const userSubscription = session?.user?.subscription_status;
  return (
    <nav className="hidden md:flex w-full mr:50 py-4">
     <div className="flex gap-40">
        {navigationItems.map((item) => {
          // Add this condition
          if (item.enterpriseOnly && userSubscription !== "enterprise") {
            return null; // Don't render this item if user is not enterprise
          }

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
