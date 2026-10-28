export function WinningBidderCard() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary-container" />
      <div className="flex items-start justify-between gap-space-md mb-space-md pt-space-xs">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary shadow-xs"><span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span></div>
          <div>
            <div className="flex items-center gap-space-xs"><span className="font-label-sm text-label-sm bg-primary-fixed/50 text-primary font-bold px-2 py-0.5 rounded">Awardee Selected / አሸናፊ ተጫራች</span><span className="font-mono-data text-mono-data text-on-surface-variant">Rank 1</span></div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight mt-0.5">Afro-Tsion Construction Plc</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">አፍሮ-ጽዮን ኮንስትራክሽን ኃላፊነቱ የተወሰነ የግል ማህበር</p>
          </div>
        </div>
        <div className="text-right shrink-0"><span className="font-label-sm text-label-sm text-on-surface-variant block uppercase font-bold">Grade License</span><span className="font-label-lg text-label-lg font-bold text-primary bg-primary-fixed/30 px-space-sm py-1 rounded inline-block mt-0.5">GC-1 Certified</span></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm p-space-md bg-surface-container-low rounded-xl mb-space-md font-mono-data text-mono-data">
        <div><span className="text-on-surface-variant text-[11px] uppercase block">MOTRI Registration</span><span className="font-semibold text-on-surface">MOTRI/AA/14/008271/2016</span></div>
        <div><span className="text-on-surface-variant text-[11px] uppercase block">Taxpayer ID (TIN)</span><span className="font-semibold text-on-surface">0049281745 • Tax Compliant (ERA Verified)</span></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">Evaluated Award Value (Inc. 15% VAT)</span>
          <div className="mt-space-xs"><span className="font-headline-lg text-headline-lg font-bold text-primary font-mono-data">ETB 466,750,000.00</span><div className="flex items-center gap-1.5 mt-1 text-on-surface font-body-sm text-body-sm"><span className="material-symbols-outlined text-[16px] text-primary">trending_down</span><span>3.8% below ERA ceiling (Saved <strong className="text-primary font-mono-data">ETB 18,450,000.00</strong>)</span></div></div>
        </div>
        <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">Bid Security &amp; Guarantee Transition</span>
          <div className="mt-space-xs">
            <div className="font-body-md text-body-md font-semibold text-on-surface flex items-center justify-between"><span>CPO in Escrow:</span><span className="font-mono-data text-primary">ETB 500,000.00</span></div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Commercial Bank of Ethiopia (CBE) Gurshoro Branch. Conversion to 10% Performance Bond (<strong className="font-mono-data text-on-surface">ETB 46,675,000.00</strong>) due in 15 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
