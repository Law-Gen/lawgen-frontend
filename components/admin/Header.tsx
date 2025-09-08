"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Menu, Bell, Settings, ChevronDown, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/src/store/hooks";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Get profile from Redux
  const profile = useAppSelector((state) => state.profile.profile);
  const loading = useAppSelector((state) => state.profile.loading);

  // Fallbacks if profile is not loaded
  const fullName = profile?.full_name || "User";
  const role = profile?.role || "User";
  const profilePic = profile?.profile?.profile_picture_url || "";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleSettingsClick = () => {
    router.push("/admin/setting");
  };
  const handleLogoutClick = () => {
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      {/* Left side - Menu button and greeting */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6 text-muted-foreground" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Welcome back, {fullName.split(" ")[0]}!
          </h2>
        </div>
      </div>

      {/* Right side - Notifications, dark mode toggle, settings, profile */}
      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-accent"
          aria-label="Toggle dark mode"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1.5m0 15V21m8.485-8.485h-1.5m-15 0H3m15.364-6.364l-1.06 1.06m-12.728 0l-1.06-1.06m12.728 12.728l-1.06-1.06m-12.728 0l-1.06 1.06M16.24 7.76A6 6 0 1112 18a6 6 0 014.24-10.24z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.136 2.652-7.626 6.398-9.093a.75.75 0 01.908.325.75.75 0 01-.062.954A7.501 7.501 0 0012 19.5a7.48 7.48 0 006.064-3.188.75.75 0 01.954-.062.75.75 0 01.325.908z"
              />
            </svg>
          )}
        </Button>
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
        {/* Profile and dropdown */}
        <div className="flex items-center gap-2 relative">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-card-foreground">
              {fullName}
            </p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
          {profilePic ? (
            <img
              src={profilePic}
              alt={fullName}
              className="w-9 h-9 rounded-md object-cover border border-border"
            />
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-md bg-brown-600 text-white font-semibold">
              {initials}
            </div>
          )}
          <Button
            variant="ghost"
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center gap-1 p-2 hover:bg-accent transition"
            aria-label="Open profile menu"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 flex flex-col"
              >
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left text-sm text-brown-700 hover:bg-brown-50 hover:text-brown-900 focus:outline-none"
                  type="button"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
