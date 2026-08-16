import { Shield, Target, Users, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import aboutHeroImg from '@/assets/banners/Generic.jpg'

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src={aboutHeroImg} alt="EOCO Headquarters" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">About EOCO</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            The Economic and Organised Crime Office (EOCO) was established by the EOCO Act, 2010 (Act 804) as a specialised agency to monitor and investigate economic and organised crime.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mandate</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Our mandate is to monitor and investigate economic and organised crime and on the authority of the Attorney-General, prosecute these offences to recover the proceeds of crime and provide for related matters.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We work tirelessly to ensure that Ghana's economy is protected from illicit activities, fostering a secure environment for business and investment.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-none shadow-none">
              <CardContent className="p-6 text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Protection</h3>
                <p className="text-sm text-muted-foreground">Safeguarding the national economy</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-none shadow-none">
              <CardContent className="p-6 text-center">
                <Target className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Investigation</h3>
                <p className="text-sm text-muted-foreground">Thorough evidence gathering</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-none shadow-none">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Collaboration</h3>
                <p className="text-sm text-muted-foreground">Working with international partners</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-none shadow-none">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Education</h3>
                <p className="text-sm text-muted-foreground">Raising public awareness</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-muted/30 p-8 rounded-2xl border border-border">
          <h2 className="text-2xl font-bold mb-6 text-center">Core Functions</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Investigate suspected financial crimes.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Take preventive measures against economic and organised crime.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Disseminate information gathered in the course of investigations.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Co-operate with relevant foreign or international agencies.
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
