import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import reportApi from '@/api/reportApi'
import { analyticsApi } from '@/api/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/loaders/PageLoader'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-destructive)', '#00C49F', '#8884d8']

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: reportsData, isLoading: isLoadingReports } = useQuery({
    queryKey: ['assigned-reports'],
    queryFn: () => reportApi.assignedReports({ per_page: 5 }),
  })

  const { data: dashboardData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard', 'officer'],
    queryFn: analyticsApi.dashboard,
  })

  if (isLoadingReports || isLoadingStats) return <PageLoader />

  const reports = reportsData?.data.data?.data || []
  const stats = (dashboardData?.data.data as any) || { total_assigned: 0, resolved_cases: 0, status_summary: [] }

  const statusMap = stats.status_summary.reduce((acc: any, curr: any) => {
    acc[curr.status] = curr.total
    return acc
  }, {})

  const investigatingCount = statusMap['investigating'] || 0

  const pieData = stats.status_summary.map((s: any) => ({
    name: s.status.replace('_', ' ').toUpperCase(),
    value: s.total
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Officer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Officer {user?.name}. Here are your case assignments.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investigatingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved_cases}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cases by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
                      {pieData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No cases assigned yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Assignments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/officer/cases">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground">You don't have any recent case assignments.</p>
            ) : (
              <div className="space-y-4">
                {reports.map((report: any) => (
                  <div key={report.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium hover:underline cursor-pointer">
                        <Link to={`/officer/cases/${report.id}`}>{report.reference_no}</Link>
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{report.title}</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="capitalize">{report.status.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
