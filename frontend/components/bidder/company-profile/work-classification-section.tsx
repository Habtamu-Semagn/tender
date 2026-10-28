export function WorkClassificationSection() {
  const approved = [
    "Civil Works & Road Construction (GC-1 / RC-1)",
    "Building Construction & Structural Works (BC-1)",
    "Hydraulic & Water Works Infrastructure (WWC-2)",
    "Asphalt & Pavement Surfacing",
    "Bridge & Overpass Engineering",
    "Electromechanical Installations",
  ];
  const available = ["+ Add Geotechnical & Foundation Works", "+ Add Heavy Earthmoving & Quarrying", "+ Add Architectural Fitouts"];
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">engineering</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Work Classification &amp; Grade</h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">የሥራ ዘርፎች እና የኮንትራክተር ደረጃ</span>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-surface-container flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">account_balance_wallet</span>
          <div className="flex flex-col text-right">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase leading-none">Max Single Bid Ceiling</span>
            <span className="font-mono-data text-body-sm font-bold text-on-surface">ETB 500,000,000</span>
          </div>
        </div>
      </div>
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">GC-1</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-lg text-label-lg text-on-surface">General Contractor Grade 1 (GC-1)</span>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] font-bold">MUI Certified</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Ministry of Urban and Infrastructure • Reg No: MUI/PRO-GC1/8402/2022</span>
          </div>
        </div>
        <span className="font-mono-data text-body-sm text-on-surface-variant">Annual Review: Hamle 2016 E.C.</span>
      </div>
      <div className="flex flex-col gap-space-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Approved Procurement Categories (6 Active Specializations)</label>
        <div className="flex flex-wrap gap-2 pt-1">
          {approved.map((c) => (
            <div key={c} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm">
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>{c}</span>
              <button className="hover:opacity-75 transition-opacity text-on-primary" title="Remove category" type="button"><span className="material-symbols-outlined text-[14px]">close</span></button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-space-xs pt-1">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Available Endorsements (Requires Sub-Certificate Verification)</label>
        <div className="flex flex-wrap gap-2 pt-1">
          {available.map((a) => (
            <button key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-label-sm text-label-sm transition-colors" type="button">
              <span className="material-symbols-outlined text-[16px] text-primary">add_circle</span>
              <span>{a}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
