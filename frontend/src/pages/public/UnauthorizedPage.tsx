import { Link } from 'react-router-dom'
import { Lock, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
          <Lock className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-6xl font-bold text-foreground mb-2">403</h1>
        <h2 className="text-xl font-semibold text-foreground mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-8">
          You do not have permission to access this page. Contact your administrator if you 
          believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/"><Home className="mr-2 h-4 w-4" />Go Home</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
