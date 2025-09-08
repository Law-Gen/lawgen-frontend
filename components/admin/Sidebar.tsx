"use client";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  FileText,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { easeInOut, easeIn, easeOut } from "framer-motion";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    description: "Overview of your tasks",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
    description: "Manage user accounts",
  },
  {
    title: "Quiz Categories",
    icon: FolderOpen,
    href: "/admin/quiz_categories",
    description: "Organize quiz categories",
  },
  {
    title: "Legal Content",
    icon: FileText,
    href: "/admin/legal_content",
    description: "Manage legal documents",
  },
  {
    title: "Legal Aid",
    icon: ShieldCheck,
    href: "/admin/legal_aid",
    description: "Manage legal assistance information",
  },
  {
    title: "Feedback",
    icon: MessageSquare,
    href: "/admin/feedback",
    description: "Manage feedbacks sent from users",
  },
];

type SidebarProps = {
  isExpanded: boolean;
};

export default function Sidebar({ isExpanded }: SidebarProps) {
  const pathname = usePathname();
  const sidebarVariants = {
    expanded: {
      width: 256,
      transition: {
        duration: 0.3,
        ease: easeInOut, // use a valid easing string
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    collapsed: {
      width: 80,
      transition: {
        duration: 0.3,
        ease: easeInOut, // use a valid easing string
        staggerChildren: 0.05,
      },
    },
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: easeOut,
      },
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.15,
        ease: easeIn,
      },
    },
  };

  const itemVariants = {
    expanded: {
      justifyContent: "flex-start",
      padding: "12px 16px",
      transition: {
        duration: 0.2,
        ease: easeOut,
      },
    },
    collapsed: {
      justifyContent: "center",
      padding: "12px",
      transition: {
        duration: 0.2,
        ease: easeOut,
      },
    },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isExpanded ? "expanded" : "collapsed"}
      initial={isExpanded ? "expanded" : "collapsed"}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col shadow-lg overflow-hidden"
    >
      {/* Logo Section */}
      <div className="p-6 border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <img
              src="/logo.svg"
              alt="LawG Logo"
              width={56}
              height={56}
              className="h-10 w-10 rounded-full object-cover border border-muted shadow"
            />
          </div>
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.span
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="text-sidebar-primary font-bold text-xl whitespace-nowrap"
              >
                LawGen
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 p-4">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="mb-4"
            >
              <p className="text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider px-3">
                MAIN MENU
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                variants={itemVariants}
                custom={index}
              >
                <Link
                  href={item.href}
                  className={`flex items-center rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm"
                  }`}
                  style={{
                    padding: isExpanded ? "12px 16px" : "12px",
                    justifyContent: isExpanded ? "flex-start" : "center",
                  }}
                >
                  {/* Icon - always visible */}
                  <Icon className="w-6 h-6 flex-shrink-0" />

                  <AnimatePresence mode="wait">
                    {isExpanded && (
                      <motion.div
                        variants={contentVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="ml-3 flex-1 min-w-0"
                      >
                        <div className="font-medium text-sm whitespace-nowrap">
                          {item.title}
                        </div>
                        <div className="text-xs text-sidebar-muted-foreground whitespace-nowrap">
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}
