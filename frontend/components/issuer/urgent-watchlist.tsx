export function UrgentWatchlist() {
  return (
    <section className="flex flex-col p-space-md bg-surface-container-lowest rounded-xl shadow-sm gap-space-md">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-error text-[20px]">emergency_home</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Urgent Watchlist</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">3 Critical</span>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant -mt-space-xs">የሚደርሱ የጨረታ ቀነ-ገደቦች እና ማስጠንቀቂያዎች</span>
      <div className="flex flex-col gap-space-sm">
        <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low gap-space-xs">
          <div className="flex items-center justify-between"><span className="font-mono-data text-mono-data text-primary font-bold">ERA/NCB/58/2024</span><span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-error text-on-error font-mono-data text-[11px] font-bold"><span className="material-symbols-outlined text-[12px]">timer</span> 18h 24m</span></div>
          <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">Modjo-Adama Expressway Link</span>
          <div className="text-on-surface-variant font-body-sm text-body-sm leading-snug">Bid submission cutoff tomorrow at 2:00 PM EAT. Public decryption ceremony scheduled for 2:30 PM.</div>
          <div className="pt-space-xs flex items-center justify-between"><span className="font-label-sm text-label-sm text-primary font-semibold">12 Bids Ready</span><button className="px-space-sm py-1 rounded bg-primary-container text-on-primary hover:bg-primary font-label-sm text-label-sm font-semibold transition-colors">Prepare Opening Session</button></div>
        </div>
        <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low gap-space-xs">
          <div className="flex items-center justify-between"><span className="font-mono-data text-mono-data text-secondary font-bold">ERA/NCB/64/2024</span><span className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono-data text-[11px] font-bold">In 2 Days</span></div>
          <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">Jimma-Agaro Highway Retrofit</span>
          <div className="text-on-surface-variant font-body-sm text-body-sm leading-snug">Clarification Request Deadline approaching (Nov 16). 3 contractor queries awaiting response from ERA engineers.</div>
          <div className="pt-space-xs flex items-center justify-between"><span className="font-label-sm text-label-sm text-error font-semibold">3 Pending Queries</span><button className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold transition-colors">Answer Queries (3)</button></div>
        </div>
        <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low gap-space-xs">
          <div className="flex items-center justify-between"><span className="font-mono-data text-mono-data text-on-surface-variant font-bold">ERA/ICB/12/2024</span><span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono-data text-[11px]">Nov 18</span></div>
          <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">Chida-Sodo Road Upgrading Lot 2</span>
          <div className="text-on-surface-variant font-body-sm text-body-sm leading-snug">Technical Evaluation Report sign-off milestone. 4 of 5 committee members have signed digital approvals.</div>
          <div className="pt-space-xs flex items-center justify-between"><span className="font-label-sm text-label-sm text-on-surface-variant">Pending 1 Signer</span><button className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold transition-colors">View Signatures</button></div>
        </div>
      </div>
    </section>
  );
}
