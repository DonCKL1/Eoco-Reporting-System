import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
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

export default function AssignedCasesPage() {
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const { data, isLoading } = useQuery({
    queryKey: ['officer', 'assigned-reports'],
    queryFn: () => reportApi.assignedReports(),
  })

  if (isLoading) return <PageLoader />

  const reports: any[] = (data?.data.data as any)?.data || data?.data.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assigned Cases</h1>
          <p className="text-muted-foreground">View and manage reports assigned to you.</p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                  You have no reports yet.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((r: Report) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.reference_no}</TableCell>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{r.category.name}</TableCell>
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
        fullPageUrl={selectedReport ? `/officer/cases/${selectedReport.id}` : ''}
      />
    </div>
  )
}
