import { useState } from 'react'
import { FileText, Image, Film, FileSpreadsheet, Download, ExternalLink, Loader2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { evidenceApi } from '@/api/index'
import { toast } from 'sonner'

interface EvidenceFile {
  id: number
  original_name: string
  file_size: number
  mime_type: string
  file_path?: string
  created_at: string
}

interface EvidenceViewerProps {
  evidence: EvidenceFile[]
  isLoading: boolean
}

function getFileCategory(mime: string): 'image' | 'video' | 'document' {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  return 'document'
}

function getIcon(mime: string) {
  const cat = getFileCategory(mime)
  switch (cat) {
    case 'image': return Image
    case 'video': return Film
    default: return FileSpreadsheet
  }
}

function getCategoryBadge(mime: string) {
  const cat = getFileCategory(mime)
  switch (cat) {
    case 'image': return { label: 'Image', variant: 'default' as const }
    case 'video': return { label: 'Video', variant: 'secondary' as const }
    default: return { label: 'Document', variant: 'outline' as const }
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function EvidenceViewer({ evidence, isLoading }: EvidenceViewerProps) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleDownload = async (file: EvidenceFile) => {
    setDownloadingId(file.id)
    try {
      const res = await evidenceApi.downloadUrl(file.id)
      const url = res.data.data.download_url
      window.open(url, '_blank')
    } catch {
      toast.error(`Failed to download ${file.original_name}`)
    } finally {
      setDownloadingId(null)
    }
  }

  const handlePreview = async (file: EvidenceFile) => {
    try {
      const res = await evidenceApi.downloadUrl(file.id)
      setPreviewUrl(res.data.data.download_url)
    } catch {
      toast.error('Failed to load preview')
    }
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">Loading evidence…</p>
      </div>
    )
  }

  if (evidence.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground bg-muted/20 rounded-md">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
        No evidence files attached to this case.
      </div>
    )
  }

  return (
    <>
      {/* Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img src={previewUrl} alt="Evidence preview" className="rounded-lg max-w-full max-h-[85vh] object-contain" />
            <Button
              variant="secondary"
              size="sm"
              className="mt-3 mx-auto block"
              onClick={() => setPreviewUrl(null)}
            >
              Close Preview
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {evidence.length} file{evidence.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {evidence.map((file) => {
          const Icon = getIcon(file.mime_type)
          const badge = getCategoryBadge(file.mime_type)
          const isImage = file.mime_type.startsWith('image/')
          const isDownloading = downloadingId === file.id

          return (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary/20 hover:bg-muted/20 transition-all group"
            >
              {/* Icon */}
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.original_name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{formatSize(file.file_size)}</span>
                  <Badge variant={badge.variant} className="text-[10px] h-4 px-1.5">
                    {badge.label}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {isImage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePreview(file)}
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDownload(file)}
                  disabled={isDownloading}
                  title="Download"
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
