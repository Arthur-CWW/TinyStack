import { title } from "process";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { fakePost } from "~/utils/data";
import { postSchema } from "~/utils/types";

import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { Category } from "@prisma/client";

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
      // console.log("sub", sub);
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
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 100));
      // TODO dom purify the content

      // Might want to hoist these objects to the server context
      const purify = DOMPurify(window);
      const clean = purify.sanitize(input.content);
      // console.log("cleaned", clean);

      return ctx.db.post.create({
        data: {
          title: input.title,
          category: input.category,
          content: clean,
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

  getUserPosts: publicProcedure
    .input(z.object({ author: z.string() }))
    .query(async ({ input, ctx }) => {
      const data = await ctx.db.post.findMany({
        where: { author: { name: input.author } },
      });
      addSubtitle(data);
      return data;
    }),
  // if post does not have sub title, use the first 100 characters of the content
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

    // return [
    //   {
    //     id: 1,
    //     author: "Austin Starks in DataDrivenInvestor",
    //     title:
    //       "My ChatGPT-Generated Trading Strategies are DEMOLISHING the Market.",
    //     description: "How to create multiple income streams",
    //     category: "Investing",
    //     date: new Date("Nov 16, 2023"),
    //     profileImage: "https://picsum.photos/id/237/200/300",
    //   },
    //   {
    //     id: 3,
    //     author: "Kevin Nokia",
    //     title: "Reading Books Is Useless: Here’s a Better Way to Read",
    //     description: "How to create multiple income streams",
    //     category: "Reading",
    //     date: new Date("Jan 28, 2024"),
    //     profileImage: "https://picsum.photos/id/237/200/300",
    //   },
    //   {
    //     id: 9,
    //     author: "Joseph Mavericks in Entrepreneurship Handbook",
    //     title:
    //       "This Entrepreneur Made $10M in 4 Years — With 10 Income Streams",
    //     description: "How to create multiple income streams",
    //     category: "Entrepreneurship",
    //     date: new Date("Sep 15, 2023"),
    //     profileImage: "https://picsum.photos/id/237/200/300",
    //   },
    //   {
    //     id: 10,
    //     author: "Natassha Selvaraj in Towards AI",
    //     title: "How I’m Using ChatGPT and AI to Make Money Online",
    //     description: "How to create multiple income streams",
    //     category: "Member-only",
    //     date: new Date("Nov 9, 2023"),
    //     profileImage: "https://picsum.photos/id/237/200/300",
    //   },
    // ];
  }),
  getPost: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findFirst({
        where: { id: input.id },
        include: {
          author: true,
        },
      });
    }),
});
