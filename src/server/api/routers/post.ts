import { Category } from "@prisma/client";
import { title } from "process";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { fakePost } from "~/utils/data";

const CategorySchema = z.nativeEnum(Category);

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        // name: z.string().min(6),
        // category: z.string().min(1),
        title: z.string().min(6),
        category: CategorySchema,
        content: z.string().min(6),
        tags: z.array(z.string()),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 100));
      console.log("input", input);

      return ctx.db.post.create({
        data: {
          title: input.title,
          category: input.category,
          content: input.content,
          tags: {
            create: input.tags.map((tag) => ({ name: tag })),
          },
          published: input.published,
          authorId: ctx.session.user.id,
          // comments: { create: [] },
          // createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getUserPosts: publicProcedure
    .input(z.object({ author: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.post.findMany({
        where: { author: { name: input.author } },
      });
    }),

  // top blog posts
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      // where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getblogPost: publicProcedure
    .input(z.object({ nPosts: z.number() }))
    .query(({ input }) => {
      return Array.from({ length: input.nPosts }, () => fakePost());
    }),

  check: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  checkSecret: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
