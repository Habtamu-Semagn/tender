import Link from "next/link";

export function BreadcrumbStrip() {
  return (
    <section className="w-full bg-surface-container-lowest shadow-sm">
      <div className="max-w-[1440px] mx-auto px-gutter py-space-sm flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm font-label-md text-label-md text-on-surface-variant flex-wrap">
          <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </Link>
          <span>/</span>
          <Link className="hover:text-primary transition-colors" href="/tenders">
            Tenders
          </Link>
          <span>/</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Ethiopian Roads Administration (ERA)</span>
          <span>/</span>
          <span className="font-mono-data text-mono-data text-on-surface bg-surface-container px-space-xs py-0.5 rounded">ERA/NCB/58/2024</span>
        </div>
        <Link className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors group" href="/tenders">
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
          <span>Back to Tenders / ወደ ዝርዝር ተመለስ</span>
        </Link>
      </div>
    </section>
  );
}