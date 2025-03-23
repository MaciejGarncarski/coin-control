import { Worker } from "bullmq";
import { mailer } from "../mailer.js";
import { render } from "@react-email/render";
import { env } from "../env.js";
import { connection } from "../redis.js";
import { ResetPasswordNotificationEmail } from "@shared/email";
import type { ResetPasswordNotificationJob } from "@shared/schemas";

const formatter = Intl.DateTimeFormat("en", {
  dateStyle: "short",
  timeStyle: "short",
});

export const createResetPasswordNotificationWorker = () => {
  const worker = new Worker<ResetPasswordNotificationJob>(
    "resetPasswordNotification",
    async (job) => {
      const formattedDate = formatter.format(job.data.createdAt);

      const [emailHTML, emailText] = await Promise.all([
        render(
          ResetPasswordNotificationEmail({
            baseUrl: env.APP_ORIGIN,
            createdAt: formattedDate,
          })
        ),
        render(
          ResetPasswordNotificationEmail({
            baseUrl: env.APP_ORIGIN,
            createdAt: formattedDate,
          }),
          {
            plainText: true,
          }
        ),
      ]);

      await mailer.sendMail({
        to: job.data.userEmail,
        subject: "CoinControl | Password reset notification",
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
