'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, MessageSquare, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from "@/components/theme-toggle";

const ImageSlider = () => {
  const images = [
    "/img1.jpg",
    "/img2.jpg",
    "/img3.jpg"
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [images.length]);

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-xl">
      <img
        src={images[current]}
        alt={`Belagavi slide ${current + 1}`}
        className="w-full h-[520px] md:h-[620px] object-cover rounded-2xl transition-all duration-700"
      />

      <button
        onClick={prev}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
      >
        &lt;
      </button>

      <button
        onClick={next}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
      >
        &gt;
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all ${
              current === index ? "w-8 bg-white" : "w-2.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

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
      
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
          
          <BrandLogo />

          <nav className="flex items-center gap-4">
            
            <ThemeToggle />

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

      <section className="container max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-balance">
            Fix <span className="text-primary">Belagavi, Together</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Report civic issues, connect with experts, and watch your community transform. Every issue reported is a step towards a better Belagavi.
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

        <section className="container max-w-7xl mx-auto px-4 py-24">
          <ImageSlider />
        </section>

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

      <section className="bg-muted/30 py-20 rangoli-pattern">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">1</div>
              <p className="text-muted-foreground mt-2">Issues Reported</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">0</div>
              <p className="text-muted-foreground mt-2">Issues Resolved</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">800K+</div>
              <p className="text-muted-foreground mt-2">Active Citizens</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 bg-muted/30 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Solve for Belagavi</h3>
              <p className="text-sm text-muted-foreground">
                A community-driven platform by KLS GRID.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/issues" className="text-muted-foreground hover:text-foreground">Browse Issues</Link></li>
                <li><Link href="/experts" className="text-muted-foreground hover:text-foreground">Find Experts</Link></li>
                <li><Link href="/about-us" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/FAQ" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal" className="text-muted-foreground hover:text-foreground">Terms & Guidelines</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 pt-8">
            <p className="text-sm text-muted-foreground text-center">
              © 2026 Solve for Belagavi. Powered by KLS GRID. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}