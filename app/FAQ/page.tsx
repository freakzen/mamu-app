import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container max-w-5xl mx-auto px-4 py-20">

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
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about using Solve for Belagavi
          </p>
        </div>

        <div className="space-y-6">

          <Card>
            <CardHeader>
              <HelpCircle className="w-5 h-5 text-primary mb-2" />
              <CardTitle>What is Solve for Belagavi?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Solve for Belagavi is a community-driven platform where citizens can report
              civic issues like potholes, garbage, streetlights, and track their resolution.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <HelpCircle className="w-5 h-5 text-primary mb-2" />
              <CardTitle>How do I report an issue?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Click on "Report Issue", upload an image, add description, location,
              and submit. Your issue will appear publicly for tracking.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <HelpCircle className="w-5 h-5 text-primary mb-2" />
              <CardTitle>Do I need an account to report issues?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Yes, you must sign up or login to report issues so we can track
              submissions and prevent spam.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <HelpCircle className="w-5 h-5 text-primary mb-2" />
              <CardTitle>Can I track my reported issue?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Yes. Once submitted, you can track progress, comments, and updates
              from your dashboard.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <HelpCircle className="w-5 h-5 text-primary mb-2" />
              <CardTitle>Who resolves the reported issues?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Issues are visible to authorities, experts, and community members
              who collaborate to resolve them.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <HelpCircle className="w-5 h-5 text-primary mb-2" />
              <CardTitle>Can I comment on issues?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Yes. You can comment, provide suggestions, or add updates
              to help solve the issue faster.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <HelpCircle className="w-5 h-5 text-primary mb-2" />
              <CardTitle>Is my personal data safe?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Yes. We only use your information for platform functionality
              and do not share your personal data.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <HelpCircle className="w-5 h-5 text-primary mb-2" />
              <CardTitle>Can I upload multiple images?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Currently one image per report is supported. More uploads
              may be added in future updates.
            </CardContent>
          </Card>

        </div>

      </section>
    </main>
  )
}