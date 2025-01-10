'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: ForgotPasswordValues) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setStatus('success')
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...form.register('email')}
          className="w-full p-2 border rounded"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {status === 'success' && (
        <p className="text-sm text-green-500">
          Check your email for a password reset link
        </p>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-500">
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-2 rounded"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? 'Sending...' : 'Send reset link'}
      </button>
    </form>
  )
} 