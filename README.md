# Solve for Belgavi - Civic Issue Reporting Platform

A comprehensive full-stack civic issue reporting and resolution platform built for Belgavi community members. Report local problems, connect with experts, and together improve the city one issue at a time.

## Features

### Core Functionality
- **Issue Reporting**: Citizens can report civic issues with photos, location data, and detailed descriptions
- **Issue Feed**: Browse and search all reported issues with filtering by category and status
- **Interactive Maps**: View all issues on an interactive Leaflet map with location-based markers
- **Comments & Discussions**: Community engagement through issue discussions and expert insights
- **Like/Support System**: Show support for issues and help prioritize critical problems
- **Loyalty Points**: Earn points for contributions and climb badge levels

### User Roles
- **Citizens**: Report issues, comment, support others' reports
- **Experts**: Review issues, provide professional guidance, earn loyalty points
- **Admins**: Manage all issues, moderate content, track analytics

### Dashboard & Analytics
- Personal dashboard with issue statistics and history
- Community-wide analytics with issue distribution charts
- Admin panel for content moderation and status management
- Expert directory with verified professionals

## Technology Stack

### Frontend
- **Next.js 16** - React-based full-stack framework
- **React 19.2** - Latest React with new features
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Leaflet & React-Leaflet** - Interactive mapping
- **Recharts** - Data visualization

### Backend & Database
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security (RLS)** - Database-level access control
- **Vercel Blob** - File storage for issue images
- **Server-side rendering** - Optimized performance

### Styling & Design
- **Custom Indian Aesthetic**: Saffron (#FF9933), Green (#138808), Beige (#F5E6D3) color palette
- **Rangoli Patterns**: Subtle geometric patterns throughout
- **Glassmorphism Effects**: Modern frosted glass UI elements
- **Responsive Design**: Mobile-first, works on all devices

## Project Structure

```
/app
  /auth - Authentication pages (login, signup, verify-email)
  /issues - Issue browsing and management
    /[id] - Individual issue detail page
    /new - Report new issue
    /map - Map view of issues
  /dashboard - User dashboard with analytics
  /profile - User profile management
  /admin - Admin panel for moderation
  /experts - Expert directory
  /globals.css - Global styles with Indian aesthetic
  /layout.tsx - Root layout
  /page.tsx - Home page

/lib
  /supabase.ts - Supabase client and types
  /auth.ts - Authentication utilities
  /api.ts - API helpers for CRUD operations

/components
  /ui - shadcn/ui components
  /issues-map.tsx - Interactive map component
```

## Database Schema

### Tables
- **users** - User profiles with role, loyalty points, badges
- **issues** - Reported civic issues with location and metadata
- **comments** - User comments on issues
- **likes** - Issue and comment likes/support
- **expert_reviews** - Professional reviews from experts
- **notifications** - User notifications for issue updates
- **audit_logs** - Admin activity logs

### Security
- Row Level Security (RLS) policies enforce access control
- Users can only modify their own content
- Admins have unrestricted access for moderation
- Email-based authentication via Supabase Auth

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase project with database setup
- Vercel Blob storage configured

### Installation

1. **Install dependencies**:
```bash
pnpm install
```

2. **Set environment variables** in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Run database migrations**:
The SQL schema has been pre-created in `/scripts/01-init-schema.sql`

4. **Start development server**:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Key Features Explained

### Issue Reporting
- Upload issue photos via Vercel Blob
- Capture GPS location automatically or manually enter address
- Categorize issues (pothole, streetlight, water, garbage, pollution, traffic, other)
- Track issue status from open → in_progress → resolved/rejected

### Community Engagement
- Comment on issues to suggest solutions
- Support issues to raise their priority
- Earn 10 loyalty points per issue reported
- Build reputation toward expert status

### Admin Tools
- View all community issues in one dashboard
- Update issue status and assign to experts
- Monitor community engagement metrics
- Access audit logs for accountability

### Expert Features
- Dedicated expert profile with badge system
- Review civic issues and provide recommendations
- Estimate resolution timelines
- Track resolution statistics

## Design Philosophy

The platform celebrates India's civic heritage through:
- **Color Palette**: Inspired by the Indian flag and traditional art
- **Typography**: Clean, modern fonts optimized for readability
- **Patterns**: Subtle rangoli-inspired geometric patterns
- **Components**: Glassmorphism and modern UI elements
- **Accessibility**: WCAG compliant color contrasts and semantic HTML

## Performance Optimizations

- Server-side rendering for fast initial loads
- Image optimization with Vercel Blob
- Database indexing on frequently queried columns
- Efficient pagination on issue lists
- Lazy loading for map markers
- CSS-in-JS with Tailwind for minimal bundle size

## Future Enhancements

- Real-time notifications using Supabase real-time subscriptions
- AI-powered issue categorization
- Automated email notifications
- Mobile app using React Native
- Issue resolution timeline tracking
- Community reputation system refinements
- Integration with municipal APIs

## Contributing

This is a demonstration project. For production use, consider:
- Adding comprehensive error handling
- Implementing rate limiting
- Adding email verification
- Setting up automated backups
- Deploying analytics tracking
- Creating admin approval workflows

## License

This project is created for demonstration purposes.

## Support

For issues and feature requests, contact the development team or visit the project repository.

---

**Built with Next.js, Supabase, and a passion for civic improvement.**
