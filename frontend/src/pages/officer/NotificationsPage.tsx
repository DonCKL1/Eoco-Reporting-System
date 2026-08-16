import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCircle2 } from 'lucide-react'
import { notificationApi } from '@/api/index'
import { PageLoader } from '@/components/loaders/PageLoader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function NotificationsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.index(),
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: () => toast.error('Failed to mark notification as read')
  })

  const notifications: any[] = (data?.data.data as any)?.data || data?.data.data || []

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Notifications</h1>
          <p className="text-muted-foreground">Stay updated on recent activities and alerts.</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center p-12 bg-card rounded-lg border border-border">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-muted-foreground mt-1">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notif: any) => (
            <Card key={notif.id} className={cn("transition-colors", notif.read_at ? "bg-muted/30" : "bg-card border-l-4 border-l-primary")}>
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="space-y-1">
                  <h4 className={cn("font-medium", !notif.read_at && "font-bold")}>{notif.title}</h4>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                  <p className="text-xs text-muted-foreground/70 pt-2">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                {!notif.read_at && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => markReadMutation.mutate(notif.id)}
                    disabled={markReadMutation.isPending}
                    className="shrink-0"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Read
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
