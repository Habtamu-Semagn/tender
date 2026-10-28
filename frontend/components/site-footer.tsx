import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-margin">
      <div className="w-full max-w-[1440px] mx-auto px-gutter pt-margin pb-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter pb-margin">
          <div className="lg:col-span-2 space-y-space-md pr-0 lg:pr-margin">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
              </div>
              <div className="font-headline-sm text-headline-sm text-primary tracking-tight">
                Chereta <span className="text-on-surface font-normal text-body-md">| ጨረታ</span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              The national open digital procurement portal of the Federal Democratic Republic of Ethiopia. Empowering institutional transparency, standardized bidding, and verified supplier certification.
            </p>
            <div className="flex items-center gap-space-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-secondary">verified_user</span>
              <span className="font-label-sm text-label-sm">Federal Public Procurement Directive No. 2016/2024 Verified</span>
            </div>
          </div>
          <div>
            <div className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">Procurement</div>
            <ul className="space-y-space-sm font-body-md text-body-md text-on-surface-variant">
              <li className="hover:text-primary transition-colors">
                <Link href="/tenders">Active Tenders</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link href="#">Post Tender Notice</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link href="#">Directive 2016/2024</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link href="#">CPO Verification Hub</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link href="#">Regional Procurement</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">Financial Systems</div>
            <ul className="space-y-space-sm font-body-md text-body-md text-on-surface-variant">
              <li className="flex items-center gap-space-xs hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[16px] text-primary">account_balance</span>
                <Link href="#">Telebirr Gateway</Link>
              </li>
              <li className="flex items-center gap-space-xs hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[16px] text-primary">account_balance</span>
                <Link href="#">Commercial Bank of Ethiopia</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link href="#">Electronic Bid Bond (CPO)</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link href="#">Fee Schedule</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link href="#">Audit Compliance</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">Contact &amp; Support</div>
            <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">location_on</span>
                <span>Arada Sub-city, Woreda 01, Commercial Nomads Tower, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                <span>National Hotline: <strong className="font-mono-data text-mono-data text-on-surface font-semibold">8989</strong></span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                <span>desk@chereta.gov.et</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}