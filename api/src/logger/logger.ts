import { environment } from "@config/consatnts.js";
import type { Options } from "pino-http";
import { pinoHttp } from "pino-http";

const envToLogger: Record<"development" | "production", Options> = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: {},
};

export const logger = pinoHttp(envToLogger[environment]);
