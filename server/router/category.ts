import { z } from "zod";
import { db } from "../../lib/db";
import { categories } from "../../lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";

const generateCategorySlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const categoryRouter = router({
  all: publicProcedure.query(async () => {
    return await db.query.categories.findMany();
  }),

  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const slug = generateCategorySlug(input.name);
      const [newCategory] = await db.insert(categories).values({ ...input, slug }).returning();
      return newCategory;
    }),

  update: publicProcedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(async ({ input }) => {
      const slug = generateCategorySlug(input.name);
      const [updatedCategory] = await db
        .update(categories)
        .set({ name: input.name, slug })
        .where(eq(categories.id, input.id))
        .returning();
      return updatedCategory;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.delete(categories).where(eq(categories.id, input.id));
    }),
});
