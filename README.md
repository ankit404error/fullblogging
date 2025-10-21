# BlogSpace - Modern Blogging Platform

A full-stack blogging platform built with Next.js 15, tRPC, Drizzle ORM, and Tailwind CSS. Create, manage, and share your thoughts with a beautiful, responsive interface.

![BlogSpace](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![tRPC](https://img.shields.io/badge/tRPC-Latest-2596be?style=for-the-badge&logo=trpc)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features Checklist

### ✅ Completed Core Features
- [x] **Landing Page** - Beautiful marketing page with hero, features, and footer
- [x] **Dashboard Page** - Complete admin interface with post/category management
- [x] **Post CRUD** - Create, read, update, delete posts with full validation
- [x] **Category System** - Organize posts with custom categories
- [x] **Search & Filter** - Advanced search and category filtering capabilities
- [x] **Mobile Responsive** - Fully responsive design across all screen sizes
- [x] **Loading & Error States** - Proper loading indicators and error handling
- [x] **tRPC Integration** - Type-safe APIs throughout the application
- [x] **Auto Slug Generation** - SEO-friendly URLs with proper character handling

### 🚀 Optional/Bonus Features
- [ ] **Markdown Preview** - Live markdown rendering with react-markdown
- [ ] **Dark Mode Toggle** - Theme switching capability
- [ ] **Word Count & Reading Time** - Content statistics display
- [ ] **Pagination** - Handle large collections of posts
- [ ] **User Authentication** - Login/signup functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router and Turbo
- **Language**: TypeScript for type safety
- **Database**: PostgreSQL with Drizzle ORM
- **API**: tRPC for type-safe APIs
- **Styling**: Tailwind CSS for responsive design
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React for consistent iconography
- **Validation**: Zod schemas for runtime validation

## 🚀 Quick Start

### 1. Database Setup

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create a database named 'blogging_db'
creatdb blogging_db
```

**Option B: Cloud Database**
Use services like:
- [Supabase](https://supabase.com/) (Free tier available)
- [Neon](https://neon.tech/) (Serverless PostgreSQL)
- [Railway](https://railway.app/) (Easy deployment)

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Replace with your database credentials
DATABASE_URL="postgresql://username:password@localhost:5432/blogging_db"

# Example for Supabase:
# DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

### 3. Installation

```bash
# Install dependencies
npm install

# Push database schema
npx drizzle-kit push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blogging platform!

## 📖 Usage Guide

### Creating Your First Post

1. Click **"New Post"** in the navigation
2. Fill in your post details:
   - **Title**: Engaging title (3-100 characters)
   - **Category**: Choose from available categories
   - **Content**: Write your post content (supports line breaks)
3. Use the **Preview** toggle to see how it will look
4. Choose to save as **Draft** or **Publish** immediately

### Managing Categories

Categories are automatically created on first run:
- 🔧 Technology
- 🎨 Design  
- 💼 Business
- 🌟 Lifestyle
- ✈️ Travel
- 🍔 Food
- 💪 Health

### Search & Filter

- **Search Bar**: Find posts by title or content
- **Category Pills**: Click to filter by category
- **View Toggle**: Switch between grid and list layouts
- **Sort Options**: Order by newest, oldest, or popularity

## 📁 Project Structure

```
blogging/
├── app/                          # Next.js 15 App Router
│   ├── dashboard/                # Admin dashboard page
│   ├── posts/                    # Posts listing page
│   ├── post/
│   │   ├── new/                  # Create new post
│   │   └── [id]/edit/            # Edit existing post
│   ├── api/
│   │   ├── trpc/[trpc]/          # tRPC API handler
│   │   ├── posts/                # Legacy REST endpoints
│   │   └── categories/           # Legacy REST endpoints
│   ├── components/               # Reusable UI components
│   │   ├── PostCard.tsx
│   │   ├── PostForm.tsx          # Create/Edit form
│   │   ├── CategoryFilter.tsx
│   │   └── Icons.tsx
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── TRPCProviderWrapper.tsx   # tRPC client setup
├── lib/                          # Utilities
│   ├── db.ts                     # Database connection
│   ├── trpc.ts                   # tRPC client
│   └── drizzle/
│       └── schema.ts             # Database schema
├── server/                       # tRPC server
│   ├── trpc.ts                   # tRPC configuration
│   └── router/
│       ├── index.ts              # Main router
│       ├── post.ts               # Post operations
│       └── category.ts           # Category operations
├── scripts/
│   └── seed.ts                   # Database seeding
└── drizzle/                      # Migrations
```

## 🔌 tRPC API Routes

### Post Router (`trpc.post.*`)
```typescript
// Queries
trpc.post.all.useQuery()                    // Get all posts
trpc.post.byId.useQuery({ id: 1 })          // Get post by ID
trpc.post.byCategory.useQuery({ categoryId: 1 }) // Get posts by category

// Mutations
trpc.post.create.useMutation()              // Create new post
trpc.post.update.useMutation()              // Update existing post
trpc.post.delete.useMutation()              // Delete post
```

### Category Router (`trpc.category.*`)
```typescript
// Queries
trpc.category.all.useQuery()                // Get all categories

// Mutations
trpc.category.create.useMutation()          // Create new category
trpc.category.update.useMutation()          // Update existing category
trpc.category.delete.useMutation()          // Delete category
```

### Example Usage
```typescript
// Creating a post
const createPost = trpc.post.create.useMutation({
  onSuccess: () => {
    // Handle success
  }
});

createPost.mutate({
  title: "My Blog Post",
  content: "This is the content...",
  categoryId: 1
});
```

## 🎨 Customization

### Themes
Custom CSS variables in `globals.css`:
```css
:root {
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  /* Add your custom gradients */
}
```

### Category Colors
Modify category colors in `PostCard.tsx` and `CategoryFilter.tsx`:
```typescript
const colors: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-800 border-blue-200',
  // Add your custom category colors
};
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your `DATABASE_URL` to environment variables
4. Deploy!

### Other Platforms
- **Netlify**: Works with static export
- **Railway**: Full-stack deployment with database
- **Docker**: Use the included Dockerfile (if created)

## 🛠️ Development Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm start           # Start production server

# Database
npx drizzle-kit push     # Push schema changes
npx drizzle-kit studio   # Open Drizzle Studio
npm run db:seed         # Seed database (if needed)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test them
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Tailwind CSS](https://tailwindcss.com) - For beautiful styling
- [Drizzle ORM](https://orm.drizzle.team) - Type-safe database queries
- [Lucide React](https://lucide.dev) - Beautiful icons
