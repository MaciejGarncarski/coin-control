import { render } from "@react-email/render";
import { VerifyEmail } from "@shared/email";
import { Worker } from "bullmq";
import { env } from "../env.js";
import { mailer } from "../mailer.js";
import { connection } from "../redis.js";
import type { EmailVerificationJob } from "@shared/schemas";

export const createEmailVerificationWorker = () => {
  const worker = new Worker<EmailVerificationJob>(
    "emailVerificationQueue",
    async (job) => {
      const [emailHTML, emailText] = await Promise.all([
        render(
          VerifyEmail({ otpCode: job.data.code, baseUrl: env.APP_ORIGIN })
        ),
        render(
          VerifyEmail({ otpCode: job.data.code, baseUrl: env.APP_ORIGIN }),
          { plainText: true }
        ),
      ]);

      await mailer.sendMail({
        to: job.data.userEmail,
        subject: "CoinControl | Email verification",
        html: emailHTML,
        text: emailText,
      });

      return { success: true };
    },
    {
      connection: connection,
    }
  );

  worker.on("completed", (job) => {
    console.log(`Email job with ID: ${job.id} has completed successfully`);
  });

  worker.on("failed", (job, err) => {
    console.error(
      `Email job with ID: ${job?.id} has failed with ${err.message}`
    );
  });
};
