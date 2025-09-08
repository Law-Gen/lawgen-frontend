"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/hooks/use-language"

interface LanguageToggleProps {
  className?: string
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage()

  return (
    <div className={cn("flex items-center gap-1 p-1 bg-secondary rounded-lg", className)}>
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="text-xs px-3 py-1 h-auto transition-all duration-200 hover:scale-105"
      >
        EN
      </Button>
      <Button
        variant={language === "am" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("am")}
        className="text-xs px-3 py-1 h-auto transition-all duration-200 hover:scale-105"
      >
        አማ
      </Button>
    </div>
  )
}
