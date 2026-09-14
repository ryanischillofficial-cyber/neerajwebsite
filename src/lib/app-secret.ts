import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const secretPath = path.join(process.cwd(), "data", ".secret");

let cached: string | null = null;

export async function getAppSecret() {
  if (process.env.ADMIN_SECRET?.trim()) {
    return process.env.ADMIN_SECRET.trim();
  }
  if (cached) return cached;

  try {
    const stored = (await readFile(secretPath, "utf8")).trim();
    if (stored.length >= 32) {
      cached = stored;
      return stored;
    }
  } catch {
    /* create one below */
  }

  const generated = randomBytes(32).toString("hex");
  await mkdir(path.dirname(secretPath), { recursive: true });
  await writeFile(secretPath, generated, { encoding: "utf8" });
  cached = generated;
  return generated;
}
