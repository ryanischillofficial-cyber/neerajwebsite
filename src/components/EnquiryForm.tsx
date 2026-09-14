"use client";

import { useState, type FormEvent } from "react";
import { countryCodes, defaultCountryDial } from "@/lib/country-codes";

const fieldClass =
  "w-full border border-line bg-paper px-4 py-3 text-base text-body outline-none transition-colors focus:border-ink";

const labelClass =
  "mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted";

function RequiredMark() {
  return (
    <span className="ml-0.5 text-red-600" aria-hidden>
      *
    </span>
  );
}

export function EnquiryForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        body: new FormData(form),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };
      if (result.ok) {
        setSubmitted(true);
        return;
      }
      setError(
        result.error || "Your enquiry could not be sent. Please try again.",
      );
    } catch {
      setError("Your enquiry could not be sent. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div role="status" aria-live="polite">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-brass-deep">
          Received
        </p>
        <p className="mt-4 font-serif text-3xl leading-snug text-ink sm:text-4xl">
          Your enquiry has been submitted.
        </p>
        <span className="mt-6 block h-px w-12 bg-brass" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-8">
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="yourName" className={labelClass}>
            Your Name
          </label>
          <input
            id="yourName"
            name="yourName"
            type="text"
            autoComplete="name"
            maxLength={120}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="firmName" className={labelClass}>
            Accounting Firm Name
            <RequiredMark />
          </label>
          <input
            id="firmName"
            name="firmName"
            type="text"
            autoComplete="organization"
            required
            maxLength={200}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email Address
          <RequiredMark />
        </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            suppressHydrationWarning
            className={fieldClass}
          />
      </div>

      <div>
        <p id="phone-label" className={labelClass}>
          Phone Number
        </p>
        <div className="grid gap-3 sm:grid-cols-[13.5rem_minmax(0,1fr)]">
          <label className="sr-only" htmlFor="countryCode">
            Country code
          </label>
          <select
            id="countryCode"
            name="countryCode"
            defaultValue={defaultCountryDial}
            autoComplete="off"
            suppressHydrationWarning
            className={`enquiry-country-code ${fieldClass} appearance-none bg-[length:0.7rem] bg-[right_0.9rem_center] bg-no-repeat pr-10`}
            aria-describedby="phone-label"
          >
            {countryCodes.map((country) => (
              <option
                key={`${country.name}-${country.dial}`}
                value={country.dial}
              >
                {country.name} ({country.dial})
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="phone">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel-national"
            inputMode="tel"
            maxLength={24}
            suppressHydrationWarning
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="requirements" className={labelClass}>
          Brief Requirements
          <RequiredMark />
        </label>
        <textarea
          id="requirements"
          name="requirements"
          rows={5}
          required
          maxLength={8000}
          className={`${fieldClass} min-h-28 resize-y`}
        />
      </div>

      {error ? (
        <p className="text-sm text-ink" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center bg-ink px-7 py-3.5 text-[0.72rem] tracking-[0.2em] text-paper transition-colors hover:bg-ink-soft disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {pending ? "SUBMITTING" : "SUBMIT ENQUIRY"}
      </button>
    </form>
  );
}
