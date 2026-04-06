import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Target, Heart, Github, Linkedin, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container max-w-7xl mx-auto px-4 py-20">

        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            About <span className="text-primary">Solve for Belagavi</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A community-driven civic platform designed to empower citizens of Belagavi
            to report issues and collaborate to improve the city.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <Card>
            <CardHeader>
              <Target className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              To create a transparent platform where citizens and authorities
              work together to solve civic issues.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              A smarter Belagavi powered by community participation and real-time
              civic issue tracking.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Community First</CardTitle>
            </CardHeader>
            <CardContent>
              Every citizen plays a role in improving the city.
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            Meet the <span className="text-primary">Developers</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted overflow-hidden">
                <img src="/dev1.jpg" className="w-full h-full object-cover" />
              </div>
             <h3 className="font-semibold text-lg">Zaid Chinchali</h3>
<p className="text-sm text-muted-foreground mb-3">Full Stack</p>

<div className="flex justify-center gap-2">
  <a 
    href="https://linkedin.com/in/zaidchinchali" 
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button size="icon" variant="outline">
      <Linkedin className="w-4 h-4" />
    </Button>
  </a>

  <a 
    href="https://github.com/freakzen" 
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button size="icon" variant="outline">
      <Github className="w-4 h-4" />
    </Button>
  </a>
</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted overflow-hidden">
                <img src="/dev2.jpg" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-lg">Developer Name</h3>
              <p className="text-sm text-muted-foreground mb-3">Backend</p>

              <div className="flex justify-center gap-2">
                <Button size="icon" variant="outline">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Github className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted overflow-hidden">
                <img src="/dev3.jpg" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-lg">Developer Name</h3>
              <p className="text-sm text-muted-foreground mb-3">Frontend</p>

              <div className="flex justify-center gap-2">
                <Button size="icon" variant="outline">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Github className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted overflow-hidden">
                <img src="/dev4.jpg" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-lg">Developer Name</h3>
              <p className="text-sm text-muted-foreground mb-3">UI/UX</p>

              <div className="flex justify-center gap-2">
                <Button size="icon" variant="outline">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Github className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

      </section>
    </main>
  )
}