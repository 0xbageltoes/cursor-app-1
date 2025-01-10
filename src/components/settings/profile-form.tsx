'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useAuth } from '@/contexts/auth-context'
import { uploadFile } from '@/lib/storage'
import { FileUpload } from '@/components/ui/file-upload'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email').optional(),
})

type ProfileValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  async function onSubmit(data: ProfileValues) {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update profile')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  async function handleAvatarUpload(file: File) {
    try {
      setUploading(true)
      const result = await uploadFile(file, 'avatars', `${user?.id}/profile`)
      
      if (!result) throw new Error('Failed to upload avatar')

      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImage: result.url }),
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Profile Picture</label>
          <FileUpload
            accept="image/*"
            maxSize={2}
            onUpload={handleAvatarUpload}
            defaultPreview={user?.profileImage}
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            {...form.register('name')}
            className="w-full p-2 border rounded"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...form.register('email')}
            disabled
            className="w-full p-2 border rounded bg-muted"
          />
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        disabled={form.formState.isSubmitting || uploading}
      >
        {form.formState.isSubmitting ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  )
} 