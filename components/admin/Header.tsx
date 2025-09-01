"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, Settings, LogOut, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userName: string;
  role: string;
  onMenuClick?: () => void;
}

export default function Header({ userName, role, onMenuClick }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleSettingsClick = () => {
    router.push("/admin/setting");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      {/* Left side - Menu button and greeting */}
      <div className="flex items-center gap-4">
        {/* this is where the button to move the side panels happens */}
        <button
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6 text-muted-foreground" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Welcome back, {userName.split(" ")[0]}!
          </h2>
          {/* <p className="text-sm text-muted-foreground">
  
          </p> */}
        </div>
      </div>

      {/* Center - Search bar uneccessary so reducted */}
      {/* <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents, cases, clients..."
            className="pl-10 bg-background border-border focus:border-ring"
          />
        </div>
      </div> */}

      {/* Right side - Notifications, settings, profile */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-accent"
        >
          <Bell className="w-6 h-6 text-muted-foreground" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: [1.2, 1] }}
            transition={{ type: "spring" }}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium"
          >
            3
          </motion.span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-accent"
          onClick={handleSettingsClick}
        >
          <Settings className="w-6 h-6 text-muted-foreground" />
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 hover:bg-accent"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-card-foreground">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-md bg-brown-600 text-white font-semibold">
              {initials}
            </div>
            <svg
              className="ml-2 w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-4 py-2 w-full text-sm text-brown-700 hover:bg-brown-50 hover:text-brown-900"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
