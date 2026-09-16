import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { createHash, randomBytes } from "crypto";

const secretPath = path.join(process.cwd(), "data", ".secret");

let cached: string | null = null;

function derivedSecret() {
  return createHash("sha256")
    .update(
      `nzat-v1:${process.env.ADMIN_SECRET?.trim() || process.env.BREVO_SMTP_KEY?.trim() || "local"}`,
    )
    .digest("hex");
}

export async function getAppSecret() {
  const fromEnv = process.env.ADMIN_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 32) {
    return fromEnv;
  }
  if (cached) return cached;
  if (process.env.VERCEL) {
    cached = derivedSecret();
    return cached;
  }

  try {
    const stored = (await readFile(secretPath, "utf8")).trim();
    if (stored.length >= 32) {
      cached = stored;
      return stored;
    }
  } catch {
    /* create or fall back below */
  }

  const generated = randomBytes(32).toString("hex");
  try {
    await mkdir(path.dirname(secretPath), { recursive: true });
    await writeFile(secretPath, generated, { encoding: "utf8" });
    cached = generated;
    return generated;
  } catch {
    cached = derivedSecret();
    return cached;
  }
}
