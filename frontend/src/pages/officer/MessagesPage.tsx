import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MessageSquare, ArrowRight } from 'lucide-react'
import messageApi from '@/api/messageApi'
import { PageLoader } from '@/components/loaders/PageLoader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function MessagesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['officer', 'messages'],
    queryFn: () => messageApi.index(),
  })

  if (isLoading) return <PageLoader />

  const messages: any[] = (data?.data.data as any)?.data || data?.data.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Recent messages across all your assigned cases.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40">
              <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">You have no messages yet.</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((msg: any) => (
            <Card key={msg.id}>
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      Message from {msg.sender?.name || 'Unknown'}
                      {msg.is_read ? null : <Badge variant="default" className="text-xs">New</Badge>}
                    </CardTitle>
                    <CardDescription>
                      {new Date(msg.created_at).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/officer/cases/${msg.report_id}`}>
                      Go to Case <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="py-2 pb-4">
                <p className="text-sm bg-muted p-3 rounded-md line-clamp-2">
                  {msg.body}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
