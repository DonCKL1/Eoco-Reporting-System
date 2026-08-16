import { Link } from 'react-router-dom'
import { Shield, ArrowLeft, Lock, Users, FileSearch, AlertTriangle, CheckCircle, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WantedPersonsSection } from '@/components/common/WantedPersonsSection'

const features = [
  {
    icon: Shield,
    title: 'Secure Reporting',
    description: 'Military-grade encryption protects your identity and information.',
  },
  {
    icon: Users,
    title: 'Anonymous Options',
    description: 'Report crimes without revealing your identity when needed.',
  },
  {
    icon: FileSearch,
    title: 'Real-time Tracking',
    description: 'Monitor your report status from submission to resolution.',
  },
  {
    icon: CheckCircle,
    title: 'Professional Response',
    description: 'Dedicated officers investigate every credible report.',
  },
  {
    icon: Globe,
    title: 'Accessible Anywhere',
    description: 'Report from anywhere in Ghana, 24 hours a day.',
  },
  {
    icon: Lock,
    title: 'Data Protection',
    description: 'Your data is protected under Ghana\'s Data Protection Act.',
  },
]

const stats = [
  { value: '15,000+', label: 'Reports Filed' },
  { value: '89%', label: 'Resolution Rate' },
  { value: '48h', label: 'Avg. Response Time' },
  { value: '200+', label: 'Officers Active' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/Eoco_Profile-2.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/Eoco_Profile-2-poster.jpg"
        />


        {/* Decorative curved bottom edge — transitions hero into CTA */}
        <div className="absolute bottom-0 left-0 right-0 z-20 leading-none">
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-16 sm:h-20"
          >
            <path
              d="M0,80 C480,0 960,0 1440,80 L1440,80 L0,80 Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Hero Text — below video, above CTA */}
      <section className="bg-background pt-10 pb-4 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 tracking-wide uppercase">
            Economic &amp; Organised Crime Office — Ghana
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Report Crime.{' '}
            <span className="text-muted-foreground font-light">Stay Safe.</span>{' '}
            Seek Justice.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            EOCO's secure digital platform empowers citizens to report economic and organised
            crime safely and anonymously. Every report matters.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span>100% secure · End-to-end encrypted · Confidential</span>
          </div>
        </div>
      </section>

      {/* CTA Buttons Section */}
      <section className="relative z-10 py-8 px-6 bg-background">
        <div className="mx-auto max-w-2xl flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/report-crime"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto text-center"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Report A Crime
          </Link>
          <Link
            to="/anonymous-report"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold border-2 border-accent text-accent hover:bg-accent/10 transition-all hover:shadow-md hover:-translate-y-0.5 w-full sm:w-auto text-center"
          >
            Report Anonymously
          </Link>
        </div>
      </section>


      {/* Stats */}
      <section className="border-y border-border bg-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-primary">{value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Use EOCO Portal?</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              A modern, secure platform built for citizens and law enforcement.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wanted Persons */}
      <WantedPersonsSection />

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">
            Ready to Make a Report?
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
            Your report could help stop crime in your community. It takes less than 5 minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/track">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Track Anonymous Report
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
