export function CompetitionChart() {
  const rows = [
    { label: "ERA/NCB/58/2024 • Modjo-Adama Expressway Link (Civil Works)", bids: "12 Bids", note: "(High Competition)", width: "80%", color: "bg-primary-container" },
    { label: "ERA/ICB/12/2024 • Chida-Sodo Road Upgrading Lot 2 (Asphalt Concrete)", bids: "8 Bids", note: "(Qualified)", width: "53.3%", color: "bg-primary" },
    { label: "ERA/NCB/64/2024 • Jimma-Agaro Highway Bridge Repair & Retrofitting", bids: "15 Bids", note: "(Peak Volume)", width: "100%", color: "bg-primary-container" },
    { label: "ERA/NCB/71/2024 • Hawassa Bypass Drainage & Culverts Package 4", bids: "9 Bids", note: "(Optimal)", width: "60%", color: "bg-primary" },
    { label: "ERA/ICB/05/2024 • Nekemte-Bure Road Rehabilitation (Section 3)", bids: "6 Bids", note: "(International)", width: "40%", color: "bg-surface-tint" },
  ];
  return (
    <section className="flex flex-col p-space-lg bg-surface-container-lowest rounded-xl shadow-sm gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm">
        <div>
          <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Competition Metrics / የውድድር ምጣኔ</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Bids Received per Tender / በጨረታ የገቡ አቅርቦቶች ንፅፅር</h2>
        </div>
        <div className="flex items-center gap-space-xs">
          <span className="px-space-sm py-1 bg-surface-container text-on-surface-variant rounded-lg font-label-sm text-label-sm">2016 E.C.</span>
          <span className="px-space-sm py-1 bg-primary-fixed/50 text-on-primary-fixed-variant rounded-lg font-label-sm text-label-sm font-semibold">All Categories (NCB/ICB)</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-space-sm bg-surface-container-low p-space-sm rounded-lg">
        <div className="flex flex-col"><span className="font-label-sm text-label-sm text-on-surface-variant">Tender Competition Avg</span><span className="font-headline-sm text-headline-sm text-primary">9.4 <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">Bids / Notice</span></span></div>
        <div className="flex flex-col"><span className="font-label-sm text-label-sm text-on-surface-variant">Total Vault Envelopes</span><span className="font-headline-sm text-headline-sm text-on-surface">86 <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">Sealed</span></span></div>
        <div className="flex flex-col"><span className="font-label-sm text-label-sm text-on-surface-variant">Min. Statutory Threshold</span><span className="font-headline-sm text-headline-sm text-on-surface-variant">≥ 3 <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">Valid Offers</span></span></div>
      </div>
      <div className="w-full flex flex-col gap-space-sm pt-space-xs">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-on-surface">
              <span className="font-label-md text-label-md truncate max-w-md">{r.label}</span>
              <span className="font-mono-data text-mono-data font-semibold text-primary">{r.bids} <span className="text-on-surface-variant text-[11px]">{r.note}</span></span>
            </div>
            <div className="w-full h-5 bg-surface-container rounded flex overflow-hidden"><div className={`h-full rounded ${r.color}`} style={{ width: r.width }} /></div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-space-xs">
        <div className="flex items-center gap-space-md"><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary-container inline-block" /> NCB Works</span><span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-surface-tint inline-block" /> ICB International</span></div>
        <span>Minimum FPPA Quorum Threshold: 3 Responsive Bids</span>
      </div>
    </section>
  );
}
