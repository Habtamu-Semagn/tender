export function IssuerTopbar() {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="w-full h-full px-space-xl flex items-center justify-between gap-space-lg">
        <div className="flex items-center gap-space-lg min-w-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">Ethiopian Roads Administration (ERA)</span>
              <span className="font-label-sm text-label-sm text-primary bg-primary-fixed/50 px-space-xs rounded">Public Body #042</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant truncate">የኢትዮጵያ መንገዶች አስተዳደር • Tender Issuing Directorate</span>
          </div>
          <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-low rounded-xl">
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">schedule</span>
            <span className="font-mono-data text-mono-data text-on-surface-variant">Addis Ababa (EAT): 14:48:22</span>
          </div>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="relative hidden md:block w-72">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input className="w-full h-10 pl-9 pr-space-md bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm rounded-xl focus:outline-none focus:bg-surface-container-lowest shadow-[0_1px_2px_rgba(0,0,0,0.03)]" placeholder="Search tenders, bids, ref #... / ፈልግ..." type="text" />
          </div>
          <div className="flex items-center bg-surface-container-low p-space-xs rounded-xl">
            <button className="px-space-sm py-space-xs rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold shadow-xs" type="button">EN</button>
            <button className="px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors" type="button">አማ</button>
          </div>
          <button className="relative p-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span className="material-symbols-outlined text-[20px]">notifications</span><span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error" /></button>
          <div className="h-8 w-px bg-surface-container-high" />
          <div className="flex items-center gap-space-sm">
            <div className="flex flex-col text-right hidden sm:flex"><span className="font-label-md text-label-md text-on-surface font-semibold">Ato Dawit Bekele</span><span className="font-label-sm text-label-sm text-on-surface-variant">Procuring Director, ERA</span></div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div>
          </div>
        </div>
      </div>
    </header>
  );
}
