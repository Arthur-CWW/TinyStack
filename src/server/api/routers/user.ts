import { getProviders } from "next-auth/react";
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
  getProviders: publicProcedure.query(async ({ ctx }) => {
    const providers = await getProviders();
    if (!providers) return [];
    // const providerLogoPath = "https://authjs.dev/img/providers"
    // const providerLogo = `${providerLogoPath}/${provider.id}.svg`;
    const providersWithLogo = Object.entries(providers).map(
      ([id, provider]) => {
        return {
          ...provider,
          logoUrl: `https://authjs.dev/img/providers/${id}.svg`,
        };
      },
    );
    return providersWithLogo;
  }),
});
