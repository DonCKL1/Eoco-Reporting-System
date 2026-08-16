import { type ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { QueryProvider } from './QueryProvider'
import { Toaster } from 'sonner'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <Toaster
          position="top-right"
          richColors
          expand
          closeButton
          toastOptions={{
            duration: 4000,
            classNames: {
              toast: 'font-medium',
              title: 'text-sm font-semibold',
              description: 'text-xs',
            },
          }}
        />
      </QueryProvider>
    </ThemeProvider>
  )
}
