import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full max-w-[1440px] mx-auto px-gutter flex items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <Link className="flex items-center gap-space-sm group" href="/">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
          </Link>
          <div className="hidden lg:block w-[1px] h-6 bg-surface-dim" />
          <div className="hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            <span>FDRE PPA Compliant</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-space-xl font-label-lg text-label-lg">
          <Link className="text-on-surface-variant hover:text-on-surface transition-colors" href="/tenders">
            Tenders
          </Link>
          <Link className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
            How it Works
          </Link>
          <Link className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
            Pricing
          </Link>
          <Link className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-space-md">
          <div className="flex items-center bg-surface-container-low p-space-xs rounded-lg font-label-sm text-label-sm">
            <button className="px-space-sm py-1 rounded bg-surface-container-lowest text-primary shadow-xs font-semibold" type="button">
              EN
            </button>
            <span className="text-outline-variant px-space-xs">|</span>
            <button className="px-space-sm py-1 rounded text-on-surface-variant hover:text-on-surface" type="button">
              አማ
            </button>
          </div>
          <Link className="hidden sm:inline-flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface px-space-md py-2 transition-colors" href="#">
            Login
          </Link>
          <Link className="inline-flex items-center justify-center font-label-md text-label-md bg-primary-container hover:bg-primary text-on-primary px-space-lg py-2 h-10 rounded-lg transition-colors shadow-sm" href="#">
            Register
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-space-xs">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}