"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-NZ">
      <body style={{ background: "#F7F3EB", color: "#2C2A26", margin: 0 }}>
        <main
          style={{
            maxWidth: "40rem",
            margin: "0 auto",
            padding: "6rem 1.25rem",
            fontFamily: "Georgia, serif",
          }}
        >
          <p style={{ letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.72rem" }}>
            Error
          </p>
          <h1 style={{ fontSize: "2.25rem", color: "#0B1F3A" }}>
            Something went wrong
          </h1>
          <p style={{ lineHeight: 1.7, color: "#5C584F" }}>
            The page could not be loaded. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "2rem",
              border: "1px solid #0B1F3A",
              background: "transparent",
              padding: "0.75rem 1.5rem",
              letterSpacing: "0.2em",
              fontSize: "0.72rem",
            }}
          >
            TRY AGAIN
          </button>
        </main>
      </body>
    </html>
  );
}
