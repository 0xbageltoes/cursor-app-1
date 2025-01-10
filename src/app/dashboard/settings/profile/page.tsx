import { Metadata } from 'next'
import { ProfileForm } from '@/components/settings/profile-form'

export const metadata: Metadata = {
  title: 'Profile Settings',
  description: 'Manage your profile settings',
}

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your profile information
        </p>
      </div>
      <ProfileForm />
    </div>
  )
} 