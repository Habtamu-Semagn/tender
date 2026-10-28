export function FooterActions() {
  return (
    <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-primary">sync</span>
        <span className="font-body-sm text-body-sm">Last synchronized with Ministry of Revenues registry: <strong>Today at 08:30 AM EAT</strong></span>
      </div>
      <div className="flex items-center gap-space-sm">
        <button className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-1.5 shadow-sm" type="button">
          <span className="material-symbols-outlined text-[18px]">print</span>
          <span>Export PPA Compliance Dossier (PDF)</span>
        </button>
        <button className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-sm" type="button">
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
