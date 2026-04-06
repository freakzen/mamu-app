"use client"

import { useState } from "react"
import emailjs from "@emailjs/browser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const form = e.target

    const templateParams = {
      user_name: form.user_name.value,
      user_email: form.user_email.value,
      user_phone: form.user_phone.value,
      message: form.message.value,
    }

    try {
      await emailjs.send(
        "service_bz4e7ke",
        "template_trroo4i",
        templateParams,
        "NGaNFLu35WX-MeF91"
      )

      setSent(true)
      form.reset()
    } catch (error) {
      console.error("EmailJS error:", error)
      alert("Failed to send message")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="container max-w-3xl mx-auto px-4 py-20">

        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Mail className="w-5 h-5 text-primary" />
              Connect with the team
            </CardTitle>
          </CardHeader>

          <CardContent>
            {sent && (
              <p className="text-green-600 mb-4">
                Message sent successfully!
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <Input
                name="user_name"
                placeholder="Your Name"
                required
              />

              <Input
                name="user_email"
                type="email"
                placeholder="Email Address"
                required
              />

              <Input
                name="user_phone"
                placeholder="Phone Number"
                required
              />

              <Textarea
                name="message"
                placeholder="Describe your query..."
                className="min-h-[120px]"
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>

            </form>

          </CardContent>
        </Card>

      </section>
    </main>
  )
}