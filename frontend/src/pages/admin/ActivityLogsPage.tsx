import { useQuery } from '@tanstack/react-query'
import { Activity } from 'lucide-react'
import { activityLogApi } from '@/api/index'
import { PageLoader } from '@/components/loaders/PageLoader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function ActivityLogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'activity-logs'],
    queryFn: () => activityLogApi.index({ per_page: 100 }),
  })

  const logs: any[] = (data?.data.data as any)?.data || data?.data.data || []

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">Audit trail of all actions performed in the system.</p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  <div className="flex flex-col items-center justify-center">
                    <Activity className="h-8 w-8 text-muted-foreground mb-2" />
                    <p>No activity logs found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {log.user ? (
                      <span className="font-medium">{log.user.name}</span>
                    ) : (
                      <span className="italic text-muted-foreground">System/Anonymous</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{log.description}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {log.ip_address || '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
