"use client";

import { useActionState } from "react";
import { recoverAdminPassword, signInAdmin, type AdminState } from "@/app/adm/actions";
import { LogoMark } from "@/components/LogoMark";

const initialState: AdminState = { ok: false };

export function AdminLogin() {
  const [state, formAction, pending] = useActionState(signInAdmin, initialState);
  const [recovery, recoverAction, recovering] = useActionState(
    recoverAdminPassword,
    initialState,
  );

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

          <form action={recoverAction} className="mt-5 text-center">
            <button
              type="submit"
              disabled={recovering}
              className="text-[0.68rem] tracking-[0.16em] text-muted uppercase transition-colors hover:text-ink disabled:opacity-70"
            >
              {recovering ? "SENDING" : "FORGET PASSWORD"}
            </button>
            {recovery.sent ? (
              <p className="mt-3 text-sm text-muted" role="status">
                The password has been emailed.
              </p>
            ) : null}
            {recovery.error ? (
              <p className="mt-3 text-sm text-ink" role="alert">
                {recovery.error}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
