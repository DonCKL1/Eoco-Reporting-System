import { useState, useRef } from 'react'
import { Camera, Upload, FileText, X, Image, Film, FileSpreadsheet, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.pdf,.docx,.mp4'
const MAX_SIZE_MB = 50
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

interface EvidenceFile {
  file: File
  preview?: string
  type: 'image' | 'video' | 'document'
}

interface EvidenceUploadProps {
  files: EvidenceFile[]
  onFilesChange: (files: EvidenceFile[]) => void
  disabled?: boolean
}

function getFileType(file: File): 'image' | 'video' | 'document' {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  return 'document'
}

function getFileIcon(type: 'image' | 'video' | 'document') {
  switch (type) {
    case 'image': return Image
    case 'video': return Film
    case 'document': return FileSpreadsheet
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function EvidenceUpload({ files, onFilesChange, disabled }: EvidenceUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const processFiles = (newFiles: FileList | File[]) => {
    const validFiles: EvidenceFile[] = []
    const fileArray = Array.from(newFiles)

    for (const file of fileArray) {
      if (file.size > MAX_SIZE_BYTES) {
        continue // skip oversized files silently
      }

      const type = getFileType(file)
      const preview = type === 'image' ? URL.createObjectURL(file) : undefined
      validFiles.push({ file, preview, type })
    }

    onFilesChange([...files, ...validFiles])
  }

  const removeFile = (index: number) => {
    const updated = [...files]
    const removed = updated.splice(index, 1)
    // Revoke preview URLs to avoid memory leaks
    removed.forEach((f) => f.preview && URL.revokeObjectURL(f.preview))
    onFilesChange(updated)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files.length) {
      processFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Evidence / Attachments
          <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
        </label>
        <span className="text-xs text-muted-foreground">
          Max {MAX_SIZE_MB}MB · JPG, PNG, PDF, DOCX, MP4
        </span>
      </div>

      {/* Drop zone */}
      <div
        className={cn(
          'relative rounded-xl border-2 border-dashed p-6 text-center transition-colors',
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/40',
          disabled && 'opacity-50 pointer-events-none'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-4">
          Drag & drop files here, or use the buttons below
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Camera capture (mobile) */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => cameraInputRef.current?.click()}
            disabled={disabled}
            className="gap-2"
          >
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Take Photo</span>
            <span className="sm:hidden">Camera</span>
          </Button>

          {/* File picker */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Browse Files</span>
            <span className="sm:hidden">Files</span>
          </Button>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) processFiles(e.target.files)
            e.target.value = '' // reset so same file can be re-selected
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) processFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {files.length} file{files.length !== 1 ? 's' : ''} selected
          </p>
          <div className="grid grid-cols-1 gap-2">
            {files.map((f, i) => {
              const Icon = getFileIcon(f.type)
              return (
                <div
                  key={`${f.file.name}-${i}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/20 group"
                >
                  {/* Preview / icon */}
                  {f.preview ? (
                    <img
                      src={f.preview}
                      alt={f.file.name}
                      className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(f.file.size)}</p>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                    disabled={disabled}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/** Small uploading indicator for when evidence is being submitted */
export function EvidenceUploadProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      Uploading evidence {current}/{total}…
    </div>
  )
}
