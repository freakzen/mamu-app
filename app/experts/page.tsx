'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import type { User } from '@/lib/supabase';
import { Award, Star, Users } from 'lucide-react';

export default function ExpertsPage() {
  const [experts, setExperts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExperts = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .in('role', ['expert', 'admin'])
          .order('loyalty_points', { ascending: false });

        if (error) throw error;
        setExperts(data || []);
      } catch (error) {
        console.error('Error loading experts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExperts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur">
        <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden mx-auto mb-4">
  <img
    src="/grid-log.png"
    alt="GRID Logo"
    className="w-full h-full object-contain"
  />
</div>
            <span className="font-semibold text-lg hidden sm:inline">Solve for Belgavi</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/issues">
              <Button variant="ghost" size="sm">Issues</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Our Experts</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Meet the dedicated professionals helping improve Belgavi by reviewing and solving civic issues.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : experts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No experts available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <Card
                key={expert.id}
                className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-r from-primary to-accent"></div>
                <CardHeader className="relative pb-4 -mt-12 px-6">
                  <div className="w-20 h-20 rounded-full bg-card border-4 border-card shadow-lg flex items-center justify-center mb-4">
                    <Award className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="line-clamp-2">{expert.full_name}</CardTitle>
                  <CardDescription>{expert.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expert.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{expert.bio}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-muted-foreground text-xs">Points</p>
                      <p className="font-semibold text-lg">{expert.loyalty_points}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-muted-foreground text-xs">Badge Level</p>
                      <p className="font-semibold text-lg">{expert.badge_level}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-secondary text-secondary-foreground">
                      {expert.role}
                    </Badge>
                    {expert.is_verified && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <Star className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Member since {new Date(expert.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
