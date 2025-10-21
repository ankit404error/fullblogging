import { z } from "zod";
import { db } from "../../lib/db";
import { categories } from "../../lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";

export const categoryRouter = router({
  // Fetch all categories
  all: publicProcedure.query(async () => {
    return await db.query.categories.findMany();
  }),

  // Create a new category
  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
      const [newCategory] = await db.insert(categories).values({ ...input, slug }).returning();
      return newCategory;
    }),

  // Update a category
  update: publicProcedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(async ({ input }) => {
      const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      const [updatedCategory] = await db
        .update(categories)
        .set({ name: input.name, slug })
        .where(eq(categories.id, input.id))
        .returning();
      return updatedCategory;
    }),

  // Delete a category
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.delete(categories).where(eq(categories.id, input.id));
    }),
});
