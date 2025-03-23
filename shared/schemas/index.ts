import { z } from "zod";

export const apiErrorSchema = z.object({
  statusCode: z.number().min(100).max(600).optional(),
  message: z.string(),
  toastMessage: z.string().optional(),
  additionalMessage: z.string().optional(),
  stack: z.string().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export * from "./auth.js";
export * from "./user.js";

export { z } from "zod";

export type {
  EmailVerificationJob,
  ResetPasswordLinkJob,
  ResetPasswordNotificationJob,
} from "./workers.js";
