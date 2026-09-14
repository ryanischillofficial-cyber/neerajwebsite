import Link from "next/link";

type PlaceholderPageProps = {
  title: string;
  note: string;
};

export function PlaceholderPage({ title, note }: PlaceholderPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-24 sm:px-8">
      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brass-deep">Coming next</p>
      <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">{title}</h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-muted">{note}</p>
      <Link
        href="/home/"
        className="mt-10 inline-flex w-fit border border-ink px-6 py-3 text-[0.72rem] tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        BACK TO HOME
      </Link>
    </main>
  );
}
