import { db } from '../lib/db';
import { categories } from '../lib/drizzle/schema';

const seedCategories = async () => {
  console.log('Seeding categories...');
  
  const categoriesToSeed = [
    { name: 'Technology', slug: 'technology', description: 'Posts about technology, programming, and digital innovations' },
    { name: 'Design', slug: 'design', description: 'UI/UX design, graphic design, and creative content' },
    { name: 'Business', slug: 'business', description: 'Entrepreneurship, startups, and business strategies' },
    { name: 'Lifestyle', slug: 'lifestyle', description: 'Personal development, health, and lifestyle tips' },
    { name: 'Travel', slug: 'travel', description: 'Travel guides, experiences, and destinations' },
    { name: 'Food', slug: 'food', description: 'Recipes, restaurant reviews, and culinary experiences' },
    { name: 'Health', slug: 'health', description: 'Health tips, fitness, and wellness content' },
    { name: 'Education', slug: 'education', description: 'Learning resources, tutorials, and educational content' }
  ];

  try {
    for (const category of categoriesToSeed) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }
    console.log('Categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  seedCategories().then(() => process.exit(0));
}

export { seedCategories };