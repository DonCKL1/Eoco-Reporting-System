import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Paperclip, MessageSquare, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

import reportApi from '@/api/reportApi'
import { evidenceApi, messageApi } from '@/api/index'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageLoader } from '@/components/loaders/PageLoader'
import { EvidenceViewer } from '@/components/common/EvidenceViewer'

export default function ReportDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const reportId = parseInt(id as string, 10)

  const { data: reportData, isLoading: isLoadingReport } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => reportApi.show(reportId),
    enabled: !!reportId,
  })

  const { data: evidenceData, isLoading: isLoadingEvidence } = useQuery({
    queryKey: ['evidence', reportId],
    queryFn: () => evidenceApi.index(reportId),
    enabled: !!reportId,
  })

  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', reportId],
    queryFn: () => messageApi.byReport(reportId),
    enabled: !!reportId,
  })

  if (isLoadingReport) return <PageLoader />

  const report = reportData?.data.data
  const evidence = evidenceData?.data.data || []
  const messages = messagesData?.data.data || []

  if (!report) {
    return <div className="p-8 text-center text-muted-foreground">Report not found.</div>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Report Details</h1>
            <p className="text-muted-foreground font-mono">Ref: {report.reference_no}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="capitalize">{report.status}</Badge>
          <Badge variant={report.priority === 'critical' || report.priority === 'high' ? 'destructive' : 'secondary'} className="capitalize">
            {report.priority} Priority
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>
                Category: {report.category.name} • Submitted: {format(new Date(report.created_at), 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <div className="p-4 bg-muted/30 rounded-md whitespace-pre-wrap">
                  {report.description}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Incident Date</h4>
                  <p>{format(new Date(report.incident_date), 'PPP')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                  <p>{report.location || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="evidence">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="evidence">
                <Paperclip className="h-4 w-4 mr-2" /> Evidence Files
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" /> Communication
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="evidence" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Attached Evidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <EvidenceViewer evidence={evidence} isLoading={isLoadingEvidence} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingMessages ? (
                    <div className="py-4 text-center">Loading...</div>
                  ) : messages.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground bg-muted/20 rounded-md">
                      No messages yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg: any) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender.id === report.user_id ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender.id === report.user_id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p className="text-sm">{msg.body}</p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {msg.sender.name} • {format(new Date(msg.created_at), 'p')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Reporter</p>
                <p className="font-medium">{report.user?.name || 'Anonymous'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(new Date(report.updated_at), 'PPP p')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
