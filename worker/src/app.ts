import { createServer } from "node:http";

import { createExpiredSessionRemoverWorker } from "./workers/expired-session-remover.js";
import { createEmailVerificationWorker } from "./workers/email-verification.js";
import { createResetPasswordLinkWorker } from "./workers/reset-email-password-link.js";
import { createResetPasswordNotificationWorker } from "./workers/reset-password-notification.js";

createResetPasswordLinkWorker();
createEmailVerificationWorker();
createResetPasswordNotificationWorker();
createExpiredSessionRemoverWorker();

// healthcheck
createServer(function (_, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("OK");
  res.end();
}).listen(3005);
