'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, MessageSquare, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              S
            </div>
            <span className="font-semibold text-lg hidden sm:inline">Solve for Belgavi</span>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">Profile</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-balance">
            Fix Belgavi, <span className="text-primary">Together</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Report civic issues, connect with experts, and watch your community transform. Every issue reported is a step towards a better Belgavi.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href={isAuthenticated ? "/issues/new" : "/auth/signup"}>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {isAuthenticated ? 'Report Issue' : 'Get Started'}
              </Button>
            </Link>
            <Link href="/issues">
              <Button size="lg" variant="outline">View Issues</Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <MapPin className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Location Based</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Report issues with precise location mapping so authorities can act fast.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <MessageSquare className="w-6 h-6 text-secondary mb-2" />
              <CardTitle>Community Power</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comments, discussions, and expert insights bring solutions together.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <TrendingUp className="w-6 h-6 text-accent mb-2" />
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Watch issues move from open to resolved with real-time updates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Zap className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Earn Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build reputation with loyalty points and badges for contributions.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-20 rangoli-pattern">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">1,234+</div>
              <p className="text-muted-foreground mt-2">Issues Reported</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">856+</div>
              <p className="text-muted-foreground mt-2">Issues Resolved</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">2,103+</div>
              <p className="text-muted-foreground mt-2">Active Citizens</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of citizens working together to improve Belgavi.
          </p>
          <Link href={isAuthenticated ? "/issues/new" : "/auth/signup"}>
            <Button size="lg" variant="secondary">
              {isAuthenticated ? 'Report Your First Issue' : 'Join the Movement'}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Solve for Belgavi</h3>
              <p className="text-sm text-muted-foreground">
                A community-driven platform for reporting and solving civic issues.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/issues" className="text-muted-foreground hover:text-foreground">Browse Issues</Link></li>
                <li><Link href="/experts" className="text-muted-foreground hover:text-foreground">Find Experts</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
                <li><Link href="/guidelines" className="text-muted-foreground hover:text-foreground">Guidelines</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8">
            <p className="text-sm text-muted-foreground text-center">
              © 2025 Solve for Belgavi. Built with community in mind. 🇮🇳
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
