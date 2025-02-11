import type { LucideIcon } from "lucide-react"
import type React from "react"

export interface NavItem {
    title: string
    href: string
    icon: LucideIcon
    isActive?: boolean
    badge?: string | number
    external?: boolean
}

export interface NavSection {
    title?: string
    items: NavItem[]
}

export interface SidebarTheme {
    background?: string
    foreground?: string
    muted?: string
    mutedForeground?: string
    border?: string
    active?: string
    activeText?: string
    hover?: string
}

export interface SidebarConfig {
    logo?: React.ReactNode
    navigation: NavSection[]
    footer?: NavSection
    theme?: SidebarTheme
    defaultCollapsed?: boolean
    collapsible?: boolean
    width?: {
        expanded?: string
        collapsed?: string
    }
}