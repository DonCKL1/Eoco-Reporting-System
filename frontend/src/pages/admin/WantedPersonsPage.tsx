import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import wantedPersonApi, { type WantedPerson, type StoreWantedPersonPayload } from '@/api/wantedPersonApi'
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
import { Badge } from '@/components/ui/badge'

const schema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  alias: z.string().optional(),
  image_path: z.string().min(1, 'Image path is required'),
  case_reference: z.string().optional(),
  is_active: z.boolean(),
})

type FormValues = { full_name: string; alias?: string; image_path: string; case_reference?: string; is_active: boolean }

export default function WantedPersonsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  
  
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'wanted-persons'],
    queryFn: wantedPersonApi.adminIndex,
  })

  const persons = data?.data.data || []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_active: true,
    }
  })

  const createMutation = useMutation({
    mutationFn: wantedPersonApi.store,
    onSuccess: () => {
      toast.success('Wanted person added')
      queryClient.invalidateQueries({ queryKey: ['admin', 'wanted-persons'] })
      queryClient.invalidateQueries({ queryKey: ['wanted-persons', 'public'] })
      setIsAddOpen(false)
      reset()
    },
    onError: () => toast.error('Failed to add wanted person')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<StoreWantedPersonPayload> }) => 
      wantedPersonApi.update(id, payload),
    onSuccess: () => {
      toast.success('Wanted person updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'wanted-persons'] })
      queryClient.invalidateQueries({ queryKey: ['wanted-persons', 'public'] })
      
    },
    onError: () => toast.error('Failed to update wanted person')
  })

  const deleteMutation = useMutation({
    mutationFn: wantedPersonApi.destroy,
    onSuccess: () => {
      alertSuccess('Deleted', 'Wanted person deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'wanted-persons'] })
      queryClient.invalidateQueries({ queryKey: ['wanted-persons', 'public'] })
    },
    onError: () => alertError('Error', 'Failed to delete wanted person')
  })

  const handleDelete = async (id: number) => {
    if (await confirmAction('Delete Record', 'Are you sure you want to delete this wanted person record?', 'Delete')) {
      deleteMutation.mutate(id);
    }
  }

  const onSubmitAdd = (data: FormValues) => createMutation.mutate(data)
  
  const handleToggleStatus = async (person: WantedPerson) => {
    const action = person.is_active ? 'deactivate' : 'activate';
    if (await confirmAction('Change Status', `Are you sure you want to ${action} this record?`, 'Yes')) {
      updateMutation.mutate({ 
        id: person.id, 
        payload: { is_active: !person.is_active } 
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Wanted Persons</h1>
          <p className="text-muted-foreground">Manage the public wanted persons list.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Person
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Wanted Person</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" {...register('full_name')} />
                {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
              </div>
              <div>
                <Label htmlFor="alias">Alias (Optional)</Label>
                <Input id="alias" {...register('alias')} />
              </div>
              <div>
                <Label htmlFor="image_path">Image Path (e.g. /src/assets/images/xyz.jpg)</Label>
                <Input id="image_path" {...register('image_path')} />
                {errors.image_path && <p className="text-xs text-destructive">{errors.image_path.message}</p>}
              </div>
              <div>
                <Label htmlFor="case_reference">Case Reference (Optional)</Label>
                <Input id="case_reference" {...register('case_reference')} />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Alias</TableHead>
              <TableHead>Case Ref</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : persons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">No records found.</TableCell>
              </TableRow>
            ) : (
              persons.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <img src={p.image_path} alt={p.full_name} className="h-10 w-10 rounded-full object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{p.full_name}</TableCell>
                  <TableCell>{p.alias || '-'}</TableCell>
                  <TableCell>{p.case_reference || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={p.is_active ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => handleToggleStatus(p)}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} title="Delete">
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
