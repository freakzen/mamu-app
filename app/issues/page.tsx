'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { getIssues } from '@/lib/api';
import type { Issue } from '@/lib/supabase';
import { MapPin, MessageSquare, Heart, TrendingUp } from 'lucide-react';

const categoryColors: Record<string, string> = {
  pothole: 'bg-red-100 text-red-800',
  streetlight: 'bg-yellow-100 text-yellow-800',
  water: 'bg-blue-100 text-blue-800',
  garbage: 'bg-green-100 text-green-800',
  pollution: 'bg-purple-100 text-purple-800',
  traffic: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await getIssues({ limit: 50 });
        setIssues(data);
        setFilteredIssues(data);
      } catch (error) {
        console.error('Error loading issues:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  useEffect(() => {
    let filtered = issues;

    if (searchTerm) {
      filtered = filtered.filter((issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((issue) => issue.category === selectedCategory);
    }

    if (selectedStatus) {
      filtered = filtered.filter((issue) => issue.status === selectedStatus);
    }

    setFilteredIssues(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, issues]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              S
            </div>
            <span className="font-semibold text-lg hidden sm:inline">Solve for Belgavi</span>
          </Link>
          <Link href="/issues/new">
            <Button size="sm" className="bg-primary hover:bg-primary/90">Report Issue</Button>
          </Link>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Issues in Belgavi</h1>
          <p className="text-muted-foreground">Browse and support issues being reported by your community</p>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div>
            <Input
              type="search"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-md border border-border bg-card text-foreground"
          >
            <option value="">All Categories</option>
            <option value="pothole">Pothole</option>
            <option value="streetlight">Streetlight</option>
            <option value="water">Water</option>
            <option value="garbage">Garbage</option>
            <option value="pollution">Pollution</option>
            <option value="traffic">Traffic</option>
            <option value="other">Other</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-md border border-border bg-card text-foreground"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Issues Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No issues found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredIssues.map((issue) => (
              <Link key={issue.id} href={`/issues/${issue.id}`}>
                <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2">{issue.title}</CardTitle>
                      </div>
                      <Badge className={categoryColors[issue.category] || 'bg-gray-100 text-gray-800'}>
                        {issue.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
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
                  </CardHeader>
                  <CardContent>
  {issue.image_url && (
    <div className="mb-4 overflow-hidden rounded-lg">
      <img
        src={issue.image_url}
        alt={issue.title}
        className="w-full h-48 object-cover"
      />
    </div>
  )}

  <CardDescription className="line-clamp-2 mb-4">
    {issue.description}
  </CardDescription>

  {issue.address && (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <MapPin className="w-4 h-4" />
      <span>{issue.address}</span>
    </div>
  )}

  <div className="flex items-center gap-6 text-sm text-muted-foreground">
    <div className="flex items-center gap-2">
      <Heart className="w-4 h-4" />
      <span>{issue.upvote_count}</span>
    </div>
    <div className="flex items-center gap-2">
      <MessageSquare className="w-4 h-4" />
      <span>{issue.comment_count}</span>
    </div>
    <div className="flex items-center gap-2">
      <TrendingUp className="w-4 h-4" />
      <span>{issue.view_count}</span>
    </div>
  </div>
</CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
