export function MobileCards() {
  return (
    <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">smartphone</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Mobile Bidder Cards Preview</h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant">(Responsive Fallback Layout)</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-surface-container font-mono-data text-label-sm text-on-surface">Adaptive Viewport</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-low shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono-data text-label-sm font-semibold">ERA/NCB/58/2024</span>
              <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mt-1">Modjo-Adama Expressway Link Package II</h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Ethiopian Roads Administration</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary font-label-sm font-bold text-nowrap">Technical Eval</span>
          </div>
          <div className="grid grid-cols-2 gap-2 py-2 bg-surface-container-lowest p-2 rounded-lg">
            <div><span className="font-label-sm text-[11px] text-on-surface-variant block">Bid Value</span><span className="font-mono-data text-body-sm font-bold text-on-surface">ETB 142.8M</span></div>
            <div><span className="font-label-sm text-[11px] text-on-surface-variant block">CPO Status</span><span className="font-mono-data text-body-sm font-bold text-primary">CBE 500k Locked</span></div>
          </div>
          <div className="flex items-center justify-between pt-1"><span className="font-label-sm text-[11px] text-on-surface-variant">Submitted Nov 12, 10:45 AM</span><button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1 shadow-sm" type="button"><span>Timeline</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></button></div>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono-data text-label-sm font-semibold">AACRA/NCB/12/2024</span>
              <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mt-1">Smart Corridor Fiber Duct Installation</h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">AACRA Addis Ababa</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm font-bold text-nowrap">Won &amp; Awarded</span>
          </div>
          <div className="grid grid-cols-2 gap-2 py-2 bg-surface-container-lowest p-2 rounded-lg">
            <div><span className="font-label-sm text-[11px] text-on-surface-variant block">Award Value</span><span className="font-mono-data text-body-sm font-bold text-primary">ETB 215.6M</span></div>
            <div><span className="font-label-sm text-[11px] text-on-surface-variant block">Contract Status</span><span className="font-mono-data text-body-sm font-bold text-on-surface">Countersigned</span></div>
          </div>
          <div className="flex items-center justify-between pt-1"><span className="font-label-sm text-[11px] text-on-surface-variant">Awarded Oct 28, 2024</span><button className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md flex items-center gap-1" type="button"><span>View Contract</span><span className="material-symbols-outlined text-[16px]">description</span></button></div>
        </div>
      </div>
    </div>
  );
}
