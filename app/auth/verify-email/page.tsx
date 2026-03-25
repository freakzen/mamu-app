'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-muted-foreground">
            Check your inbox for a confirmation link to complete your signup
          </p>
        </div>

        <Card className="border-border/50 mb-6">
          <CardHeader>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>We've sent a verification link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <p className="text-sm text-foreground">
                A confirmation link has been sent to your email address. Click the link to verify your account and start using Solve for Belgavi.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Didn't receive the email?</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Check your spam folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Wait a few minutes and check again</li>
              </ul>
            </div>

            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Once verified, you can start reporting issues and making a difference in Belgavi.
          </p>
        </div>
      </div>
    </div>
  );
}
