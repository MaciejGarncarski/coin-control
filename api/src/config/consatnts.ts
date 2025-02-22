import { env } from "@config/env.js";

export const environment = env.NODE_ENV;
export const isDev = environment === "development";
export const isProd = environment === "production";
