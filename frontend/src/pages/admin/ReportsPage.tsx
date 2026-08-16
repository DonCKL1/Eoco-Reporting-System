import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Eye, FileText } from 'lucide-react'

import reportApi from '@/api/reportApi'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/loaders/PageLoader'
import { ReportSummaryModal } from '@/components/common/ReportSummaryModal'
import type { Report } from '@/types'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: () => reportApi.index({ per_page: 50 }),
  })

  const reports: any[] = (data?.data.data as any)?.data || data?.data.data || []

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Reports</h1>
          <p className="text-muted-foreground">Overview of all system reports across all categories.</p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p>No reports found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((r: Report) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.reference_no}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{r.title}</TableCell>
                  <TableCell>{r.category.name}</TableCell>
                  <TableCell>
                    {r.user ? r.user.name : <span className="italic text-muted-foreground">Anonymous</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.priority === 'critical' ? 'destructive' : r.priority === 'high' ? 'destructive' : 'secondary'}>
                      {r.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedReport(r)}>
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ReportSummaryModal 
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        fullPageUrl={selectedReport ? `/admin/reports/${selectedReport.id}` : ''}
      />
    </div>
  )
}
