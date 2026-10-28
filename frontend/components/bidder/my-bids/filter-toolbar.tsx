export function FilterToolbar() {
  return (
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-nowrap">
        <button className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-2 shadow-sm" type="button"><span>All Bids (ሁሉም)</span><span className="px-1.5 py-0.2 rounded-full bg-on-primary/20 text-on-primary font-mono-data text-[11px]">19</span></button>
        <button className="px-3.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-2 transition-colors" type="button"><span>Drafts (ረቂቅ)</span><span className="px-1.5 py-0.2 rounded-full bg-surface-variant text-on-surface font-mono-data text-[11px]">3</span></button>
        <button className="px-3.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-2 transition-colors" type="button"><span>Submitted (የገቡ)</span><span className="px-1.5 py-0.2 rounded-full bg-surface-variant text-on-surface font-mono-data text-[11px]">2</span></button>
        <button className="px-3.5 py-1.5 rounded-lg bg-secondary-fixed/30 text-secondary font-label-md text-label-md flex items-center gap-2 font-semibold" type="button"><span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" /><span>Under Evaluation (በግምገማ)</span><span className="px-1.5 py-0.2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono-data text-[11px]">4</span></button>
        <button className="px-3.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-2 transition-colors" type="button"><span>Awarded / Won (ያሸነፉ)</span><span className="px-1.5 py-0.2 rounded-full bg-primary-fixed text-on-primary-fixed font-mono-data text-[11px]">12</span></button>
        <button className="px-3.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-2 transition-colors" type="button"><span>Lost (ያልተሳኩ)</span><span className="px-1.5 py-0.2 rounded-full bg-surface-variant text-on-surface font-mono-data text-[11px]">2</span></button>
        <button className="px-3.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-2 transition-colors" type="button"><span>Withdrawn (የተሰረዙ)</span><span className="px-1.5 py-0.2 rounded-full bg-surface-variant text-on-surface font-mono-data text-[11px]">1</span></button>
      </div>
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-sm pt-2">
        <div className="flex-1 max-w-xl relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">search</span>
          <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-xl outline-none placeholder:text-outline focus:ring-2 focus:ring-primary/20" placeholder="Search by tender title, reference number, or procuring entity..." type="text" />
        </div>
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="relative">
            <select className="h-10 pl-3 pr-8 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md outline-none appearance-none cursor-pointer"><option>Fiscal Year: 2016 E.C. (2024 G.C.)</option><option>Fiscal Year: 2015 E.C. (2023 G.C.)</option><option>All Procurement Years</option></select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant text-[18px] pointer-events-none">arrow_drop_down</span>
          </div>
          <div className="relative">
            <select className="h-10 pl-3 pr-8 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md outline-none appearance-none cursor-pointer"><option>Agency: All Entities (ERA, EEP, EthioTel...)</option><option>Ethiopian Roads Administration (ERA)</option><option>Ethio Telecom</option><option>Ethiopian Electric Power (EEP)</option><option>AACRA Addis Ababa</option></select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant text-[18px] pointer-events-none">arrow_drop_down</span>
          </div>
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
            <button className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs" title="Table View" type="button"><span className="material-symbols-outlined text-[18px]">table_rows</span></button>
            <button className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors" title="Mobile / Card View" type="button"><span className="material-symbols-outlined text-[18px]">grid_view</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}
