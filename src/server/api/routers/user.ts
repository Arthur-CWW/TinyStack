import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { fakePost } from "~/utils/data";
export const userRouter = createTRPCRouter({
  createNewUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          image: input.image,
        },
      });
      return user;
    }),
});
