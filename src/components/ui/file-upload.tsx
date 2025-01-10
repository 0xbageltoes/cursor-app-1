'use client'

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  accept?: string
  maxSize?: number // in MB
  onUpload: (file: File) => Promise<void>
  className?: string
  defaultPreview?: string
}

export function FileUpload({
  accept = 'image/*',
  maxSize = 5,
  onUpload,
  className,
  defaultPreview
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(defaultPreview || '')
  const [error, setError] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    try {
      setUploading(true)
      setError('')

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      await onUpload(file)
    } catch (error) {
      setError('Failed to upload file')
      setPreview('')
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setPreview('')
    setError('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors',
          error ? 'border-red-500' : 'border-gray-300',
          'hover:border-primary cursor-pointer'
        )}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full rounded-lg"
            />
            <button
              type="button"
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </div>
            <div className="text-xs text-gray-500">
              {accept.split(',').join(' or ')} (max {maxSize}MB)
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 