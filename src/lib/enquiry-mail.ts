import { countryCodes } from "@/lib/country-codes";
import { brevoFromAddress, createMailer } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import {
  clip,
  FIELD_LIMITS,
  isTrustedAction,
  isValidEmail,
  requestIp,
  stripHeader,
} from "@/lib/security";
import { logSecurityEvent } from "@/lib/security-log";
import { addEnquiry } from "@/lib/site-data";

export type EnquiryState = {
  ok: boolean;
  error?: string;
};

const ENQUIRY_TO = "neeraj@nzaccountingandtax.org";

function readField(formData: FormData, key: string, max: number) {
  const value = formData.get(key);
  return typeof value === "string" ? clip(value, max) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildEnquiryText({
  yourName,
  firmName,
  email,
  phone,
  requirements,
}: {
  yourName: string;
  firmName: string;
  email: string;
  phone: string;
  requirements: string;
}) {
  return [
    ...(yourName ? [`NAME - ${yourName}`] : []),
    `ACCOUNTING FIRM NAME - ${firmName}`,
    `EMAIL ADDRESS - ${email}`,
    ...(phone ? [`PHONE NUMBER - ${phone}`] : []),
    "",
    "--",
    "",
    requirements,
  ].join("\n");
}

function fieldRow(label: string, value: string) {
  return `<p style="margin:0 0 14px;line-height:1.45;font-family:Georgia,'Times New Roman',serif;">
  <span style="font-size:16px;font-weight:700;letter-spacing:0.04em;color:#0B1F3A;">${label}</span>
  <span style="font-size:14px;font-weight:400;color:#2C2A26;"> - ${escapeHtml(value)}</span>
</p>`;
}

function buildEnquiryHtml({
  yourName,
  firmName,
  email,
  phone,
  requirements,
}: {
  yourName: string;
  firmName: string;
  email: string;
  phone: string;
  requirements: string;
}) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:28px 24px;background:#ffffff;">
  ${yourName ? fieldRow("NAME", yourName) : ""}
  ${fieldRow("ACCOUNTING FIRM NAME", firmName)}
  ${fieldRow("EMAIL ADDRESS", email)}
  ${phone ? fieldRow("PHONE NUMBER", phone) : ""}
  <p style="margin:22px 0 18px;font-size:14px;color:#8F7133;">--</p>
  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#2C2A26;white-space:pre-wrap;font-family:Georgia,'Times New Roman',serif;">${escapeHtml(requirements)}</p>
</body>
</html>`;
}

export async function processEnquiry(formData: FormData): Promise<EnquiryState> {
  const fail = {
    ok: false,
    error: "Your enquiry could not be sent. Please try again.",
  };

  if (!(await isTrustedAction())) return fail;

  const ip = (await requestIp()) || "unknown";
  const attempts = rateLimit(`enquiry:${ip}`, 5, 60 * 60 * 1000);
  if (!attempts.ok) {
    await logSecurityEvent("enquiry-limited", ip);
    return { ok: false, error: "Please wait before sending another enquiry." };
  }

  const honeypot = readField(formData, "website", 200);
  if (honeypot) {
    await logSecurityEvent("enquiry-honeypot", ip);
    return { ok: true };
  }

  const yourName = readField(formData, "yourName", FIELD_LIMITS.name);
  const firmName = stripHeader(readField(formData, "firmName", FIELD_LIMITS.firm));
  const email = stripHeader(readField(formData, "email", FIELD_LIMITS.email));
  const countryCode = readField(formData, "countryCode", 8);
  const phone = readField(formData, "phone", 24);
  const requirements = readField(
    formData,
    "requirements",
    FIELD_LIMITS.requirements,
  );

  if (!firmName || !email || !requirements) {
    return { ok: false, error: "Please complete the required fields." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const phoneDigits = phone.replace(/[\s()-]/g, "");
  let combinedPhone = "";

  if (phoneDigits) {
    const knownCode = countryCodes.some((country) => country.dial === countryCode);
    if (!knownCode) {
      return { ok: false, error: "Please select a valid country code." };
    }
    if (!/^\d{4,15}$/.test(phoneDigits)) {
      return { ok: false, error: "Please enter a valid phone number." };
    }
    combinedPhone = `${countryCode}${phoneDigits}`;
  }

  const transporter = createMailer();
  if (!transporter) {
    return fail;
  }

  const enquiry = {
    yourName,
    firmName,
    email,
    phone: combinedPhone,
    requirements,
  };

  try {
    await transporter.sendMail({
      from: brevoFromAddress(),
      to: ENQUIRY_TO,
      replyTo: email,
      subject: stripHeader(`ENQUIRY from ${firmName}`).slice(0, 180),
      text: buildEnquiryText(enquiry),
      html: buildEnquiryHtml(enquiry),
    });
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "smtp";
    const status =
      error && typeof error === "object" && "responseCode" in error
        ? String(error.responseCode)
        : "";
    await logSecurityEvent(
      "enquiry-mail-fail",
      ip,
      [code, status].filter(Boolean).join(" "),
    );
    return fail;
  }

  try {
    await addEnquiry(enquiry);
  } catch {
    /* Mail already sent. Live store is Vercel Blob; a store miss must not fail the form. */
  }

  return { ok: true };
}
