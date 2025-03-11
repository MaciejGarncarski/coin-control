import { z } from "zod";

export const apiErrorSchema = z.object({
  statusCode: z.number().min(100).max(600),
  message: z.string(),
  toastMessage: z.string().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export * from "./auth/login.js";
export { z } from "zod";
