import { LogoMark } from "@/components/LogoMark";
import { site } from "@/lib/site";

export function ConstructionScreen() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-16 sm:py-24">
      <div className="flex flex-col items-center text-center">
        <LogoMark />
        <p className="mt-6 font-serif text-[1.05rem] text-ink">{site.name}</p>
        <span className="mt-8 block h-px w-12 bg-brass" />
        <h1 className="mt-8 max-w-[16rem] font-serif text-[1.7rem] leading-tight tracking-[0.06em] text-ink sm:max-w-none sm:text-4xl sm:tracking-[0.08em]">
          WEBSITE IS UNDER CONSTRUCTION
        </h1>
      </div>
    </main>
  );
}
