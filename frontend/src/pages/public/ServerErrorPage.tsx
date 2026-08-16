import { Link } from 'react-router-dom'
import { ServerCrash, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
          <ServerCrash className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-6xl font-bold text-foreground mb-2">500</h1>
        <h2 className="text-xl font-semibold text-foreground mb-4">Server Error</h2>
        <p className="text-muted-foreground mb-8">
          Something went wrong on our end. Please try again in a moment.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/"><Home className="mr-2 h-4 w-4" />Go Home</Link>
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}
