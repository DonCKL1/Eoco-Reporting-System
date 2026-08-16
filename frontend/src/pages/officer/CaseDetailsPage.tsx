import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Paperclip, MessageSquare, ArrowLeft, Send, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

import reportApi from '@/api/reportApi'
import { evidenceApi, messageApi, caseNotesApi } from '@/api/index'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageLoader } from '@/components/loaders/PageLoader'
import { EvidenceViewer } from '@/components/common/EvidenceViewer'
import { useAuthStore } from '@/store/authStore'

export default function ReportDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const reportId = parseInt(id as string, 10)
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((s) => s.user)

  // State
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [statusNote, setStatusNote] = useState<string>('')
  const [messageText, setMessageText] = useState<string>('')
  const [newNoteText, setNewNoteText] = useState<string>('')

  // Queries
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

  const { data: caseNotesData, isLoading: isLoadingNotes } = useQuery({
    queryKey: ['case-notes', reportId],
    queryFn: () => caseNotesApi.index(reportId),
    enabled: !!reportId,
  })

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ status, notes }: { status: string; notes?: string }) =>
      reportApi.updateStatus(reportId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report', reportId] })
      queryClient.invalidateQueries({ queryKey: ['officer', 'assigned-reports'] })
      toast.success('Case status updated successfully')
      setStatusNote('')
    },
    onError: () => {
      toast.error('Failed to update case status')
    },
  })

  const sendMessageMutation = useMutation({
    mutationFn: ({ receiverId, text }: { receiverId: number; text: string }) =>
      messageApi.store({
        report_id: reportId,
        receiver_id: receiverId,
        body: text,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', reportId] })
      setMessageText('')
      toast.success('Message sent to citizen')
    },
    onError: () => {
      toast.error('Failed to send message')
    },
  })

  const addNoteMutation = useMutation({
    mutationFn: (noteText: string) => caseNotesApi.store(reportId, noteText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-notes', reportId] })
      toast.success('Case note added')
      setNewNoteText('')
    },
    onError: () => {
      toast.error('Failed to add case note')
    },
  })

  if (isLoadingReport) return <PageLoader />

  const report = reportData?.data.data
  const evidence = evidenceData?.data.data || []
  const rawMessages: any = messagesData?.data
  const messages: any[] = rawMessages?.data?.data || rawMessages?.data || []
  const caseNotes: any[] = caseNotesData?.data.data || []

  if (!report) {
    return <div className="p-8 text-center text-muted-foreground">Report not found.</div>
  }

  const currentStatus = selectedStatus || report.status

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentStatus) return
    updateStatusMutation.mutate({ status: currentStatus, notes: statusNote })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return
    const reporterId = report.user_id || report.user?.id
    if (!reporterId) {
      toast.error('Cannot message an anonymous reporter.')
      return
    }
    sendMessageMutation.mutate({ receiverId: reporterId, text: messageText.trim() })
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteText.trim()) return
    addNoteMutation.mutate(newNoteText.trim())
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/officer/cases">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Case Details</h1>
            <p className="text-muted-foreground font-mono">Ref: {report.reference_no}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="capitalize px-3 py-1 text-xs font-semibold">{report.status}</Badge>
          <Badge variant={report.priority === 'critical' || report.priority === 'high' ? 'destructive' : 'secondary'} className="capitalize px-3 py-1 text-xs font-semibold">
            {report.priority} Priority
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>
                Category: {report.category?.name || 'General'} • Submitted: {format(new Date(report.created_at), 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <div className="p-4 bg-muted/30 rounded-md whitespace-pre-wrap leading-relaxed text-sm">
                  {report.description}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Incident Date</h4>
                  <p className="text-sm font-medium">{format(new Date(report.incident_date), 'PPP')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                  <p className="text-sm font-medium">{report.location || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="evidence" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="evidence">
                <Paperclip className="h-4 w-4 mr-2" /> Evidence ({evidence.length})
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" /> Messages ({messages.length})
              </TabsTrigger>
              <TabsTrigger value="notes">
                <FileText className="h-4 w-4 mr-2" /> Case Notes ({caseNotes.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Evidence Tab */}
            <TabsContent value="evidence" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Attached Evidence Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <EvidenceViewer evidence={evidence} isLoading={isLoadingEvidence} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages / Communication Tab */}
            <TabsContent value="messages" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Direct Communication</span>
                    {report.user ? (
                      <span className="text-xs font-normal text-muted-foreground">
                        Chatting with reporter: <strong className="text-foreground">{report.user.name}</strong>
                      </span>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Anonymous Report</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Messages Feed */}
                  {isLoadingMessages ? (
                    <div className="py-8 text-center text-muted-foreground">Loading conversation...</div>
                  ) : messages.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground bg-muted/20 rounded-md">
                      No messages exchanged yet for this case.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto p-2">
                      {messages.map((msg: any) => {
                        const isMe = msg.sender?.id === currentUser?.id
                        return (
                          <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                              <p className="whitespace-pre-wrap">{msg.body || msg.message}</p>
                            </div>
                            <span className="text-[11px] text-muted-foreground mt-1 px-1">
                              {isMe ? 'You' : msg.sender?.name || 'Reporter'} • {format(new Date(msg.created_at), 'p')}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Send Message Form */}
                  {report.user_id || report.user?.id ? (
                    <form onSubmit={handleSendMessage} className="space-y-3 pt-4 border-t">
                      <Label htmlFor="message-input" className="text-sm font-medium">Send Message to Reporter</Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="message-input"
                          placeholder="Type your message to the citizen..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          rows={2}
                          className="resize-none"
                        />
                        <Button 
                          type="submit" 
                          disabled={!messageText.trim() || sendMessageMutation.isPending}
                          className="shrink-0 self-end"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-3 bg-muted/40 border rounded-md text-xs text-muted-foreground flex items-center gap-2 mt-4">
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Direct messaging is disabled because this report was submitted anonymously.</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Case Notes Tab */}
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Internal Investigation Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleAddNote} className="space-y-3 pb-4 border-b">
                    <Label htmlFor="note-input" className="text-sm font-medium">Add Investigation Note</Label>
                    <Textarea
                      id="note-input"
                      placeholder="Add an internal progress update or note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      rows={2}
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={!newNoteText.trim() || addNoteMutation.isPending}
                    >
                      {addNoteMutation.isPending ? 'Saving...' : 'Add Note'}
                    </Button>
                  </form>

                  {isLoadingNotes ? (
                    <div className="py-4 text-center text-muted-foreground">Loading notes...</div>
                  ) : caseNotes.length === 0 ? (
                    <div className="py-6 text-center text-muted-foreground text-sm">No internal notes added yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {caseNotes.map((note: any) => (
                        <div key={note.id} className="p-3 bg-muted/30 rounded-md border text-sm space-y-1">
                          <p className="whitespace-pre-wrap">{note.note}</p>
                          <div className="text-xs text-muted-foreground flex items-center justify-between pt-1">
                            <span>Officer: {note.officer?.name || 'Assigned Officer'}</span>
                            <span>{format(new Date(note.created_at), 'PPP p')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Info & Case Management */}
        <div className="space-y-6">
          {/* Case Status Manager */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Update Case Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStatusSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Status</Label>
                  <Select value={currentStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status-notes" className="text-xs font-medium">Reason / Note (Optional)</Label>
                  <Input
                    id="status-notes"
                    placeholder="Brief explanation for change..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? 'Updating...' : 'Save Case Status'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reporter & Meta Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Reporter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Reporter Name</p>
                <p className="font-medium">{report.user?.name || 'Anonymous Submission'}</p>
              </div>
              {report.user?.email && (
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium font-mono text-xs">{report.user.email}</p>
                </div>
              )}
              {report.user?.phone && (
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium font-mono text-xs">{report.user.phone}</p>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="font-medium text-xs">{format(new Date(report.updated_at), 'PPP p')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
