import Link from "next/link";

export function TopVerificationBanner() {
  return (
    <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex items-start md:items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">pending_actions</span>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-space-sm">
              <h1 className="font-headline-sm text-headline-sm text-on-surface">Verification In Progress (85% Complete)</h1>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">ማረጋገጫ በሂደት ላይ</span>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Tier 1 Verified • Pending Annual Tax Clearance
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Public Procurement &amp; Property Authority (PPPA) • National Electronic Government Procurement (e-GP) System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-sm shrink-0 self-end lg:self-center">
          <button className="px-3.5 py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-label-md text-label-md transition-colors flex items-center gap-1.5 shadow-sm" type="button">
            <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
            <span>Download Verification Dossier</span>
          </button>
          <button className="px-4 py-2 rounded-xl bg-outline-variant/60 text-on-surface-variant/60 font-label-md text-label-md cursor-not-allowed flex items-center gap-1.5" disabled title="Upload required tax clearance to activate final review" type="button">
            <span className="material-symbols-outlined text-[18px]">lock_clock</span>
            <span>Submit for Final Review</span>
          </button>
        </div>
      </div>
      <div className="w-full bg-surface-container rounded-xl p-space-md flex items-start gap-space-md">
        <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">info</span>
        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <p className="font-body-md text-body-md text-on-surface leading-snug">
            Your profile is certified for <strong className="font-label-lg text-primary">National Competitive Bidding (NCB) up to ETB 100M</strong>. Upload your renewed <strong className="text-on-surface">FY 2016 E.C. Tax Clearance Certificate</strong> to unlock International Competitive Bidding (ICB) and high-value federal infrastructure packages.
          </p>
          <Link className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-md text-label-md shrink-0 font-semibold underline underline-offset-4" href="#tax-clearance-section">
            <span>Resolve Requirement</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
