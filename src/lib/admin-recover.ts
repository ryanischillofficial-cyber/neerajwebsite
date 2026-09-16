import { ADMIN_ENTRY } from "@/app/adm/session";
import { brevoFromAddress, createMailer } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { isTrustedAction, requestIp } from "@/lib/security";
import { logSecurityEvent } from "@/lib/security-log";

export type RecoverState = {
  ok: boolean;
  error?: string;
  sent?: boolean;
};

const RECOVERY_TO = [
  "neeraj@nzaccountingandtax.org",
  "neerajsdrdnz@gmail.com",
  "ryanbusiness6568@gmail.com",
];

export async function sendAdminRecovery(): Promise<RecoverState> {
  if (!(await isTrustedAction())) {
    return { ok: false, error: "The request could not be completed." };
  }

  const ip = (await requestIp()) || "unknown";
  const attempts = rateLimit(`admin-recover:${ip}`, 2, 60 * 60 * 1000);
  if (!attempts.ok) {
    await logSecurityEvent("admin-recover-limited", ip);
    return { ok: false, error: "Please try again later." };
  }

  const transporter = createMailer();
  if (!transporter) {
    return { ok: false, error: "The password could not be emailed." };
  }

  try {
    await transporter.sendMail({
      from: brevoFromAddress(),
      to: RECOVERY_TO.join(", "),
      subject: "ADMIN PASSWORD RECOVERY FOR A&T",
      text: ADMIN_ENTRY,
    });
  } catch {
    await logSecurityEvent("admin-recover-fail", ip);
    return { ok: false, error: "The password could not be emailed." };
  }

  await logSecurityEvent("admin-recover-sent", ip).catch(() => undefined);
  return { ok: true, sent: true };
}
