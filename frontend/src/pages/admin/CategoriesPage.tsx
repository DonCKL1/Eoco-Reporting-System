import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import categoryApi from '@/api/categoryApi'
import { confirmAction, alertSuccess, alertError } from '@/lib/confirm'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PageLoader } from '@/components/loaders/PageLoader'
import { type Category } from '@/types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function CategoriesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.index,
  })

  const categories = data?.data.data || []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const createMutation = useMutation({
    mutationFn: categoryApi.store,
    onSuccess: () => {
      toast.success('Category created successfully')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsAddOpen(false)
      reset()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create category')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: categoryApi.destroy,
    onSuccess: () => {
      alertSuccess('Deleted', 'Category deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err: any) => {
      alertError('Error', err.response?.data?.message || 'Failed to delete category')
    }
  })

  const handleDelete = async (id: number) => {
    if (await confirmAction('Delete Category', 'Are you sure you want to delete this category?', 'Delete')) {
      deleteMutation.mutate(id);
    }
  }

  const onSubmitAdd = (data: FormValues) => createMutation.mutate(data)

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report Categories</h1>
          <p className="text-muted-foreground">Manage crime categories used in the system.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" {...register('name')} placeholder="e.g. Money Laundering" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} placeholder="Brief description of the category..." />
              </div>

              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                Create Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground h-24">No categories found.</TableCell>
              </TableRow>
            ) : (
              categories.map((c: Category) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.description || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} title="Delete Category">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
