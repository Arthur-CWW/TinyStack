import { z } from "zod";

import { Category } from "@prisma/client";

export type Undefinable<T> = {
  [P in keyof T]: null extends T[P] ? T[P] | undefined : T[P];
};
export const CategorySchema = z.nativeEnum(Category);
export const newPostSchema = z.object({
  title: z.string().min(6),
  subtitle: z.optional(z.string()),
  category: z.optional(CategorySchema),
});

export const postSchema = newPostSchema.extend({
  // name: z.string().min(6),
  // category: z.string().min(1),
  // title: z.string().min(6),
  // category: CategorySchema,
  content: z.string().min(6),
  tags: z.array(z.string()),
  published: z.boolean(),
});
