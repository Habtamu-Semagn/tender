export function IssuerKpiCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
      <div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col"><span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Active Tenders / ንቁ ጨረታዎች</span><span className="font-display-lg text-display-lg text-on-surface mt-1">14</span></div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[22px]">assignment</span></div>
        </div>
        <div className="flex items-center justify-between mt-space-md pt-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg"><span className="font-mono-data text-mono-data text-on-surface">Total: ETB 1.84B</span><span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-secondary-fixed/50 text-on-secondary-fixed font-semibold">8 Closing &lt; 14d</span></div>
      </div>
      <div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col"><span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Bids Received / የገቡ ጨረታዎች</span><span className="font-display-lg text-display-lg text-on-surface mt-1">86</span></div>
          <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary-container"><span className="material-symbols-outlined text-[22px]">lock</span></div>
        </div>
        <div className="flex items-center justify-between mt-space-md pt-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg"><span className="font-label-sm text-label-sm text-on-surface-variant">SHA-256 HSM Encrypted</span><span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-semibold">+18 this week</span></div>
      </div>
      <div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col"><span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">In Evaluation / በግምገማ ላይ</span><span className="font-display-lg text-display-lg text-tertiary-container mt-1">5</span></div>
          <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/60 flex items-center justify-center text-tertiary"><span className="material-symbols-outlined text-[22px]">balance</span></div>
        </div>
        <div className="flex items-center justify-between mt-space-md pt-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg"><span className="font-label-sm text-label-sm text-on-surface-variant">3 Tech, 2 Financial</span><span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-semibold">Action on 2</span></div>
      </div>
      <div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col"><span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Awarded &amp; Signed / የተሰጡ ውሎች</span><span className="font-display-lg text-display-lg text-primary mt-1">28</span></div>
          <div className="w-10 h-10 rounded-xl bg-primary-fixed/50 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[22px]">verified</span></div>
        </div>
        <div className="flex items-center justify-between mt-space-md pt-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg"><span className="font-mono-data text-mono-data text-on-surface">ETB 4.2B Executed</span><span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-semibold">100% CPO OK</span></div>
      </div>
    </section>
  );
}
