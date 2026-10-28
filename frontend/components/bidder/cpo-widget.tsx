import Link from "next/link";

export function CpoWidget() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">account_balance</span>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Digital CPO &amp; Bid Bond</h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant">የጨረታ ዋስትና ሂሳብ አስተዳደር</span>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-primary-container" />
      </div>
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Total Active CPO Escrow</span>
        <div className="flex items-baseline justify-between">
          <span className="font-display-lg text-display-lg text-primary font-bold font-mono-data">ETB 3,750,000</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">4 Bids Secured</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Encrypted hold backed by <strong className="text-on-surface">Commercial Bank of Ethiopia (CBE)</strong> &amp; <strong className="text-on-surface">Telebirr e-Escrow</strong>.</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-surface-container"><span className="font-mono-data text-headline-sm font-bold text-on-surface block">4</span><span className="font-label-sm text-label-sm text-on-surface-variant">Active Holds</span></div>
        <div className="p-2 rounded-lg bg-surface-container"><span className="font-mono-data text-headline-sm font-bold text-secondary block">1</span><span className="font-label-sm text-label-sm text-on-surface-variant">Pending Rel.</span></div>
        <div className="p-2 rounded-lg bg-surface-container"><span className="font-mono-data text-headline-sm font-bold text-primary block">2</span><span className="font-label-sm text-label-sm text-on-surface-variant">Released (Mo)</span></div>
      </div>
      <Link className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-variant text-primary font-label-md text-label-md transition-colors text-center font-semibold" href="#"><span className="material-symbols-outlined text-[18px]">verified</span><span>Request CPO Release / Certificate</span></Link>
    </section>
  );
}
