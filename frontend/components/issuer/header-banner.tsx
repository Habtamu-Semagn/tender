export function IssuerHeaderBanner() {
  return (
    <section className="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs max-w-4xl">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-lg bg-primary-fixed/40 text-on-primary-fixed-variant font-label-sm text-label-sm"><span className="material-symbols-outlined text-[14px]">assured_workload</span>ETH-ERA-0012 • 2016/2017 E.C.</span>
            <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-lg bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm"><span className="w-2 h-2 rounded-full bg-primary-container" />FPPA Tier-1 Verified Portal</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Procurement Issuer Dashboard <span className="font-normal text-on-surface-variant">| የአወዳዳሪ መቆጣጠሪያ</span></h1>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Manage published procurement notices, monitor tamper-evident digital bid submissions, track evaluation committee milestones, and oversee contract awards under FDRE Public Procurement Directives.</p>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          <button className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-colors shadow-xs" type="button"><span className="material-symbols-outlined text-[18px]">file_download</span>Export Report</button>
          <button className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-colors shadow-xs" type="button"><span className="material-symbols-outlined text-[18px]">key</span>Decryption Portal</button>
          <button className="inline-flex items-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg transition-colors shadow-md" type="button"><span className="material-symbols-outlined text-[20px]">add_circle</span>+ Create New Tender / አዲስ ጨረታ አውጣ</button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-sm bg-surface-container-low px-space-md py-space-xs rounded-lg">
        <div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-primary text-[20px]">corporate_fare</span><span className="font-label-md text-label-md text-on-surface">Procuring Entity: <strong className="font-semibold">Ethiopian Roads Administration (ERA / የኢትዮጵያ መንገዶች አስተዳደር)</strong></span></div>
        <div className="flex items-center gap-space-lg text-on-surface-variant font-label-sm text-label-sm"><span>Directorate: Engineering Procurement &amp; Contracts</span><span>•</span><span>Lead Officer: Ato Dawit Bekele</span><span>•</span><span className="text-primary font-mono-data text-mono-data">System Status: Nominal (Live E-GP Sync)</span></div>
      </div>
    </section>
  );
}
