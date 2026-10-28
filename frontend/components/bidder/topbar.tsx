export function BidderTopbar() {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] px-space-lg flex items-center justify-between gap-space-lg">
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">search</span>
          <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-xl outline-none placeholder:text-outline focus:ring-2 focus:ring-primary/20" placeholder="Search my tenders, reference codes, addenda..." type="text" />
        </div>
      </div>
      <div className="flex items-center gap-space-md">
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-xl text-on-surface font-mono-data text-body-sm">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">schedule</span>
          <span>Addis Ababa EAT 10:45 AM</span>
        </div>
        <button className="flex items-center px-3 py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors" type="button">
          <span className="font-bold">EN</span>
          <span className="mx-1 text-outline">|</span>
          <span className="text-on-surface-variant">አማ</span>
        </button>
        <div className="relative">
          <button className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-variant flex items-center justify-center transition-colors text-on-surface" type="button">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-error text-on-error font-mono-data text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
        </div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden md:block">
            <div className="font-label-lg text-label-lg text-on-surface leading-tight">Afro-Tsion Constr. Plc</div>
            <div className="font-mono-data text-label-sm text-on-surface-variant leading-none">TIN: 0049281745</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] cursor-pointer">keyboard_arrow_down</span>
        </div>
      </div>
    </header>
  );
}
