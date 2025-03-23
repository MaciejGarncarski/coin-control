import { Worker } from "bullmq";
import { mailer } from "../mailer.js";
import { ResetPasswordEmail } from "@shared/email";
import { render } from "@react-email/render";
import { env } from "../env.js";
import { connection } from "../redis.js";
import type { ResetPasswordLinkJob } from "@shared/schemas";

export const createResetPasswordLinkWorker = () => {
  const worker = new Worker<ResetPasswordLinkJob>(
    "resetPasswordLinkQueue",
    async (job) => {
      const [emailHTML, emailText] = await Promise.all([
        render(
          ResetPasswordEmail({
            resetToken: job.data.passwordResetCode,
            baseUrl: env.APP_ORIGIN,
          })
        ),
        render(
          ResetPasswordEmail({
            resetToken: job.data.passwordResetCode,
            baseUrl: env.APP_ORIGIN,
          }),
          {
            plainText: true,
          }
        ),
      ]);

      await mailer.sendMail({
        to: job.data.userEmail,
        subject: "CoinControl | Reset password",
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
