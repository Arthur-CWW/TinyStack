import { title } from "process";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { fakePost } from "~/utils/data";
import { newPostSchema, postSchema } from "~/utils/types";

import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { Category, Prisma } from "@prisma/client";
// import { CommentCreateManyArgs } from "@prisma/client";

function addSubtitle<
  T extends {
    subtitle: string | null;
    content: string;
  },
>(data: T[]) {
  const post = data.map((post) => {
    const sub = new JSDOM(post.content).window.document.body.textContent;

    const nwords = sub?.split(" ").length;
    if (!post?.subtitle) {
      return {
        ...post,
        subtitle: sub?.slice(0, 400) ?? "",
        nwords,
      };
    }
    return {
      ...post,
      nwords,
    };
  });
  return post;
}
const window = new JSDOM("").window;
export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
      // Might want to hoist these objects to the server context
      const purify = DOMPurify(window);
      const clean = purify.sanitize(input.content);

      return ctx.db.post.create({
        data: {
          title: input.title,
          category: input.category ?? Category.None,
          content: clean,
          subtitle: input.subtitle,
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              create: { name: tag },
              where: { name: tag },
            })),
          },
          published: input.published,
          authorId: ctx.session.user.id,
        },
      });
    }),

  // if post does not have sub title, use the first 100 characters of the content
  // top blog posts
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      // where: { createdBy: { id: ctx.session.user.id } },
    });
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
  prototype: publicProcedure.query(async ({ ctx }) => {
    // get prisma top blogs and there authors
    const posts = await ctx.db.post.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });
    const rv = addSubtitle(posts);
    return rv;
  }),
  getUserPosts: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // const authorId = await ctx.db.user.findUnique({
      //   fa
      const posts = await ctx.db.post.findMany({
        where: { authorId: input.id },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
        },
      });
      const hydratedPosts = addSubtitle(posts);

      return { posts: hydratedPosts, user: hydratedPosts[0]?.author };
    }),

  getPost: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      console.log(input.id);
      return ctx.db.post.findFirst({
        where: { id: input.id },
        include: {
          author: true,
          comments: {
            // select where replyTo is null
            where: { replyTo: null },

            include: {
              author: true,
              // include reply count avoid selecting actual replies
              _count: true,
            },
          },
        },
      });
    }),
  getReplies: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { replyId: input.id },
        include: {
          author: true,

          _count: true,
        },
      });
    }),

  getComments: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { postId: input.id, AND: { replyId: null } },
        include: {
          author: true,
          _count: true,
        },
      });
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string(),
        authorId: z.string(),
        replyId: z.optional(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let commentData: Prisma.CommentCreateInput = {
        content: input.content,
        author: {
          connect: { id: input.authorId },
        },
        post: {
          connect: { id: input.postId },
        },
      };

      if (input.replyId) {
        commentData.replyTo = {
          connect: { id: input.replyId },
        };
      }

      return ctx.db.comment.create({
        data: commentData,
      });
    }),
});
// type Parameters<T extends (...args: any[]) => any> = T extends (
//   ...args: infer P
// ) => any
//   ? P
//   : never;
