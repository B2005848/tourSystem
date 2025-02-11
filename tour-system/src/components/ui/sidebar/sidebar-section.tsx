import type * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
  collapsible?: boolean;
}

export function SidebarSection({
  title,
  children,
  className,
  ...props
}: SidebarSectionProps) {
  return (
    <div className={cn("py-2", className)} {...props}>
      {title && (
        <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
