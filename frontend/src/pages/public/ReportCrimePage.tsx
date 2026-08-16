import { useAuthStore } from '@/store/authStore'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ShieldAlert, LogIn, UserX, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import reportApi, { type StoreReportPayload } from '@/api/reportApi'
import categoryApi from '@/api/categoryApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const schema = z.object({
  category_id: z.string().min(1, 'Please select a category'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Please provide more details (min 20 characters)'),
  incident_date: z.string().min(1, 'Incident date is required'),
  location: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function ReportCrimePage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTitle = searchParams.get('ref') ? `Information regarding wanted person: ${searchParams.get('ref')}` : ''

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
    defaultValues: {
      title: initialTitle,
    }
  })

  const mutation = useMutation({
    mutationFn: (data: StoreReportPayload) => reportApi.store(data),
    onSuccess: () => {
      toast.success('Report submitted successfully.')
      navigate('/citizen', { replace: true })
    },
    onError: () => {
      toast.error('Failed to submit report. Please try again.')
    }
  })

  const onSubmit = (data: FormValues) => {
    mutation.mutate({
      ...data,
      category_id: parseInt(data.category_id, 10),
      priority: 'normal',
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-20 px-4 max-w-4xl text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 mb-6">
          <ShieldAlert className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Report a Crime to EOCO</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Help us fight economic and organised crime in Ghana. Choose how you would like to proceed.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="border-border/50 shadow-lg hover:border-primary transition-colors">
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Login to Report</CardTitle>
              <CardDescription>
                Track your report, receive updates, and communicate directly with investigators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/login">Sign In</Link>
              </Button>
              <div className="mt-4 text-sm text-muted-foreground">
                Don't have an account? <Link to="/register" className="text-primary hover:underline">Register here</Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg hover:border-destructive transition-colors">
            <CardHeader>
              <div className="bg-destructive/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <UserX className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Report Anonymously</CardTitle>
              <CardDescription>
                Submit information without revealing your identity. 100% confidential.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="destructive" className="w-full">
                <Link to="/anonymous-report">Submit Anonymously</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Submit Official Report</h1>
        <p className="text-muted-foreground">
          Provide detailed information about the economic or organised crime incident.
        </p>
      </div>

      <Card className="border-border/50 shadow-md">
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
          <CardDescription>All fields marked with an asterisk (*) are required.</CardDescription>
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
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
