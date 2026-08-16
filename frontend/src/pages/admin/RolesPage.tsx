import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { rolesApi } from '@/api/index'
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
import { PageLoader } from '@/components/loaders/PageLoader'

const schema = z.object({
  name: z.string().min(1, 'Role name is required'),
})

type FormValues = z.infer<typeof schema>

export default function RolesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: rolesApi.index,
  })

  const roles = data?.data.data || []
  

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const createMutation = useMutation({
    mutationFn: (data: FormValues) => rolesApi.store(data as any), // simplify for this demo
    onSuccess: () => {
      toast.success('Role created successfully')
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] })
      setIsAddOpen(false)
      reset()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create role')
    }
  })

  const onSubmitAdd = (data: FormValues) => createMutation.mutate(data)

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage system roles and access controls.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input id="name" {...register('name')} placeholder="e.g. Moderator" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                Create Role
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Permissions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground h-24">No roles found.</TableCell>
              </TableRow>
            ) : (
              roles.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {r.permissions && r.permissions.length > 0 ? (
                        r.permissions.map((p: any) => (
                          <Badge key={p.id} variant="secondary" className="text-xs font-normal">
                            {p.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">No permissions assigned</span>
                      )}
                    </div>
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
