export function MyBidsPageHeader() {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-sm">
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">My Bids</h1>
            <span className="font-headline-md text-headline-md text-primary font-normal">| የእኔ ጨረታዎች</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono-data text-label-sm font-semibold">e-GP Portal Live</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">
            Manage your electronic bid submissions, monitor real-time agency evaluations, and track digital CPO escrow statuses under the FDRE Public Procurement Regulatory Authority guidelines.
          </p>
        </div>
        <div className="flex items-center gap-space-md shrink-0">
          <button className="h-10 px-4 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-lg text-label-lg transition-colors flex items-center gap-2 shadow-sm" type="button">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">download</span>
            <span>Export Dossier (CSV/PDF)</span>
          </button>
          <button className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all flex items-center gap-2 shadow-md" type="button">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Prepare New Bid Proposal</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Total Submissions • አጠቃላይ ጨረታዎች</span>
              <div className="flex items-baseline gap-2 mt-1"><span className="font-display-lg text-display-lg font-bold text-on-surface font-mono-data">19</span><span className="font-label-sm text-label-sm text-primary font-semibold">Active Cycle</span></div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[22px]">assignment_turned_in</span></div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg"><span className="font-body-sm text-body-sm text-on-surface-variant">Total Pipeline Volume:</span><span className="font-mono-data text-body-sm font-semibold text-on-surface">ETB 482.5M</span></div>
        </div>
        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Under Evaluation • በግምገማ ላይ</span>
              <div className="flex items-baseline gap-2 mt-1"><span className="font-display-lg text-display-lg font-bold text-secondary font-mono-data">4</span><span className="font-label-sm text-label-sm text-secondary-container bg-on-surface px-1.5 py-0.5 rounded font-bold">2 Opening Soon</span></div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed/30 flex items-center justify-center text-secondary"><span className="material-symbols-outlined text-[22px]">analytics</span></div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg"><span className="font-body-sm text-body-sm text-on-surface-variant">Next Evaluation Phase:</span><span className="font-mono-data text-body-sm font-semibold text-secondary">Nov 14, 2:30 PM</span></div>
        </div>
        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Awarded &amp; Won • የተሸነፉ/ያሸነፉ</span>
              <div className="flex items-baseline gap-2 mt-1"><span className="font-display-lg text-display-lg font-bold text-primary font-mono-data">12</span><span className="font-label-sm text-label-sm text-primary font-medium">63% Win Rate</span></div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[22px]">workspace_premium</span></div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg"><span className="font-body-sm text-body-sm text-on-surface-variant">Executed Contracts:</span><span className="font-mono-data text-body-sm font-semibold text-primary">ETB 640.0M</span></div>
        </div>
        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Digital CPO Escrow • ሲፒኦ ዋስትና</span>
              <div className="flex items-baseline gap-2 mt-1"><span className="font-display-lg text-display-lg font-bold text-on-surface font-mono-data">3.75M</span><span className="font-label-sm text-label-sm text-on-surface-variant font-mono-data">ETB</span></div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[22px]">lock</span></div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /><span className="font-body-sm text-body-sm text-on-surface-variant">CBE &amp; Telebirr Locked</span></div>
            <span className="font-mono-data text-body-sm font-semibold text-primary">100% Secured</span>
          </div>
        </div>
      </div>
    </>
  );
}
