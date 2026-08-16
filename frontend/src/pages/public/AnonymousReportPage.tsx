import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ShieldAlert, Info, Copy, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import reportApi, { type AnonymousReportPayload } from '@/api/reportApi'
import categoryApi from '@/api/categoryApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const schema = z.object({
  category_id: z.string().min(1, 'Please select a category'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Please provide more details in the description (min 20 characters)'),
  incident_date: z.string().min(1, 'Incident date is required'),
  location: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function AnonymousReportPage() {
  const [successData, setSuccessData] = useState<{ reference_no: string; tracking_token: string; warning: string } | null>(null)

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.index,
  })

  const categories = categoriesData?.data.data || []

  const {
    register,
    handleSubmit,
    setValue,
    
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (data: AnonymousReportPayload) => reportApi.submitAnonymous(data),
    onSuccess: (res) => {
      setSuccessData(res.data.data)
      toast.success('Anonymous report submitted successfully.')
    },
    onError: () => {
      toast.error('Failed to submit report. Please try again.')
    }
  })

  const onSubmit = (data: FormValues) => {
    mutation.mutate({
      ...data,
      category_id: parseInt(data.category_id, 10),
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Tracking token copied to clipboard!')
  }

  if (successData) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-green-100 text-green-700 h-16 w-16 flex items-center justify-center rounded-full mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Report Submitted Successfully</CardTitle>
            <CardDescription>
              Your anonymous report has been securely transmitted to EOCO.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Important Warning</AlertTitle>
              <AlertDescription className="text-xs mt-1">
                {successData.warning}
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-6 rounded-lg text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reference Number</p>
                <p className="text-xl font-bold font-mono">{successData.reference_no}</p>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Your Secret Tracking Token</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="bg-background px-4 py-2 rounded border border-border text-lg font-mono font-bold text-primary">
                    {successData.tracking_token}
                  </code>
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(successData.tracking_token)} title="Copy Token">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Save this token now! It will not be shown again and is the only way to track your report.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button asChild>
                <Link to="/track">Track Report Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Anonymous Report</h1>
        <p className="text-muted-foreground">
          Submit information without revealing your identity.
        </p>
      </div>

      <Alert className="mb-8 bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-900">
        <Info className="h-4 w-4" />
        <AlertTitle>100% Anonymous</AlertTitle>
        <AlertDescription className="text-sm mt-1">
          We do not collect your IP address, browser information, or any identifying details. 
          Please ensure you do not include personally identifiable information in the description 
          if you wish to remain completely anonymous.
        </AlertDescription>
      </Alert>

      <Card className="border-border/50 shadow-md">
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
          <CardDescription>Provide as much detail as possible to assist our investigation.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category_id">Crime Category <span className="text-destructive">*</span></Label>
              <Select onValueChange={(val) => setValue('category_id', val)}>
                <SelectTrigger id="category_id" className={errors.category_id ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && <p className="text-xs text-destructive">{errors.category_id.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Report Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                placeholder="Brief summary of the incident"
                {...register('title')}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                placeholder="What happened? Who was involved? Provide all relevant details."
                className={`min-h-[150px] ${errors.description ? 'border-destructive' : ''}`}
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="incident_date">Incident Date <span className="text-destructive">*</span></Label>
                <Input
                  id="incident_date"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  {...register('incident_date')}
                  className={errors.incident_date ? 'border-destructive' : ''}
                />
                {errors.incident_date && <p className="text-xs text-destructive">{errors.incident_date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  placeholder="Where did this occur?"
                  {...register('location')}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Securely...
                </>
              ) : (
                'Submit Anonymous Report'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
