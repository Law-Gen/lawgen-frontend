
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Grid, User } from "lucide-react";

export default function FooterNav() {
  const pathname = usePathname();
  const links = [
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/category", label: "Category", icon: Grid },
    { href: "/profile", label: "Profile", icon: User },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-lg flex justify-around py-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center text-xs font-medium transition-colors ${
            pathname.startsWith(href) ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <Icon className="h-5 w-5 mb-0.5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
