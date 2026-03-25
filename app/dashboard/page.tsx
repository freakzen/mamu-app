'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { getIssues } from '@/lib/api';
import type { Issue } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MessageSquare, Heart, Award } from 'lucide-react';

const statusColors: Record<string, string> = {
  open: '#FF9933',
  in_progress: '#138808',
  resolved: '#00AA00',
  rejected: '#CC0000',
};

const categoryColors: Record<string, string> = {
  pothole: '#EF4444',
  streetlight: '#FBBF24',
  water: '#3B82F6',
  garbage: '#10B981',
  pollution: '#A855F7',
  traffic: '#F97316',
  other: '#6B7280',
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      setUser(profile);

      try {
        const issues = await getIssues({ limit: 100 });
        setAllIssues(issues);
        setMyIssues(issues.filter((issue) => issue.user_id === authUser.id));
      } catch (error) {
        console.error('Error loading issues:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statusDistribution = Object.entries(
    allIssues.reduce(
      (acc, issue) => {
        acc[issue.status] = (acc[issue.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([key, value]) => ({
    name: key.replace('_', ' '),
    value,
    color: statusColors[key],
  }));

  const categoryDistribution = Object.entries(
    allIssues.reduce(
      (acc, issue) => {
        acc[issue.category] = (acc[issue.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([key, value]) => ({
    name: key,
    value,
    color: categoryColors[key],
  }));

  const totalComments = allIssues.reduce((sum, issue) => sum + issue.comment_count, 0);
  const totalLikes = allIssues.reduce((sum, issue) => sum + issue.upvote_count, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur">
        <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              S
            </div>
            <span className="font-semibold text-lg hidden sm:inline">Solve for Belgavi</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/issues">
              <Button variant="ghost" size="sm">Issues</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm">Profile</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.full_name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Issues</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myIssues.length}</div>
              <p className="text-xs text-muted-foreground">Issues reported</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <MessageSquare className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allIssues.length}</div>
              <p className="text-xs text-muted-foreground">Community issues</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
              <Award className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.loyalty_points}</div>
              <p className="text-xs text-muted-foreground">Badge Level: {user.badge_level}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <Heart className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLikes + totalComments}</div>
              <p className="text-xs text-muted-foreground">Likes & Comments</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Issue Status Distribution</CardTitle>
              <CardDescription>Current status of all reported issues</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
              <CardDescription>Breakdown of reported issue types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF9933" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* My Recent Issues */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Recent Issues</CardTitle>
                <CardDescription>Issues you've reported</CardDescription>
              </div>
              <Link href="/issues/new">
                <Button size="sm" className="bg-primary hover:bg-primary/90">Report New</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : myIssues.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't reported any issues yet</p>
                <Link href="/issues/new">
                  <Button className="bg-primary hover:bg-primary/90">Report Your First Issue</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myIssues.slice(0, 5).map((issue) => (
                  <Link key={issue.id} href={`/issues/${issue.id}`}>
                    <div className="p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold line-clamp-1">{issue.title}</h3>
                        <Badge
                          variant={
                            issue.status === 'resolved'
                              ? 'default'
                              : issue.status === 'in_progress'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {issue.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                        <span>❤️ {issue.upvote_count}</span>
                        <span>💬 {issue.comment_count}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
