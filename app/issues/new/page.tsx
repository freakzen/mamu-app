'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { createIssue, awardLoyaltyPoints } from '@/lib/api';
import { put } from '@vercel/blob';
import { MapPin, Upload, AlertCircle } from 'lucide-react';

export default function ReportIssuePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    address: '',
    latitude: 0,
    longitude: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

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
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Title and description are required');
        setLoading(false);
        return;
      }

      let imageUrls: string[] = [];

      if (imageFile) {
        try {
          const blob = await put(`issues/${Date.now()}-${imageFile.name}`, imageFile, {
            access: 'public',
          });
          imageUrls = [blob.url];
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          setError('Failed to upload image');
          setLoading(false);
          return;
        }
      }

      const newIssue = await createIssue({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        address: formData.address || undefined,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        image_urls: imageUrls,
        status: 'open',
      });

      await awardLoyaltyPoints(user.id, 10);

      router.push(`/issues/${newIssue.id}`);
    } catch (err) {
      console.error('Error creating issue:', err);
      setError('Failed to create issue');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Report an Issue</h1>
          <p className="text-muted-foreground">
            Help improve Belgavi by reporting civic issues. Your report will help authorities take action.
          </p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
            <CardDescription>Provide accurate information about the issue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Large pothole on Main Street"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-border bg-card text-foreground"
                >
                  <option value="pothole">Pothole</option>
                  <option value="streetlight">Streetlight</option>
                  <option value="water">Water</option>
                  <option value="garbage">Garbage</option>
                  <option value="pollution">Pollution</option>
                  <option value="traffic">Traffic</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the issue in detail. Include what's wrong, when you noticed it, and any other relevant information."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-32"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Location Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="e.g., Main Street near City Hall"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Get Current Location</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Use My Current Location
                </Button>
                {formData.latitude !== 0 && formData.longitude !== 0 && (
                  <p className="text-sm text-muted-foreground">
                    Location captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Photo (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer block">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload photo</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </label>
                </div>

                {imagePreview && (
                  <div className="mt-4 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      className="mt-2"
                    >
                      Remove Photo
                    </Button>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <span className="font-semibold">Tip:</span> Provide clear details and photos for faster resolution. Your contributions help improve Belgavi!
                </p>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? 'Reporting Issue...' : 'Report Issue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
