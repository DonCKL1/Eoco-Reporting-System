import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import reportApi, { type StoreReportPayload } from '@/api/reportApi'
import categoryApi from '@/api/categoryApi'
import { evidenceApi } from '@/api/index'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EvidenceUpload, EvidenceUploadProgress } from '@/components/forms/EvidenceUpload'

const schema = z.object({
  category_id: z.string().min(1, 'Please select a category'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Please provide more details (min 20 characters)'),
  incident_date: z.string().min(1, 'Incident date is required'),
  location: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface EvidenceFile {
  file: File
  preview?: string
  type: 'image' | 'video' | 'document'
}

export default function CreateReportPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([])
  const [uploadProgress, setUploadProgress] = useState({ uploading: false, current: 0, total: 0 })

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
    mutationFn: async (data: StoreReportPayload) => {
      // 1. Create the report
      const response = await reportApi.store(data)
      const reportId = response.data.data.id

      // 2. Upload evidence files sequentially
      if (evidenceFiles.length > 0) {
        setUploadProgress({ uploading: true, current: 0, total: evidenceFiles.length })

        for (let i = 0; i < evidenceFiles.length; i++) {
          setUploadProgress({ uploading: true, current: i + 1, total: evidenceFiles.length })
          try {
            await evidenceApi.upload(reportId, evidenceFiles[i].file)
          } catch {
            toast.error(`Failed to upload: ${evidenceFiles[i].file.name}`)
          }
        }

        setUploadProgress({ uploading: false, current: 0, total: 0 })
      }

      return response
    },
    onSuccess: () => {
      toast.success('Report submitted successfully.')
      queryClient.invalidateQueries({ queryKey: ['citizen', 'reports'] })
      queryClient.invalidateQueries({ queryKey: ['my-reports'] })
      navigate('/citizen/reports')
    },
    onError: () => {
      setUploadProgress({ uploading: false, current: 0, total: 0 })
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

  const isSubmitting = mutation.isPending || uploadProgress.uploading

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Submit New Report</h1>
        <p className="text-muted-foreground">Provide information about a suspected crime.</p>
      </div>

      <Card className="max-md:bg-card/60 max-md:backdrop-blur-xl max-md:border-white/20 max-md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-md:rounded-2xl transition-all">
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>Fill out the form below. Information is securely transmitted.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category_id">Crime Category</Label>
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
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                placeholder="Brief summary"
                {...register('title')}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Provide all relevant details"
                className={`min-h-[150px] ${errors.description ? 'border-destructive' : ''}`}
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="incident_date">Incident Date</Label>
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

            {/* Evidence Upload Section */}
            <div className="border-t border-border pt-6">
              <EvidenceUpload
                files={evidenceFiles}
                onFilesChange={setEvidenceFiles}
                disabled={isSubmitting}
              />
            </div>

            {/* Upload progress */}
            {uploadProgress.uploading && (
              <EvidenceUploadProgress
                current={uploadProgress.current}
                total={uploadProgress.total}
              />
            )}

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {uploadProgress.uploading
                  ? 'Uploading Evidence…'
                  : mutation.isPending
                    ? 'Submitting…'
                    : 'Submit Report'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
