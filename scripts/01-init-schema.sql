-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_role AS ENUM ('citizen', 'expert', 'admin');
CREATE TYPE issue_status AS ENUM ('open', 'in_progress', 'resolved', 'rejected');
CREATE TYPE issue_category AS ENUM ('pothole', 'streetlight', 'water', 'garbage', 'pollution', 'traffic', 'other');
CREATE TYPE notification_type AS ENUM ('issue_update', 'comment_reply', 'expert_review', 'milestone_reached');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'citizen',
  phone TEXT,
  location TEXT,
  bio TEXT,
  loyalty_points INT NOT NULL DEFAULT 0,
  badge_level INT NOT NULL DEFAULT 1,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Issues table
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category issue_category NOT NULL,
  status issue_status NOT NULL DEFAULT 'open',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  upvote_count INT NOT NULL DEFAULT 0,
  comment_count INT NOT NULL DEFAULT 0,
  view_count INT NOT NULL DEFAULT 0,
  assigned_expert_id UUID REFERENCES users(id) ON DELETE SET NULL,
  priority INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_expert_comment BOOLEAN DEFAULT FALSE,
  likes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT at_least_one_target CHECK (
    (issue_id IS NOT NULL AND comment_id IS NULL) OR
    (issue_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(user_id, issue_id, comment_id)
);

-- Expert Reviews table
CREATE TABLE expert_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  review_text TEXT,
  recommended_action TEXT,
  estimated_days_to_resolve INT,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_issues_user_id ON issues(user_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_latitude ON issues(latitude);
CREATE INDEX idx_issues_longitude ON issues(longitude);
CREATE INDEX idx_comments_issue_id ON comments(issue_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_issue_id ON likes(issue_id);
CREATE INDEX idx_likes_comment_id ON likes(comment_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);

-- Set up Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users RLS policies
CREATE POLICY "Users can read their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public can read user profiles" ON users FOR SELECT USING (TRUE);

-- Issues RLS policies
CREATE POLICY "Anyone can read issues" ON issues FOR SELECT USING (TRUE);
CREATE POLICY "Users can create issues" ON issues FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own issues" ON issues FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any issue" ON issues FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Comments RLS policies
CREATE POLICY "Anyone can read comments" ON comments FOR SELECT USING (TRUE);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Likes RLS policies
CREATE POLICY "Anyone can read likes" ON likes FOR SELECT USING (TRUE);
CREATE POLICY "Users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Notifications RLS policies
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Expert reviews RLS policies
CREATE POLICY "Anyone can read reviews" ON expert_reviews FOR SELECT USING (TRUE);
CREATE POLICY "Experts can create reviews" ON expert_reviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('expert', 'admin'))
);

-- Audit logs RLS policies
CREATE POLICY "Admins can read audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can create audit logs" ON audit_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
