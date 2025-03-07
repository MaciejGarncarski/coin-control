import { z } from "zod";

export const apiErrorSchema = z.object({
  error: z.string().min(1),
  message: z.any(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export const testSchema = z.object({
  test: z.string(),
  drugiTest: z.number(),
});

export const jakisTest = "test";

export { z } from "zod";
