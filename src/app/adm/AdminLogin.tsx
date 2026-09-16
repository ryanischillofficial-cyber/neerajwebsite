"use client";

import { useActionState, useState, type FormEvent } from "react";
import { signInAdmin, type AdminState } from "@/app/adm/actions";
import { LogoMark } from "@/components/LogoMark";

const initialState: AdminState = { ok: false };

export function AdminLogin() {
  const [state, formAction, pending] = useActionState(signInAdmin, initialState);
  const [recovering, setRecovering] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");

  async function onRecover(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRecovering(true);
    setRecoveryError("");
    setRecoverySent(false);
    try {
      const response = await fetch("/api/adm-recover/", {
        method: "POST",
        signal: AbortSignal.timeout(35000),
      });
      const result = (await response.json()) as {
        sent?: boolean;
        error?: string;
      };
      if (result.sent) {
        setRecoverySent(true);
        return;
      }
      setRecoveryError(
        result.error || "The password could not be emailed.",
      );
    } catch {
      setRecoveryError("The password could not be emailed.");
    } finally {
      setRecovering(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center px-5 py-12 sm:py-16">
      <div className="w-full max-w-md border border-line bg-paper p-3">
        <div className="bg-cream px-6 py-9 sm:px-10 sm:py-12">
          <LogoMark />
          <p className="mt-8 text-[0.72rem] uppercase tracking-[0.24em] text-brass-deep">
            Administration
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink">Admin Login</h1>
          <span className="mt-6 block h-px w-12 bg-brass" />

          <form action={formAction} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                maxLength={256}
                className="w-full border border-line bg-paper px-4 py-3 text-body outline-none transition-colors focus:border-ink"
              />
            </div>

            {state.error ? (
              <p className="text-sm text-ink" role="alert">
                {state.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-[3.25rem] w-full items-center justify-center bg-ink px-8 text-[0.78rem] tracking-[0.2em] text-paper transition-colors hover:bg-ink-soft disabled:cursor-wait disabled:opacity-70"
            >
              {pending ? "SIGNING IN" : "SIGN IN"}
            </button>
          </form>

          <form onSubmit={onRecover} className="mt-5 text-center">
            <button
              type="submit"
              disabled={recovering}
              className="text-[0.68rem] tracking-[0.16em] text-muted uppercase transition-colors hover:text-ink disabled:opacity-70"
            >
              {recovering ? "SENDING" : "FORGET PASSWORD"}
            </button>
            {recoverySent ? (
              <p className="mt-3 text-sm text-muted" role="status">
                The password has been emailed.
              </p>
            ) : null}
            {recoveryError ? (
              <p className="mt-3 text-sm text-ink" role="alert">
                {recoveryError}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
