// from faker import Faker

// fake = Faker()

// def generate_blog_post():
//     return {
//         "title": fake.sentence(),
//         "content": fake.text(max_nb_chars=2000),
//         "author": fake.name(),
//         "publish_date": fake.date(),
//         "tags": [fake.word() for _ in range(3)],
//         "category": fake.word()
//     }

// fake_posts = [generate_blog_post() for _ in range(10)]

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// import { faker } from "@faker-js/faker";

// export const generateBlogPost = () => {
//   return {
//     title: faker.lorem.sentence(),
//     content: faker.lorem.paragraphs(3),
//     author: faker.person.fullName(),
//     publishDate: faker.date.past(),
//     tags: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],

//     category: faker.lorem.word(),
//   };
// };
import { fakePost } from "~/utils/data";
export const postRouter = createTRPCRouter({
  getblogPost: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        // ...generateBlogPost(),
        ...fakePost(),
      };
    }),
  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //         createdBy: { connect: { id: ctx.session.user.id } },
  //       },
  //     });
  //   }),

  // getLatest: protectedProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //     where: { createdBy: { id: ctx.session.user.id } },
  //   });
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
