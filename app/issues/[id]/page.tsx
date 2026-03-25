'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      } catch (error) {
        console.error('Error loading issue:', error);
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
        setLikeCount(likeCount - 1);
      } else {
        await likeIssue(user.id, issueId);
        setLikeCount(likeCount + 1);
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
      setComments([...comments, newComment]);
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
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur">
          <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                S
              </div>
              <span className="font-semibold text-lg hidden sm:inline">Solve for Belgavi</span>
            </Link>
          </div>
        </header>
        <div className="container max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Issue not found</p>
          <Link href="/issues"><Button className="mt-4">Back to Issues</Button></Link>
        </div>
      </div>
    );
  }

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
          <Link href="/issues">
            <Button variant="ghost" size="sm">Back to Issues</Button>
          </Link>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{issue.title}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className={categoryColors[issue.category]}>
                  {issue.category}
                </Badge>
                <Badge variant={issue.status === 'resolved' ? 'default' : 'secondary'}>
                  {issue.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>

          {issue.address && (
            <div className="flex items-center gap-2 text-muted-foreground mt-4">
              <MapPin className="w-5 h-5" />
              <span>{issue.address}</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {issue.image_urls && issue.image_urls.length > 0 && (
              <Card className="mb-8 border-border/50 overflow-hidden">
                <div className="relative w-full h-96 bg-muted">
                  <img
                    src={issue.image_urls[0]}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            )}

            <Card className="border-border/50 mb-8">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{issue.description}</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {user && (
                  <form onSubmit={handleComment} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Share your thoughts..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="bg-muted"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Post Comment
                    </Button>
                  </form>
                )}

                {!user && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Sign in to leave a comment</p>
                    <Link href="/auth/login">
                      <Button>Sign In</Button>
                    </Link>
                  </div>
                )}

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{comment.user_id}</span>
                            {comment.is_expert_comment && (
                              <Badge variant="secondary" className="text-xs">Expert</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-20">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user && (
                  <Button
                    onClick={handleLike}
                    variant={isLiked ? 'default' : 'outline'}
                    className="w-full"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    Support ({likeCount})
                  </Button>
                )}
                {!user && (
                  <Link href="/auth/login" className="w-full">
                    <Button variant="outline" className="w-full">
                      <Heart className="w-4 h-4 mr-2" />
                      Support
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
