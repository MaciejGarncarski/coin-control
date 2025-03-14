import { z } from "zod";

export const loginMutationSchema = z.object({
  email: z.string().email({ message: "Invalid email." }),
  password: z
    .string()
    .min(4, { message: "Password is too short." })
    .max(128, { message: "Password is too long." }),
});

export type LoginMutation = z.infer<typeof loginMutationSchema>;

export const registerMutationSchema = z
  .object({
    email: z.string().email({ message: "Invalid email." }),
    fullName: z
      .string()
      .min(1, { message: "Full name is required." })
      .max(32, { message: "Full name is too long." }),
    password: z
      .string()
      .min(4, { message: "Password is too short." })
      .max(128, { message: "Password is too long." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterMutation = z.infer<typeof registerMutationSchema>;

export const OTPResponeSchema = z.object({
  message: z.string(),
});

export type OTPResponse = z.infer<typeof OTPResponeSchema>;

export const OTPVerifyMutationSchema = z.object({
  code: z.string().length(6, { message: "Invalid OTP code." }),
});

export type OTPVerifyMutation = z.infer<typeof OTPVerifyMutationSchema>;
