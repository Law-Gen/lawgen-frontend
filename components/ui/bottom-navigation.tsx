"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navigationItems = [
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/categories", label: "Categories", icon: "📚" },
  { href: "/quiz", label: "Quiz", icon: "📝" },
  { href: "/profile", label: "Profile", icon: "👤" },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-card/90 backdrop-blur-sm border-t border-border p-2">
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 hover:scale-105",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50",
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
