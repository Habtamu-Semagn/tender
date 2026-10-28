export function TendersTable() {
  const rows = [
    { ref: "ERA/NCB/58/2024", title: "Modjo-Adama Expressway Link", cat: "GC-1 Civil Works", km: "• 42.5 km", proc: "NCB Open", budget: "485,200,000.00", deadline: "Tomorrow, 2:00 PM", deadlineSub: "Nov 15, 2024 (EAT)", vault: "12 Sealed (SHA)", stage: "Closing Soon", stageClass: "bg-secondary-fixed/50 text-on-secondary-fixed" },
    { ref: "ERA/ICB/12/2024", title: "Chida-Sodo Road Upgrading Lot 2", cat: "Asphalt Concrete", km: "• AfDB Funded", proc: "ICB Open", budget: "820,000,000.00", deadline: "Nov 18, 2024", deadlineSub: "in 4 days", vault: "8 Sealed (CPO OK)", stage: "Tech Evaluation", stageClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
    { ref: "ERA/NCB/64/2024", title: "Jimma-Agaro Highway Bridge Repair", cat: "Specialized Retrofit", proc: "NCB Open", budget: "145,500,000.00", deadline: "Nov 24, 2024", deadlineSub: "in 10 days", vault: "15 Sealed", stage: "Open (Receiving)", stageClass: "bg-surface-container text-on-surface" },
    { ref: "ERA/NCB/71/2024", title: "Hawassa Bypass Drainage & Culverts", cat: "Drainage Pack 4", proc: "NCB Open", budget: "188,900,000.00", deadline: "Nov 28, 2024", deadlineSub: "in 14 days", vault: "9 Sealed", stage: "Open (Receiving)", stageClass: "bg-surface-container text-on-surface" },
    { ref: "ERA/ICB/05/2024", title: "Nekemte-Bure Road Rehabilitation (Sec 3)", cat: "Major Corridor", km: "• 86 km", proc: "ICB Open", budget: "1,200,000,000.00", deadline: "Dec 05, 2024", deadlineSub: "in 21 days", vault: "6 Sealed", stage: "Award Standstill", stageClass: "bg-primary-fixed text-on-primary-fixed-variant" },
  ];
  return (
    <section className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <div className="p-space-lg flex flex-col gap-space-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Tender Portfolios &amp; Bid Submissions</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">የጨረታዎች ሁኔታ እና የተወዳዳሪዎች ብዛት</span>
          </div>
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none" placeholder="Filter tender reference..." type="text" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-space-xs overflow-x-auto pb-1">
          <button className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">All Active (14)</button>
          <button className="px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm">Open for Bidding (6)</button>
          <button className="px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm">Evaluation Phase (5)</button>
          <button className="px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm">Under Standstill (2)</button>
          <button className="px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm">Awarded (28)</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase">
            <tr>
              <th className="py-3 px-space-md">Tender Reference &amp; Scope</th>
              <th className="py-3 px-space-sm">Procurement</th>
              <th className="py-3 px-space-sm text-right">Budget Ceiling (ETB)</th>
              <th className="py-3 px-space-sm">Closing Deadline</th>
              <th className="py-3 px-space-sm">Vault Status</th>
              <th className="py-3 px-space-sm">Stage</th>
              <th className="py-3 px-space-md text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-body-sm text-body-sm divide-y divide-surface-container">
            {rows.map((r) => (
              <tr key={r.ref} className="hover:bg-surface-container-low/60 transition-colors">
                <td className="py-3 px-space-md">
                  <div className="flex flex-col">
                    <span className="font-mono-data text-mono-data font-semibold text-primary">{r.ref}</span>
                    <span className="font-label-md text-label-md text-on-surface">{r.title}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-label-sm text-label-sm px-1.5 rounded bg-surface-container text-on-surface-variant">{r.cat}</span>
                      {r.km && <span className="font-label-sm text-label-sm text-on-surface-variant">{r.km}</span>}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-space-sm"><span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold">{r.proc}</span></td>
                <td className="py-3 px-space-sm text-right font-mono-data text-mono-data text-on-surface font-semibold">{r.budget}</td>
                <td className="py-3 px-space-sm">
                  <div className="flex flex-col">
                    <span className={`font-label-md text-label-md font-medium ${r.deadline.startsWith("Tomorrow") ? "text-error" : "text-on-surface"} flex items-center gap-1`}>{r.deadline.startsWith("Tomorrow") && <span className="material-symbols-outlined text-[14px]">alarm</span>}{r.deadline}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{r.deadlineSub}</span>
                  </div>
                </td>
                <td className="py-3 px-space-sm"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-fixed/50 text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold"><span className="material-symbols-outlined text-[13px]">lock</span>{r.vault}</span></td>
                <td className="py-3 px-space-sm"><span className={`px-2 py-1 rounded font-label-sm text-label-sm font-semibold ${r.stageClass}`}>{r.stage}</span></td>
                <td className="py-3 px-space-md text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="Open Bid Box" type="button"><span className="material-symbols-outlined text-[18px]">key</span></button>
                    <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="Manage Tender" type="button"><span className="material-symbols-outlined text-[18px]">edit_note</span></button>
                    <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="More Options" type="button"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-space-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm bg-surface-container-low/50">
        <span className="font-body-sm text-body-sm text-on-surface-variant">Showing <strong className="text-on-surface">1 – 5</strong> of <strong className="text-on-surface">14</strong> active procurements</span>
        <div className="flex items-center gap-space-xs">
          <button className="px-space-sm py-1 rounded bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm disabled:opacity-50" disabled>Previous</button>
          <button className="w-7 h-7 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">1</button>
          <button className="w-7 h-7 rounded hover:bg-surface-container text-on-surface font-label-sm text-label-sm">2</button>
          <button className="w-7 h-7 rounded hover:bg-surface-container text-on-surface font-label-sm text-label-sm">3</button>
          <button className="px-space-sm py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-label-sm text-label-sm">Next</button>
        </div>
      </div>
    </section>
  );
}
