import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserCheck, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

import reportApi from '@/api/reportApi'
import { userApi } from '@/api/index'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

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

export default function AssignmentsPage() {
  const queryClient = useQueryClient()
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [selectedOfficer, setSelectedOfficer] = useState<string>('')
  const [assignNotes, setAssignNotes] = useState('')

  // Load all reports that are pending/under review (need assignment)
  const { data: reportsData, isLoading: loadingReports } = useQuery({
    queryKey: ['supervisor', 'reports'],
    queryFn: () => reportApi.index({ per_page: 100 }),
  })

  // Load officers list for assignment dropdown
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['users', 'officers'],
    queryFn: () => userApi.index({ per_page: 100 }),
  })

  const assignMutation = useMutation({
    mutationFn: ({ reportId, officerId, notes }: { reportId: number; officerId: number; notes?: string }) =>
      reportApi.assign(reportId, officerId, notes),
    onSuccess: () => {
      toast.success('Report assigned successfully')
      queryClient.invalidateQueries({ queryKey: ['supervisor', 'reports'] })
      setSelectedReport(null)
      setSelectedOfficer('')
      setAssignNotes('')
    },
    onError: () => toast.error('Failed to assign report'),
  })

  if (loadingReports) return <PageLoader />

  const rawReports: any[] = (reportsData?.data.data as any)?.data || reportsData?.data.data || []
  // Show unresolved reports that need attention
  const reports = rawReports.filter((r: any) =>
    ['pending', 'under_review', 'assigned'].includes(r.status)
  )

  const allUsers: any[] = (usersData?.data.data as any)?.data || usersData?.data.data || []
  const officers = allUsers.filter((u: any) =>
    u.roles?.some((role: any) => (typeof role === 'string' ? role : role.name) === 'Officer')
  )

  const handleAssign = () => {
    if (!selectedReport || !selectedOfficer) return
    assignMutation.mutate({
      reportId: selectedReport.id,
      officerId: parseInt(selectedOfficer),
      notes: assignNotes || undefined,
    })
  }

  const pendingCount = rawReports.filter((r: any) => r.status === 'pending').length
  const assignedCount = rawReports.filter((r: any) => r.status === 'assigned').length
  const underReviewCount = rawReports.filter((r: any) => r.status === 'under_review').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">Assign pending reports to investigation officers.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Assignment</CardDescription>
            <CardTitle className="text-3xl text-amber-500">{pendingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Under Review</CardDescription>
            <CardTitle className="text-3xl text-blue-500">{underReviewCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Assigned to Officers</CardDescription>
            <CardTitle className="text-3xl text-green-500">{assignedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Reports table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reports Requiring Attention</CardTitle>
          <CardDescription>
            Click "Assign" to assign a report to an officer. Only pending, under review, and assigned reports are shown.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-32">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <AlertCircle className="h-8 w-8 opacity-40" />
                      <p>No reports pending assignment.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.reference_no}</TableCell>
                    <TableCell className="font-medium max-w-[180px] truncate">{r.title}</TableCell>
                    <TableCell>{r.category?.name ?? '—'}</TableCell>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(r)
                          setSelectedOfficer(r.officer?.id?.toString() ?? '')
                          setAssignNotes('')
                        }}
                      >
                        <UserCheck className="h-4 w-4 mr-1.5" />
                        {r.officer ? 'Reassign' : 'Assign'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => { if (!open) setSelectedReport(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Report</DialogTitle>
            <DialogDescription>
              {selectedReport?.reference_no} — {selectedReport?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Select Officer</Label>
              <Select value={selectedOfficer} onValueChange={setSelectedOfficer} disabled={loadingUsers}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingUsers ? 'Loading officers…' : 'Choose an officer'} />
                </SelectTrigger>
                <SelectContent>
                  {officers.length === 0 ? (
                    <SelectItem value="none" disabled>No officers found</SelectItem>
                  ) : (
                    officers.map((o: any) => (
                      <SelectItem key={o.id} value={o.id.toString()}>
                        {o.name} {o.email ? `(${o.email})` : ''}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Assignment Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Textarea
                placeholder="Add instructions or context for the officer…"
                value={assignNotes}
                onChange={(e) => setAssignNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedOfficer || assignMutation.isPending}
            >
              {assignMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Assigning…</>
              ) : (
                <><UserCheck className="mr-2 h-4 w-4" /> Confirm Assignment</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
