import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Search, Loader2, FileSearch, ShieldAlert, CheckCircle, Clock } from 'lucide-react'
import reportApi, { type AnonymousTrackResult } from '@/api/reportApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const schema = z.object({
  token: z.string().min(1, 'Tracking token is required'),
})

type FormValues = z.infer<typeof schema>

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  submitted: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Submitted' },
  under_review: { color: 'bg-yellow-100 text-yellow-800', icon: FileSearch, label: 'Under Review' },
  assigned: { color: 'bg-orange-100 text-orange-800', icon: ShieldAlert, label: 'Assigned' },
  investigating: { color: 'bg-purple-100 text-purple-800', icon: Search, label: 'Investigating' },
  resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Resolved' },
  closed: { color: 'bg-muted text-foreground', icon: CheckCircle, label: 'Closed' },
}

export default function TrackReportPage() {
  const [result, setResult] = useState<AnonymousTrackResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (token: string) => reportApi.trackAnonymous(token),
    onSuccess: (res) => {
      setResult(res.data.data)
      setErrorMsg(null)
    },
    onError: (err: any) => {
      setResult(null)
      setErrorMsg(err.response?.data?.message || 'Failed to track report. Please verify your token.')
    }
  })

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data.token)
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl">
      <div className="text-center mb-10">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
          <FileSearch className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Track Anonymous Report</h1>
        <p className="text-muted-foreground">
          Enter your 64-character secret token to check the status of your report.
        </p>
      </div>

      <Card className="border-border/50 shadow-lg mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter your tracking token"
                className={`font-mono text-sm ${errors.token ? 'border-destructive' : ''}`}
                {...register('token')}
              />
              {errors.token && <p className="text-xs text-destructive mt-1">{errors.token.message}</p>}
            </div>
            <Button type="submit" disabled={mutation.isPending} className="sm:w-32">
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Track
                </>
              )}
            </Button>
          </form>
          {errorMsg && (
            <p className="text-sm text-destructive mt-4 text-center">{errorMsg}</p>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="border-border/50 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-muted/30 border-b border-border pb-4">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Report Status</span>
              <span className="text-sm font-mono text-muted-foreground font-normal">
                Ref: {result.reference_no}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                {(() => {
                  const conf = STATUS_CONFIG[result.status] || STATUS_CONFIG.submitted
                  const StatusIcon = conf.icon
                  return (
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${conf.color}`}>
                        <StatusIcon className="h-6 w-6" />
                      </div>
                      <span className="text-xl font-bold">{conf.label}</span>
                    </div>
                  )
                })()}
              </div>

              <div className="space-y-4 md:text-right">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="font-medium">{result.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Priority</p>
                  <Badge variant={result.priority === 'critical' || result.priority === 'high' ? 'destructive' : 'secondary'} className="uppercase">
                    {result.priority}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Submitted on: {new Date(result.created_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
