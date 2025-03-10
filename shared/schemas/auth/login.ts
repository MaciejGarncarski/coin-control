import { z } from "zod";

export const loginMutationSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(4, { message: "Password is too short." })
    .max(128, { message: "Password is too long." }),
});

export type LoginMutation = z.infer<typeof loginMutationSchema>;

export const loginMutationResponseSchema = z.object({
  data: z.object({
    id: z.string(),
  }),
});

export type LoginResponse = z.infer<typeof loginMutationResponseSchema>;
