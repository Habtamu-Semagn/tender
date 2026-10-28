export function TenderSummary() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-xl mb-space-lg shadow-sm">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-space-lg">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-space-xs mb-space-xs">
            <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider text-primary bg-primary-fixed/60 px-space-xs py-0.5 rounded">NCB Civil Works • Grade GC-1 / RC-1</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Tender Ref: <strong className="font-mono-data text-on-surface">ERA/NCB/58/2024</strong></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">• Client: Ethiopian Roads Administration (ERA)</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-snug">Construction of Semera-Afdera Asphalt Concrete Road Rehabilitation Project (Lot 3, 54.2 km)</h1>
          <p className="font-headline-sm text-headline-sm text-on-surface-variant mt-1">የሰመራ-አፍደራ አስፋልት ኮንክሪት መንገድ ማደስ ፕሮጀክት (ምድብ 3 • 54.2 ኪ.ሜ)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md mt-space-lg">
            <div className="p-space-sm bg-surface-container-low rounded-xl"><span className="font-label-sm text-label-sm text-on-surface-variant block">Approved Budget Ceiling</span><span className="font-headline-sm text-headline-sm text-on-surface font-bold">ETB 485,200,000.00</span><span className="font-label-sm text-label-sm text-on-surface-variant block mt-0.5">የተፈቀደው ከፍተኛ በጀት</span></div>
            <div className="p-space-sm bg-surface-container-low rounded-xl"><span className="font-label-sm text-label-sm text-on-surface-variant block">Bid Security Required (CPO)</span><span className="font-headline-sm text-headline-sm text-on-surface font-bold">ETB 500,000.00</span><span className="font-label-sm text-label-sm text-primary block mt-0.5">5/5 Bank Escrow Verified</span></div>
            <div className="p-space-sm bg-surface-container-low rounded-xl"><span className="font-label-sm text-label-sm text-on-surface-variant block">Technical Evaluation Gate</span><span className="font-headline-sm text-headline-sm text-primary font-bold">75.0 / 100 pts</span><span className="font-label-sm text-label-sm text-on-surface-variant block mt-0.5">Minimum Pass Threshold</span></div>
            <div className="p-space-sm bg-surface-container-low rounded-xl"><span className="font-label-sm text-label-sm text-on-surface-variant block">Current Process Stage</span><div className="flex items-center gap-space-xs mt-0.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary" /><span className="font-label-md text-label-md text-on-surface font-bold">Combined Stage 2</span></div><span className="font-label-sm text-label-sm text-on-surface-variant block">ደረጃ 2: ጥምር የውጤት ግምገማ</span></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row xl:flex-col gap-space-sm shrink-0">
          <button className="h-10 px-space-md bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-space-xs shadow-sm transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">verified</span><span>Committee Sign-Off Portal</span></button>
          <button className="h-10 px-space-md bg-surface-container-low hover:bg-surface-container text-primary font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-space-xs transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">file_download</span><span>Export Summary (PDF/Excel)</span></button>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm px-space-xs"><span className="material-symbols-outlined text-[16px] text-primary">lock_clock</span><span>Evaluation locked after quorum sign</span></div>
        </div>
      </div>
      <div className="mt-space-lg p-space-md bg-surface-container-low/70 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-secondary text-[20px]">calculate</span><div className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold text-primary">FPPA Formula Directive:</span> Combined Score = (Technical Score × 0.70) + [(F<sub>lowest</sub> ÷ F<sub>bid</sub>) × 30.00]</div></div>
        <div className="flex items-center gap-space-xs"><span className="font-label-sm text-label-sm text-on-surface-variant">Review Mode:</span><span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">Double-Blind Complete • Envelopes Unsealed</span></div>
      </div>
    </div>
  );
}
