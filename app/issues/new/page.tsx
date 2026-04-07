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
import { MapPin, AlertCircle } from 'lucide-react';

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
const [imagePreview, setImagePreview] = useState('');

useEffect(() => {
const checkAuth = async () => {
const { data: { user: authUser } } = await supabase.auth.getUser();
if (!authUser) {
router.push('/auth/login');
return;
}
setUser(authUser);
};
checkAuth();
}, [router]);

const handleInputChange = (e: any) => {
const { name, value } = e.target;
setFormData((prev) => ({
...prev,
[name]: value,
}));
};

const handleImageChange = (e: any) => {
const file = e.target.files?.[0];
if (file) {
setImageFile(file);
setImagePreview(URL.createObjectURL(file));
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

const handleSubmit = async (e: any) => {
e.preventDefault();
setError('');
setLoading(true);

try {
if (!user) {
setError('User not logged in');
setLoading(false);
return;
}

if (!formData.title.trim() || !formData.description.trim()) {
setError('Title and description are required');
setLoading(false);
return;
}

let imageUrl = null;

if (imageFile) {
const fileExt = imageFile.name.split('.').pop();
const fileName = `${Date.now()}.${fileExt}`;

const { error: uploadError } = await supabase.storage
.from('issues-images')
.upload(fileName, imageFile);

if (uploadError) {
setError(uploadError.message);
setLoading(false);
return;
}

const { data } = supabase.storage
.from('issues-images')
.getPublicUrl(fileName);

imageUrl = data.publicUrl;
}

const { data, error: insertError } = await supabase
.from('issues')   // ✅ FIXED HERE
.insert({
user_id: user.id,
title: formData.title,
description: formData.description,
category: formData.category,
address: formData.address || null,
latitude: formData.latitude || null,
longitude: formData.longitude || null,
image_url: imageUrl,
status: 'open',
})
.select()
.single();

if (insertError) {
setError(insertError.message);
setLoading(false);
return;
}

router.push(`/issues/${data.id}`);

} catch (err: any) {
setError(err?.message || 'Failed to create issue');
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
<Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
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
<Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
</div>

<div className="space-y-2">
<Label htmlFor="address">Location Address</Label>
<Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
</div>

<Button type="button" variant="outline" onClick={getCurrentLocation} className="w-full">
<MapPin className="w-4 h-4 mr-2" />
Use My Current Location
</Button>

<div className="space-y-2">
<Label htmlFor="image">Photo</Label>
<input id="image" type="file" accept="image/*" onChange={handleImageChange} />
{imagePreview && <img src={imagePreview} className="w-full h-48 object-cover rounded-lg" />}
</div>

<Button type="submit" className="w-full" disabled={loading}>
{loading ? 'Reporting Issue...' : 'Report Issue'}
</Button>

</form>
</CardContent>
</Card>
</div>
</div>
);
}