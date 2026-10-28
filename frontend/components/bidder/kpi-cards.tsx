export function KpiCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Active Bids (በግምገማ ላይ)</span>
            <span className="font-display-lg text-display-lg text-on-surface leading-tight font-bold">4</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[22px]">pending_actions</span></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-body-sm font-body-sm"><span className="text-on-surface-variant">Pipeline Volume:</span><span className="font-mono-data font-semibold text-primary">ETB 284,500,000</span></div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm"><span className="material-symbols-outlined text-[14px]">event_upcoming</span>2 Opening this week</span>
            <span className="inline-flex items-center text-primary font-mono-data text-body-sm"><span className="material-symbols-outlined text-[16px]">trending_up</span> +12%</span>
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Bids Won (ያሸነፍናቸው)</span>
            <span className="font-display-lg text-display-lg text-primary leading-tight font-bold">12</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary"><span className="material-symbols-outlined text-[22px]">trophy</span></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-body-sm font-body-sm"><span className="text-on-surface-variant">Contract FY2024:</span><span className="font-mono-data font-semibold text-on-surface">ETB 640.0M</span></div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm"><span className="material-symbols-outlined text-[14px]">check_circle</span>100% CPO Released</span>
            <span className="font-mono-data text-label-sm text-on-surface-variant">96% Execution</span>
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Technical Review (ቴክኒካል ግምገማ)</span>
            <span className="font-display-lg text-display-lg text-on-surface leading-tight font-bold">3</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface"><span className="material-symbols-outlined text-[22px]">flaky</span></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-body-sm font-body-sm"><span className="text-on-surface-variant">Avg Turnaround:</span><span className="font-mono-data font-semibold text-on-surface">14 Days</span></div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm"><span className="material-symbols-outlined text-[14px]">mark_email_read</span>Clarifications answered</span>
            <span className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Saved Tenders (የተመረጡ)</span>
            <span className="font-display-lg text-display-lg text-on-surface leading-tight font-bold">18</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary"><span className="material-symbols-outlined text-[22px]">bookmarks</span></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-body-sm font-body-sm"><span className="text-error font-medium">Closing in &lt; 48h:</span><span className="font-mono-data font-semibold text-error">5 Opportunities</span></div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-tertiary font-label-sm text-label-sm"><span className="material-symbols-outlined text-[14px]">notifications_active</span>Instant alerts on</span>
            <span className="font-mono-data text-label-sm text-on-surface-variant">Auto-sync</span>
          </div>
        </div>
      </div>
    </section>
  );
}
