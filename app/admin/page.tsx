'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { getIssues, updateIssue } from '@/lib/api';
import type { Issue } from '@/lib/supabase';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
  open: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
  in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
  resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      if (!profile || profile.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUser(profile);

      try {
        const data = await getIssues({ limit: 100 });
        setIssues(data);
      } catch (err) {
        console.error('Error loading issues:', err);
        setError('Failed to load issues');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleStatusChange = async (issueId: string, newStatus: string) => {
    try {
      await updateIssue(issueId, { status: newStatus as any });
      setIssues(
        issues.map((issue) =>
          issue.id === issueId ? { ...issue, status: newStatus as any } : issue
        )
      );
    } catch (err) {
      console.error('Error updating issue:', err);
      setError('Failed to update issue');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    open: issues.filter((i) => i.status === 'open').length,
    in_progress: issues.filter((i) => i.status === 'in_progress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
    rejected: issues.filter((i) => i.status === 'rejected').length,
  };

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
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm">Profile</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage issues and moderate community content</p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <AlertCircle className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.open}</div>
              <p className="text-xs text-muted-foreground">Issues awaiting action</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.in_progress}</div>
              <p className="text-xs text-muted-foreground">Being worked on</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Fixed issues</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Invalid reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Issues Management Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>All Issues</CardTitle>
            <CardDescription>Manage and moderate reported issues</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : issues.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No issues to manage</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-semibold">Title</th>
                      <th className="text-left py-3 px-4 font-semibold">Category</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Engagement</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue) => (
                      <tr key={issue.id} className="border-b border-border/30 hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <Link href={`/issues/${issue.id}`} className="text-primary hover:underline">
                            {issue.title.substring(0, 40)}...
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize">
                            {issue.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={issue.status}
                            onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                            className="px-2 py-1 rounded border border-border bg-card text-foreground text-xs"
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          <div>❤️ {issue.upvote_count}</div>
                          <div>💬 {issue.comment_count}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/issues/${issue.id}`}>
                            <Button variant="ghost" size="sm" className="text-xs">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
