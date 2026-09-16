import { copyFile, mkdir, rename, unlink, writeFile, readFile } from "fs/promises";
import path from "path";
import { get, put } from "@vercel/blob";

const dataDir = path.join(process.cwd(), "data");
const blobPrefix = "nzat-admin/";

function remoteEnabled() {
  return Boolean(process.env.VERCEL);
}

const memory = new Map<string, { at: number; json: string }>();
const locks = new Map<string, Promise<unknown>>();

function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const previous = locks.get(key) ?? Promise.resolve();
  const run = previous.then(fn, fn);
  locks.set(
    key,
    run.then(
      () => undefined,
      () => undefined,
    ),
  );
  return run;
}

async function readLocal(file: string, fallback: string) {
  try {
    return await readFile(path.join(dataDir, file), "utf8");
  } catch {
    return fallback;
  }
}

async function writeLocal(file: string, json: string) {
  await mkdir(dataDir, { recursive: true });
  const target = path.join(dataDir, file);
  const tmp = `${target}.${process.pid}.tmp`;
  await writeFile(tmp, json, "utf8");
  try {
    await rename(tmp, target);
  } catch {
    await copyFile(tmp, target);
    await unlink(tmp).catch(() => undefined);
  }
}

async function readRemote(file: string, fallback: string) {
  const cached = memory.get(file);
  if (cached && Date.now() - cached.at < 1500) return cached.json;

  try {
    const result = await get(`${blobPrefix}${file}`, {
      access: "private",
      useCache: false,
    });
    if (!result || result.statusCode !== 200) {
      memory.set(file, { at: Date.now(), json: fallback });
      return fallback;
    }
    const json = await new Response(result.stream).text();
    const value = json || fallback;
    memory.set(file, { at: Date.now(), json: value });
    return value;
  } catch {
    return fallback;
  }
}

async function writeRemote(file: string, json: string) {
  memory.set(file, { at: Date.now(), json });
  await put(`${blobPrefix}${file}`, json, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

export async function readJsonStore<T>(file: string, fallback: T): Promise<T> {
  const raw = remoteEnabled()
    ? await readRemote(file, JSON.stringify(fallback))
    : await readLocal(file, JSON.stringify(fallback));
  try {
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export async function writeJsonStore(file: string, value: unknown) {
  const json = JSON.stringify(value, null, remoteEnabled() ? 0 : 2);
  if (remoteEnabled()) {
    await writeRemote(file, json);
    return;
  }
  await writeLocal(file, json);
}

export async function updateJsonStore<T>(
  file: string,
  fallback: T,
  updater: (current: T) => T | Promise<T>,
) {
  return withLock(file, async () => {
    const current = await readJsonStore<T>(file, fallback);
    const next = await updater(current);
    await writeJsonStore(file, next);
    return next;
  });
}
