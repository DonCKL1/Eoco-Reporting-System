import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Eye, FileText, Search, Filter } from 'lucide-react'

import reportApi from '@/api/reportApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ReportSummaryModal } from '@/components/common/ReportSummaryModal'

function statusVariant(status: string) {
  switch (status) {
    case 'pending': return 'secondary'
    case 'under_review': return 'default'
    case 'assigned': return 'outline'
    case 'resolved': return 'default'
    case 'closed': return 'secondary'
    default: return 'outline'
  }
}

function priorityVariant(priority: string) {
  if (priority === 'critical' || priority === 'high') return 'destructive'
  return 'secondary'
}

const STATUS_OPTIONS = ['all', 'pending', 'under_review', 'assigned', 'resolved', 'closed']
const PRIORITY_OPTIONS = ['all', 'low', 'medium', 'high', 'critical']

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['supervisor', 'all-reports'],
    queryFn: () => reportApi.index({ per_page: 100 }),
  })

  if (isLoading) return <PageLoader />

  const raw: any[] = (data?.data.data as any)?.data || data?.data.data || []

  const reports = raw.filter((r: any) => {
    const matchesSearch =
      !search ||
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.reference_no?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || r.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Reports</h1>
        <p className="text-muted-foreground">
          View and monitor all crime reports submitted across the system.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or reference…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s === 'all' ? 'All Statuses' : s.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((p) => (
              <SelectItem key={p} value={p} className="capitalize">
                {p === 'all' ? 'All Priorities' : p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
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
              <TableHead>Assigned To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground h-32">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="h-8 w-8 opacity-40" />
                    <p>No reports match your filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.reference_no}</TableCell>
                  <TableCell className="font-medium max-w-[180px] truncate">{r.title}</TableCell>
                  <TableCell>{r.category?.name ?? '—'}</TableCell>
                  <TableCell className="text-sm">
                    {r.user ? r.user.name : <span className="italic text-muted-foreground">Anonymous</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariant(r.priority)} className="capitalize text-xs">
                      {r.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(r.status)} className="capitalize text-xs">
                      {r.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.officer?.name ?? <span className="italic opacity-60">Unassigned</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedReport(r)}>
                        <Eye className="h-4 w-4 mr-1.5" /> Quick View
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/supervisor/reports/${r.id}`}>
                          Full View
                        </Link>
                      </Button>
                    </div>
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
        fullPageUrl={selectedReport ? `/supervisor/reports/${selectedReport.id}` : ''}
      />
    </div>
  )
}
