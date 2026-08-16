import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle,
  Search,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import reportApi from '@/api/reportApi'
import { analyticsApi } from '@/api/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/loaders/PageLoader'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-destructive)', '#00C49F', '#8884d8']

const CARD_GLASS = 'max-md:bg-card/60 max-md:backdrop-blur-xl max-md:border-white/20 max-md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-md:rounded-2xl transition-all'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: reportsData, isLoading: isLoadingReports } = useQuery({
    queryKey: ['my-reports'],
    queryFn: () => reportApi.index({ per_page: 5 }),
  })

  const { data: dashboardData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard', 'citizen'],
    queryFn: analyticsApi.dashboard,
  })

  if (isLoadingReports || isLoadingStats) return <PageLoader />

  const reports = reportsData?.data.data?.data || []
  const stats = (dashboardData?.data.data as any) || { total_reports: 0, status_summary: [] }

  const statusMap = stats.status_summary.reduce((acc: any, curr: any) => {
    acc[curr.status] = curr.total
    return acc
  }, {})

  const pendingCount = (statusMap['submitted'] || 0) + (statusMap['under_review'] || 0)
  const investigatingCount = statusMap['investigating'] || 0
  const resolvedCount = (statusMap['resolved'] || 0) + (statusMap['closed'] || 0)

  const pieData = stats.status_summary.map((s: any) => ({
    name: s.status.replace('_', ' ').toUpperCase(),
    value: s.total
  }))

  const statCards = [
    {
      label: 'Total Reports',
      value: stats.total_reports,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      href: '/citizen/reports',
    },
    {
      label: 'Pending Review',
      value: pendingCount,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      href: '/citizen/reports?status=submitted',
    },
    {
      label: 'Investigating',
      value: investigatingCount,
      icon: Search,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      href: '/citizen/reports?status=investigating',
    },
    {
      label: 'Resolved',
      value: resolvedCount,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      href: '/citizen/reports?status=resolved',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Here is an overview of your reports.</p>
        </div>
        <Button asChild className="hidden md:inline-flex">
          <Link to="/citizen/reports/create">
            <PlusCircle className="mr-2 h-4 w-4" /> New Report
          </Link>
        </Button>
      </div>

      {/* Stat Cards — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {statCards.map((card) => (
          <Link key={card.label} to={card.href} className="group">
            <Card className={`${CARD_GLASS} hover:shadow-md hover:border-primary/20 cursor-pointer transition-all duration-200 group-hover:-translate-y-0.5`}>
              <CardContent className="p-4 md:pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-9 w-9 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-2xl font-bold tracking-tight">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Chart + Recent Reports */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Status Breakdown — hidden on mobile */}
        <Card className={`${CARD_GLASS} hidden md:block`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Status Breakdown
            </CardTitle>
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
                  No reports yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className={CARD_GLASS}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base md:text-lg">Recent Reports</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/citizen/reports">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="py-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">You haven't submitted any reports yet.</p>
                <Button asChild size="sm" variant="outline" className="mt-4">
                  <Link to="/citizen/reports/create">
                    <PlusCircle className="mr-2 h-3.5 w-3.5" /> Submit your first report
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report: any) => (
                  <Link
                    key={report.id}
                    to={`/citizen/reports/${report.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-all group cursor-pointer"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1 mr-3">
                      <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                        {report.reference_no}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{report.title}</p>
                    </div>
                    <Badge variant="outline" className="capitalize text-[10px] shrink-0">
                      {report.status.replace('_', ' ')}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
