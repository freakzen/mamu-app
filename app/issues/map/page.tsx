'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IssuesMap } from '@/components/issues-map';
import { getIssues } from '@/lib/api';
import type { Issue } from '@/lib/supabase';
import { MapPin, List } from 'lucide-react';

const categoryColors: Record<string, string> = {
  pothole: 'bg-red-100 text-red-800',
  streetlight: 'bg-yellow-100 text-yellow-800',
  water: 'bg-blue-100 text-blue-800',
  garbage: 'bg-green-100 text-green-800',
  pollution: 'bg-purple-100 text-purple-800',
  traffic: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function IssuesMapPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await getIssues({ limit: 100 });
        setIssues(data);
      } catch (error) {
        console.error('Error loading issues:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  const handleIssueClick = (issueId: string) => {
    const issue = issues.find((i) => i.id === issueId);
    if (issue) {
      setSelectedIssue(issue);
    }
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
            <Link href="/issues">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List View</span>
              </Button>
            </Link>
            <Link href="/issues/new">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Report Issue</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Issues Map</h1>
            <p className="text-muted-foreground">View civic issues by location</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="border-border/50 overflow-hidden">
                <IssuesMap issues={issues} onIssueClick={handleIssueClick} />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {selectedIssue ? (
                <Card className="border-border/50 sticky top-24">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{selectedIssue.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{selectedIssue.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Category</p>
                      <Badge className={categoryColors[selectedIssue.category]}>
                        {selectedIssue.category}
                      </Badge>
                    </div>

                    {selectedIssue.address && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p className="text-sm">{selectedIssue.address}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge
                        variant={
                          selectedIssue.status === 'resolved'
                            ? 'default'
                            : selectedIssue.status === 'in_progress'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {selectedIssue.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Supports</p>
                        <p className="font-semibold">{selectedIssue.upvote_count}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Comments</p>
                        <p className="font-semibold">{selectedIssue.comment_count}</p>
                      </div>
                    </div>

                    <Link href={`/issues/${selectedIssue.id}`} className="w-full">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Select an Issue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Click on a marker on the map to view issue details.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Legend */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(categoryColors).map(([category, colors]) => (
                      <div key={category} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors.split(' ')[0]}`} />
                        <span className="capitalize">{category}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
