export function CpoEscrow() {
  return (
    <section className="flex flex-col p-space-md bg-surface-container-lowest rounded-xl shadow-sm gap-space-md">
      <div className="flex items-start justify-between">
        <div className="flex flex-col"><span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Security Escrow</span><h3 className="font-headline-sm text-headline-sm text-on-surface">Digital CPO &amp; Bid Bonds</h3></div>
        <div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[20px]">account_balance</span></div>
      </div>
      <div className="flex flex-col bg-surface-container-low p-space-md rounded-lg gap-1"><span className="font-label-sm text-label-sm text-on-surface-variant">Total Bid Security Held</span><span className="font-headline-lg text-headline-lg font-mono-data text-primary font-bold">ETB 42,850,000</span><span className="font-label-sm text-label-sm text-on-surface-variant">Under FPPA Electronic Escrow Directives</span></div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between font-label-sm text-label-sm"><span className="font-semibold text-on-surface">Commercial Bank of Ethiopia (CBE)</span><span className="font-mono-data text-mono-data font-bold text-primary">88%</span></div>
        <div className="w-full h-2 rounded bg-surface-container overflow-hidden"><div className="h-full bg-primary-container rounded" style={{ width: "88%" }} /></div>
        <div className="flex justify-between font-label-sm text-label-sm pt-1"><span className="text-on-surface-variant">Telebirr SuperApp Portal Integration</span><span className="font-mono-data text-mono-data text-on-surface-variant">12%</span></div>
      </div>
      <div className="flex items-start gap-2 p-space-xs rounded bg-primary-fixed/20 text-on-primary-fixed-variant"><span className="material-symbols-outlined text-[18px] shrink-0 text-primary mt-0.5">verified_user</span><span className="font-body-sm text-body-sm leading-tight">Zero paper CPO risks detected. 100% of tenders secured with real-time National Bank of Ethiopia verified API seals.</span></div>
    </section>
  );
}
