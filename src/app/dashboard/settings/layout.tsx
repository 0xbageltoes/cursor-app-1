import { Metadata } from 'next'
import { SettingsSidebar } from '@/components/settings/settings-sidebar'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings',
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 gap-8">
      <SettingsSidebar />
      <div className="flex-1">{children}</div>
    </div>
  )
} 