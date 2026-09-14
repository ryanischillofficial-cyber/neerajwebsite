import nodemailer from "nodemailer";

export function brevoFromAddress() {
  const from = process.env.BREVO_SMTP_USER?.trim() ?? "";
  return `"A&T" <${from}>`;
}

export function createMailer() {
  const from = process.env.BREVO_SMTP_USER?.trim();
  const login = process.env.BREVO_SMTP_LOGIN?.trim() || from;
  const pass = process.env.BREVO_SMTP_KEY?.trim();
  if (!from || !login || !pass) return null;

  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: login,
      pass,
    },
    tls: {
      minVersion: "TLSv1.2",
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}
