import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import type { Report } from '@/types'

interface ReportSummaryModalProps {
  report: Report | null
  isOpen: boolean
  onClose: () => void
  fullPageUrl: string
}

export function ReportSummaryModal({ report, isOpen, onClose, fullPageUrl }: ReportSummaryModalProps) {
  if (!report) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Summary (Ref: {report.reference_no})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <span className="font-semibold text-muted-foreground">Title:</span> {report.title}
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Category:</span> {report.category?.name || 'N/A'}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Status:</span>
            <Badge variant="outline" className="capitalize">{report.status}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Priority:</span>
            <Badge variant={report.priority === 'critical' || report.priority === 'high' ? 'destructive' : 'secondary'} className="capitalize">
              {report.priority}
            </Badge>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Description:</span>
            <p className="mt-1 bg-muted p-2 rounded-md line-clamp-3 whitespace-pre-wrap">{report.description}</p>
          </div>
        </div>
        <DialogFooter className="sm:justify-between mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button type="button" asChild>
            <Link to={fullPageUrl}>View Full Details</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
