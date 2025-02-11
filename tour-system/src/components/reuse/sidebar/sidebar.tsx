"use client";

import type * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarSection } from "@/components/ui/sidebar/sidebar-section";
import { SidebarItem } from "@/components/ui/sidebar/sidebar-item";
import { useSidebar } from "@/context/sidebar-context";
import type { SidebarConfig } from "@/types/sidebar";

interface EnhancedSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  config: SidebarConfig;
}

export function EnhancedSidebar({
  config,
  className,
  ...props
}: EnhancedSidebarProps) {
  const {
    isCollapsed,
    isCollapsible,
    toggleCollapsed,
    isMobile,
    isOpen,
    toggleOpen,
  } = useSidebar();

  const sidebarVariants = {
    expanded: { width: config.width?.expanded || "240px" },
    collapsed: { width: config.width?.collapsed || "70px" },
  };

  const sidebarContent = (
    <motion.div
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex h-screen flex-col gap-2 border-r bg-background",
        className
      )}
      style={
        {
          "--sidebar-background": config.theme?.background,
          "--sidebar-foreground": config.theme?.foreground,
          "--sidebar-muted": config.theme?.muted,
          "--sidebar-muted-foreground": config.theme?.mutedForeground,
          "--sidebar-border": config.theme?.border,
          "--sidebar-active": config.theme?.active,
          "--sidebar-active-text": config.theme?.activeText,
          "--sidebar-hover": config.theme?.hover,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="flex h-16 items-center justify-between px-3 py-4">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {config.logo}
            </motion.div>
          )}
        </AnimatePresence>
        {isCollapsible && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-8 w-8 p-0"
            onClick={toggleCollapsed}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto">
        {config.navigation.map((section, sectionIndex) => (
          <SidebarSection
            key={sectionIndex}
            title={!isCollapsed ? section.title : undefined}
          >
            {section.items.map((item, itemIndex) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
              >
                <SidebarItem
                  icon={item.icon}
                  title={item.title}
                  href={item.href}
                  badge={item.badge}
                  variant={item.isActive ? "active" : "default"}
                  external={item.external}
                />
              </motion.div>
            ))}
          </SidebarSection>
        ))}
      </div>
      {config.footer && (
        <SidebarSection>
          {config.footer.items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <SidebarItem
                icon={item.icon}
                title={item.title}
                href={item.href}
                variant={item.isActive ? "active" : "default"}
                external={item.external}
              />
            </motion.div>
          ))}
        </SidebarSection>
      )}
    </motion.div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={toggleOpen}>
        <SheetContent side="left" className="w-[240px] p-0">
          <TooltipProvider>{sidebarContent}</TooltipProvider>
        </SheetContent>
      </Sheet>
    );
  }

  return <TooltipProvider>{sidebarContent}</TooltipProvider>;
}
