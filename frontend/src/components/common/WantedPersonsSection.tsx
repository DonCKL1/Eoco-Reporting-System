import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ShieldAlert, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import wantedPersonApi from '@/api/wantedPersonApi'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function WantedPersonsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['wanted-persons', 'public'],
    queryFn: wantedPersonApi.index,
  })

  const persons = data?.data.data || []
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    if (persons.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % persons.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [persons.length, isPaused])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % persons.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + persons.length) % persons.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    if (diff > 50) nextSlide()
    if (diff < -50) prevSlide()
    touchStartX.current = null
  }

  return (
    <section className="py-12 bg-muted/10 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-4">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Wanted Persons</h2>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            These individuals are currently wanted by the Economic and Organised Crime Office in connection with ongoing investigations. If you have any information, please report it immediately.
          </p>
        </div>

        {isLoading ? (
          <div className="max-w-sm mx-auto">
            <Card className="overflow-hidden">
              <Skeleton className="h-[350px] w-full rounded-none" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : isError ? (
          <div className="text-center text-destructive p-8 bg-destructive/5 rounded-lg border border-destructive/20 max-w-2xl mx-auto">
            <p>Failed to load wanted persons. Please try again later.</p>
          </div>
        ) : persons.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 bg-muted/20 rounded-lg max-w-2xl mx-auto">
            <p>No wanted persons currently listed.</p>
          </div>
        ) : (
          <div 
            className="relative max-w-[280px] sm:max-w-sm md:max-w-md mx-auto px-10 md:px-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="overflow-hidden rounded-xl bg-card border shadow-lg relative">
              <div 
                className="flex transition-transform duration-500 ease-in-out" 
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {persons.map((person: any) => (
                  <div key={person.id} className="min-w-full flex-shrink-0 flex flex-col">
                    <div className="relative w-full bg-muted flex justify-center">
                      <div className="w-full max-w-[280px] sm:max-w-sm h-[320px] sm:h-[384px] relative">
                        <img
                          src={person.image_path}
                          alt={person.full_name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/384x400?text=No+Photo'
                          }}
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                            Wanted
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full mx-auto p-4 md:p-6 flex flex-col items-center text-center bg-card">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <span className="text-xs font-bold text-destructive tracking-wide uppercase">Official Notice</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-1">{person.full_name}</h3>
                      
                      {person.alias && (
                        <p className="text-muted-foreground text-sm mb-4">
                          Also known as: <span className="text-foreground font-medium">{person.alias}</span>
                        </p>
                      )}
                      
                      <div className="flex flex-wrap justify-center gap-3 mb-4 mt-2 text-xs">
                        {person.case_reference && (
                          <p>
                            <span className="font-semibold text-muted-foreground mr-1">Case Ref:</span>
                            {person.case_reference}
                          </p>
                        )}
                        {person.wanted_since && (
                          <p>
                            <span className="font-semibold text-muted-foreground mr-1">Wanted since:</span>
                            {new Date(person.wanted_since).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="w-full bg-destructive/10 p-4 rounded-lg border border-destructive/20 text-center space-y-3">
                        <p className="text-sm text-foreground font-medium">
                          Do you have information regarding the whereabouts of this individual?
                        </p>
                        <Button asChild variant="destructive" size="sm" className="w-full font-semibold px-4">
                          <Link to={`/report-crime?ref=${encodeURIComponent(person.full_name)}`}>
                            Report Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            {persons.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -left-2 md:-left-4 top-[35%] -translate-y-1/2 rounded-full shadow-md h-8 w-8 md:h-10 md:w-10 bg-background/90 hover:bg-background border-border z-10"
                  onClick={prevSlide}
                  aria-label="Previous person"
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -right-2 md:-right-4 top-[35%] -translate-y-1/2 rounded-full shadow-md h-8 w-8 md:h-10 md:w-10 bg-background/90 hover:bg-background border-border z-10"
                  onClick={nextSlide}
                  aria-label="Next person"
                >
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                </Button>

                <div className="flex justify-center items-center mt-6 gap-3">
                  <div className="text-xs font-semibold text-muted-foreground min-w-[40px] text-right">
                    {currentIndex + 1} / {persons.length}
                  </div>
                  <div className="flex gap-1.5 flex-wrap max-w-full justify-center px-2">
                    {persons.map((_: any, i: number) => (
                      <button
                        key={i}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === currentIndex ? 'w-5 bg-primary' : 'w-2 bg-primary/30 hover:bg-primary/50'
                        }`}
                        onClick={() => setCurrentIndex(i)}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
