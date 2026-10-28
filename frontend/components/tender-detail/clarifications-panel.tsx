export function ClarificationsPanel() {
  const items = [
    { q: "Query #01 • Submitted Nov 04, 2024", title: "Query regarding local bitumen supplier certification vs. import origin requirements" },
    { q: "Query #02 • Submitted Nov 06, 2024", title: "Subcontracting limits for specialized road markings and median drainage works" },
    { q: "Query #03 • Submitted Nov 07, 2024", title: "Clarification on CBE Electronic CPO validation timeframe" },
  ];
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm space-y-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Official Clarifications &amp; Inquiries</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Responses form a binding and integral part of the Bidding Document</p>
        </div>
        <div className="px-space-md py-1.5 bg-surface-container text-on-surface-variant rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 self-start">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>Clarification Period Closed on Nov 08</span>
        </div>
      </div>
      <div className="space-y-space-md">
        {items.map((item) => (
          <div key={item.q} className="bg-surface-container-low rounded-xl p-space-lg space-y-space-md">
            <div className="space-y-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-label-sm text-on-surface-variant font-semibold">{item.q}</span>
                <span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-[11px] font-semibold">Official Answer</span>
              </div>
              <h3 className="font-label-lg text-label-lg text-on-surface font-semibold">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
