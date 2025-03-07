import { z } from "zod";

export const loginMutationSchema = z.object({
  username: z.string().min(5).max(32),
  password: z.string().min(6).max(128),
});

export const loginMutationResponseSchema = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  message: z.string(),
});
