import type * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/context/sidebar-context";

const sidebarItemVariants = cva(
  "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "hover:bg-accent",
        active: "bg-accent text-accent-foreground",
      },
      size: {
        default: "h-10",
        sm: "h-8",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface SidebarItemProps
  extends React.ButtonHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof sidebarItemVariants> {
  icon?: LucideIcon;
  title: string;
  href: string;
  badge?: string | number;
  external?: boolean;
}

export function SidebarItem({
  className,
  variant,
  size,
  icon: Icon,
  title,
  href,
  badge,
  external,
  ...props
}: SidebarItemProps) {
  const { isCollapsed } = useSidebar();

  const content = (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 40 : "100%" }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn(sidebarItemVariants({ variant, size, className }))}
        {...props}
      >
        {Icon && (
          <motion.span
            initial={false}
            animate={{ scale: isCollapsed ? 1.2 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-5 w-5 shrink-0" />
          </motion.span>
        )}
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.span>
        )}
        {badge && !isCollapsed && (
          <motion.span
            className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            {badge}
          </motion.span>
        )}
      </Link>
    </motion.div>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {title}
          {badge && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
              {badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
