import { z } from "zod";
import { db } from "../../lib/db";
import { posts } from "../../lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const postRouter = router({
  all: publicProcedure.query(async () => {
    return await db.query.posts.findMany();
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.query.posts.findFirst({
        where: (p) => eq(p.id, input.id),
      });
    }),

  byCategory: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      return await db.query.posts.findMany({
        where: (p) => eq(p.categoryId, input.categoryId),
      });
    }),

  create: publicProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      categoryId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const slug = generateSlug(input.title);
      const [newPost] = await db.insert(posts).values({ ...input, slug }).returning();
      return newPost;
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string(),
      content: z.string(),
      categoryId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const slug = generateSlug(input.title);
      const [updatedPost] = await db
        .update(posts)
        .set({
          title: input.title,
          content: input.content,
          categoryId: input.categoryId,
          slug,
        })
        .where(eq(posts.id, input.id))
        .returning();
      return updatedPost;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.delete(posts).where(eq(posts.id, input.id));
    }),
});
