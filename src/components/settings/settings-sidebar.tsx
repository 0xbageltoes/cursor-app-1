'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Settings, User, Bell, Palette } from 'lucide-react'

const settingsNavItems = [
  {
    title: 'Profile',
    href: '/dashboard/settings/profile',
    icon: User,
  },
  {
    title: 'Appearance',
    href: '/dashboard/settings/appearance',
    icon: Palette,
  },
  {
    title: 'Notifications',
    href: '/dashboard/settings/notifications',
    icon: Bell,
  },
]

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-64 space-y-2">
      {settingsNavItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            )}
          >
            <Icon size={20} />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
} 