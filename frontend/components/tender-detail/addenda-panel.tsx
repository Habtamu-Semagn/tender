export function AddendaPanel() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm space-y-space-lg">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Addenda &amp; Formal Corrigenda</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Formal contract amendments issued under PPA procurement regulations</p>
      </div>
      <div className="bg-surface-container-low rounded-xl p-space-lg space-y-space-md">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-label-sm font-mono-data">01</span>
            <div>
              <h3 className="font-label-lg text-label-lg text-on-surface font-bold">Addendum No. 1: Amendment to BoQ Item 4.02 &amp; Rapid Curing Tack Coat Rates</h3>
              <div className="font-body-sm text-body-sm text-on-surface-variant font-mono-data">Issued: Nov 10, 2024 • Ref: ERA/NCB/58/2024-ADD-01</div>
            </div>
          </div>
          <span className="px-space-sm py-1 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">Active Revision</span>
        </div>
        <div className="bg-surface-container-lowest p-space-md rounded-lg space-y-space-xs font-body-sm text-body-sm text-on-surface">
          <p className="font-semibold text-on-surface">Summary of Modification:</p>
          <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
            <li>BoQ Item 4.02 (Tack Coat Application): Application rate adjusted from 0.35 L/m² to 0.45 L/m² using RC-70 rapid-curing cutback asphalt.</li>
            <li>Replaced BoQ file version to ERA-BoQ-Modjo-Adama-Rev1.xlsx. Bidders must submit using this updated revision.</li>
            <li>Bid submission deadline remains unchanged (Nov 15, 2024 at 2:00 PM EAT).</li>
          </ul>
        </div>
        <div className="flex items-center justify-between pt-space-xs">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Official Signed Notification Memo (PDF, 1.2 MB)</span>
          <button className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-1 shadow-xs">
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download Addendum 1</span>
          </button>
        </div>
      </div>
    </div>
  );
}
