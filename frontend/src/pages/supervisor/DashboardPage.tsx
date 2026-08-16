import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle } from 'lucide-react'

import reportApi from '@/api/reportApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/loaders/PageLoader'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  
  const { data, isLoading } = useQuery({
    queryKey: ['supervisor', 'reports'],
    queryFn: () => reportApi.index({ per_page: 5 }),
  })

  if (isLoading) return <PageLoader />

  const reports: any[] = (data?.data.data as any)?.data || data?.data.data || []
  
  const pendingCount = reports.filter(r => ['submitted', 'under_review'].includes(r.status)).length
  const activeCount = reports.filter(r => ['assigned', 'investigating'].includes(r.status)).length
  const resolvedCount = reports.filter(r => ['resolved', 'closed'].includes(r.status)).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Supervisor Dashboard</h1>
          <p className="text-muted-foreground">Overview of system-wide reports.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investigations</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You haven't submitted any reports yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map(r => (
                <div key={r.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <Link to={`/supervisor/reports/${r.id}`} className="font-medium hover:underline text-lg">
                      {r.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">Ref: {r.reference_no} • {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="outline">{r.status}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/supervisor/reports">View All Reports</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
