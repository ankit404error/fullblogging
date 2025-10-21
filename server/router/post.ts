import { z } from "zod";
import { db } from "../../lib/db";
import { posts } from "../../lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";

export const postRouter = router({
  // Fetch all posts
  all: publicProcedure.query(async () => {
    console.log("Fetching all posts");
    return await db.query.posts.findMany();
  }),

  // Fetch a post by ID
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.query.posts.findFirst({
        where: (p) => eq(p.id, input.id),
      });
    }),

  // Fetch posts by category
  byCategory: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      return await db.query.posts.findMany({
        where: (p) => eq(p.categoryId, input.categoryId),
      });
    }),

  // Create a new post
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        categoryId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim('-'); // Remove leading/trailing hyphens
      return await db.insert(posts).values({ ...input, slug });
    }),

  // Update a post
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        content: z.string(),
        categoryId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim('-'); // Remove leading/trailing hyphens
      return await db
        .update(posts)
        .set({
          title: input.title,
          content: input.content,
          categoryId: input.categoryId,
          slug,
        })
        .where(eq(posts.id, input.id));
    }),

  // Delete a post
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.delete(posts).where(eq(posts.id, input.id));
    }),
});
