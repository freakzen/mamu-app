import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Shield, Users, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LegalPage() {
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
            Terms & <span className="text-primary">Guidelines</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Please read these terms carefully before using Solve for Belagavi.
            By using this platform, you agree to follow these rules and policies.
          </p>
        </div>

        <div className="space-y-6">

          <Card>
            <CardHeader>
              <FileText className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Platform Usage Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>• Users must provide accurate and truthful information while reporting issues.</p>
              <p>• Fake, misleading, or spam reports are strictly prohibited.</p>
              <p>• Users must not misuse the platform for personal promotion.</p>
              <p>• Authorities and moderators may remove inappropriate content.</p>
              <p>• Repeated violations may lead to account suspension.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>• Be respectful and constructive in discussions.</p>
              <p>• No abusive, hateful, or offensive language.</p>
              <p>• Do not harass other users or authorities.</p>
              <p>• Keep comments relevant to the civic issue.</p>
              <p>• Encourage collaboration and positive engagement.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <AlertTriangle className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Content Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>• Upload only relevant images of civic issues.</p>
              <p>• No copyrighted or unrelated images.</p>
              <p>• No political propaganda or advertisements.</p>
              <p>• No illegal or harmful content.</p>
              <p>• Moderators reserve the right to remove any content.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Privacy & Responsibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>• User data is used only for platform functionality.</p>
              <p>• Location data is used to identify civic issues.</p>
              <p>• We do not sell or share personal information.</p>
              <p>• Users are responsible for their posted content.</p>
              <p>• Solve for Belagavi is a citizen reporting platform, not a government authority.</p>
            </CardContent>
          </Card>

        </div>

      </section>
    </main>
  )
}