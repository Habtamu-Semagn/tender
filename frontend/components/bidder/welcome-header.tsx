import Link from "next/link";

export function WelcomeHeader() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">Welcome back, Afro-Tsion Construction Plc</h1>
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">/ እንኳን ደህና መጡ</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Federal PPA Certified • GC-1 Grade
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            National Electronic Government Procurement (e-GP) Bidder Portal • Taxpayer ID: <span className="font-mono-data">0049281745</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          <Link className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high text-primary hover:bg-surface-variant transition-colors font-label-lg text-label-lg" href="#">
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            <span>Submit CPO Guarantee</span>
          </Link>
          <Link className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container shadow-sm transition-all font-label-lg text-label-lg" href="#">
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Browse New Tenders</span>
            <span className="font-label-sm text-label-sm opacity-80">(ጨረታዎችን ፈልግ)</span>
          </Link>
        </div>
      </div>
      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-start md:items-center gap-space-md flex-1">
          <div className="w-10 h-10 rounded-xl bg-secondary-container/30 text-tertiary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-label-lg text-label-lg text-on-surface">Profile Verification: <strong className="text-primary font-bold">85% Completed</strong></span>
              <span className="font-mono-data text-body-sm text-on-surface-variant">Tier 1 Threshold Lock</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-2 rounded-full transition-all duration-700" style={{ width: "85%" }} />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              <span className="font-semibold text-tertiary">Action Needed:</span> 1 pending document required (<span className="font-medium text-on-surface">Annual Tax Clearance Certificate FY 2016 E.C.</span>) to unlock International Competitive Bidding (ICB) tenders &gt; ETB 100M.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors" type="button">
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Upload &amp; Verify Now</span>
          </button>
        </div>
      </div>
    </section>
  );
}
