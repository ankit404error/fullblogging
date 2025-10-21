import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { categories } from '../../../lib/drizzle/schema';

export async function GET() {
  try {
    let allCategories = await db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)]
    });
    
    // If no categories exist, create some default ones
    if (allCategories.length === 0) {
      const defaultCategories = [
        { name: 'Technology', slug: 'technology', description: 'Posts about technology, programming, and digital innovations' },
        { name: 'Design', slug: 'design', description: 'UI/UX design, graphic design, and creative content' },
        { name: 'Business', slug: 'business', description: 'Entrepreneurship, startups, and business strategies' },
        { name: 'Lifestyle', slug: 'lifestyle', description: 'Personal development, health, and lifestyle tips' },
        { name: 'Travel', slug: 'travel', description: 'Travel guides, experiences, and destinations' },
        { name: 'Food', slug: 'food', description: 'Recipes, restaurant reviews, and culinary experiences' },
        { name: 'Health', slug: 'health', description: 'Health tips, fitness, and wellness content' },
      ];
      
      try {
        for (const category of defaultCategories) {
          await db.insert(categories).values(category);
        }
        allCategories = await db.query.categories.findMany({
          orderBy: (categories, { asc }) => [asc(categories.name)]
        });
      } catch (insertError) {
        console.error('Error creating default categories:', insertError);
      }
    }
    
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Category name must be at least 2 characters' },
        { status: 400 }
      );
    }
    
    // Check if category already exists
    const existingCategory = await db.query.categories.findFirst({
      where: (categories, { ilike }) => ilike(categories.name, name.trim())
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newCategory = await db.insert(categories).values({
      name: name.trim(),
      slug,
      description: description || null,
    }).returning();
    
    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
