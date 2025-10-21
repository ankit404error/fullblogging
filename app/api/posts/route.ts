import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { posts } from '../../../lib/drizzle/schema';

export async function GET() {
  try {
    const allPosts = await db.query.posts.findMany({
      with: {
        category: true
      },
      orderBy: (posts, { desc }) => [desc(posts.createdAt)]
    });
    
    return NextResponse.json(allPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, categoryId, isDraft } = body;
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newPost = await db.insert(posts).values({
      title,
      content,
      slug,
      categoryId: categoryId ? parseInt(categoryId) : null,
      published: !isDraft,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}