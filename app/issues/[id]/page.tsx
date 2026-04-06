'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { getIssueById, getIssueComments, createComment, hasUserLikedIssue, likeIssue, unlikeIssue } from '@/lib/api';
import type { Issue, Comment } from '@/lib/supabase';
import { MapPin, MessageSquare, Heart, Share2, User } from 'lucide-react';

const categoryColors: Record<string, string> = {
  pothole: 'bg-red-100 text-red-800',
  streetlight: 'bg-yellow-100 text-yellow-800',
  water: 'bg-blue-100 text-blue-800',
  garbage: 'bg-green-100 text-green-800',
  pollution: 'bg-purple-100 text-purple-800',
  traffic: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function IssuePage() {
  const params = useParams();
  const issueId = params.id as string;

  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();
          setUser(profile);
        }

        const issueData = await getIssueById(issueId);
        setIssue(issueData);
        setLikeCount(issueData.upvote_count);

        if (authUser) {
          const liked = await hasUserLikedIssue(authUser.id, issueId);
          setIsLiked(liked);
        }

        const commentsData = await getIssueComments(issueId);
        setComments(commentsData);

      } catch (error: any) {
        console.error('Error loading issue:', error?.message, error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [issueId]);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        await unlikeIssue(user.id, issueId);
        setLikeCount(prev => prev - 1);
      } else {
        await likeIssue(user.id, issueId);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    try {
      const newComment = await createComment({
        issue_id: issueId,
        user_id: user.id,
        content: commentText,
      });

      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-background text-center py-20">
        <p className="text-muted-foreground">Issue not found</p>
        <Link href="/issues">
          <Button className="mt-4">Back to Issues</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
          <Link href="/" className="font-semibold text-lg">Solve for Belgavi</Link>
          <Link href="/issues">
            <Button variant="ghost" size="sm">Back to Issues</Button>
          </Link>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-12">

        <h1 className="text-4xl font-bold mb-4">{issue.title}</h1>

        <div className="flex gap-4 mb-4">
          <Badge className={categoryColors[issue.category]}>
            {issue.category}
          </Badge>
          <Badge variant="secondary">
            {issue.status}
          </Badge>
        </div>

        {issue.address && (
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <MapPin className="w-5 h-5" />
            {issue.address}
          </div>
        )}

        {/* ✅ IMAGE FIXED HERE */}
        {issue.image_url && (
  <Card className="mb-8 border-border/50 overflow-hidden">
    <div className="w-full h-[350px] bg-muted">
      <img
        src={issue.image_url}
        alt={issue.title}
        className="w-full h-full object-cover"
      />
    </div>
  </Card>
)}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            {issue.description}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Comments ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent>

            {user && (
              <form onSubmit={handleComment} className="mb-4">
                <Input
                  placeholder="Write comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button type="submit" className="mt-2 w-full">
                  Post Comment
                </Button>
              </form>
            )}

            {comments.map((c) => (
              <div key={c.id} className="mb-3 p-3 bg-muted rounded">
                <p className="text-sm">{c.content}</p>
              </div>
            ))}

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>

            <Button onClick={handleLike} className="w-full mb-2">
              <Heart className="w-4 h-4 mr-2" />
              Support ({likeCount})
            </Button>

            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}