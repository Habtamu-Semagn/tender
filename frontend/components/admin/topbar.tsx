export function AdminTopbar() {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg">
      <div className="flex items-center gap-space-lg flex-1 max-w-xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-lg bg-surface-container-high text-primary font-label-sm text-label-sm shrink-0"><span className="material-symbols-outlined text-[16px]">verified</span><span>FPPA SYS-ADMIN</span></div>
        <div className="relative w-full"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span><input className="w-full h-10 pl-9 pr-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline outline-none focus:bg-surface-container-lowest transition-all" placeholder="Search tenders, TIN, CPO references, bidder records (ፈልግ)..." type="text" /></div>
      </div>
      <div className="flex items-center gap-space-lg">
        <div className="hidden xl:flex items-center gap-space-xs font-mono-data text-mono-data text-on-surface-variant bg-surface-container-low px-space-md py-1.5 rounded-lg"><span className="material-symbols-outlined text-[16px] text-primary">schedule</span><span>Addis Ababa (EAT) 14:32:08</span></div>
        <div className="inline-flex p-0.5 rounded-xl bg-surface-container-low font-label-sm text-label-sm"><button className="px-space-sm py-1 rounded-lg bg-surface-container-lowest text-primary font-semibold shadow-sm" type="button">EN</button><button className="px-space-sm py-1 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors" type="button">አማ</button></div>
        <button className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" title="System Infrastructure Health: Operational" type="button"><span className="material-symbols-outlined text-[20px]">health_metrics</span><span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest" /></button>
        <div className="flex items-center gap-space-md pl-space-sm"><div className="flex flex-col text-right min-w-0 hidden md:flex"><span className="font-label-md text-label-md text-on-surface truncate leading-tight">Ato Yohannes Girma</span><span className="font-label-sm text-label-sm text-on-surface-variant truncate">Lead System Administrator</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div>
      </div>
    </header>
  );
}
