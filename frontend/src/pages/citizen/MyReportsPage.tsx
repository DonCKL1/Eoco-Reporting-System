import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PlusCircle, Eye } from 'lucide-react'
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

export default function MyReportsPage() {
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const { data, isLoading } = useQuery({
    queryKey: ['citizen', 'reports'],
    queryFn: () => reportApi.index(),
  })

  if (isLoading) return <PageLoader />

  const reports: any[] = (data?.data.data as any)?.data || data?.data.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Reports</h1>
          <p className="text-muted-foreground">View and track all reports you have submitted.</p>
        </div>
        <Button asChild className="hidden md:inline-flex">
          <Link to="/citizen/reports/create">
            <PlusCircle className="mr-2 h-4 w-4" /> New Report
          </Link>
        </Button>
      </div>

      {/* Mobile Stacked View */}
      <div className="md:hidden flex flex-col gap-4">
        {reports.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 bg-card/60 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl">
            You have no reports yet.
          </div>
        ) : (
          reports.map((r: Report) => (
            <div 
              key={r.id} 
              className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 flex flex-col gap-3 transition-all active:scale-[0.98]"
              onClick={() => setSelectedReport(r)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-base line-clamp-1">{r.title}</h3>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">{r.reference_no}</p>
                </div>
                <Badge variant="outline" className="shrink-0 bg-background/50">
                  {r.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-end mt-1">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-primary">{r.category.name}</span>
                  <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-primary/10 text-primary">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border bg-card">
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
        fullPageUrl={selectedReport ? `/citizen/reports/${selectedReport.id}` : ''}
      />
    </div>
  )
}
