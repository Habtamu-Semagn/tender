export function InterAgencySync() {
  const agencies = [
    { name: "MOTRI (ንግድ ሚኒስቴር)", status: "Connected", detail: "BL/AA/2014/9812 • Verified" },
    { name: "Min. of Revenues (ግብር)", status: "Active", detail: "TIN: 0049281745 • Taxpayer Good" },
    { name: "PPPA e-GP Portal", status: "Registered", detail: "Supplier ID: ET-PPA-SUP-4819" },
    { name: "Commercial Bank of Ethiopia", status: "Linked", detail: "CPO Electronic Guarantee Facility" },
  ];
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="font-label-lg text-label-lg text-on-surface">Inter-Agency Data Sync</h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant">የመንግሥት መሥሪያ ቤቶች ትስስር</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" title="Live sync connected" />
      </div>
      <div className="flex flex-col gap-space-sm">
        {agencies.map((a) => (
          <div key={a.name} className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface">{a.name}</span>
              <span className="font-label-sm text-[10px] text-primary font-bold">{a.status}</span>
            </div>
            <p className="font-mono-data text-body-sm text-on-surface-variant truncate">{a.detail}</p>
          </div>
        ))}
      </div>
      <div className="pt-2 text-right">
        <span className="font-mono-data text-label-sm text-on-surface-variant">Last pinged: 08:30 EAT Today</span>
      </div>
    </div>
  );
}
