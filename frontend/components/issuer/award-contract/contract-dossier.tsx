export function ContractDossier() {
  const items = [
    { icon: "description", color: "text-error", title: "Draft Form of Contract Agreement", desc: "FIDIC/ERA Standard NCB • PDF (3.8 MB)" },
    { icon: "description", color: "text-error", title: "Appendix to Tender & Special Conditions", desc: "Part II Contract Conditions • PDF (1.2 MB)" },
    { icon: "table_chart", color: "text-primary", title: "Priced & Corrected Bill of Quantities (BoQ)", desc: "Lot 3 Earthworks & Pavement • XLSX (5.4 MB)" },
    { icon: "verified", color: "text-error", title: "Performance Security Bank Format", desc: "CBE / Awash Approved Letter • PDF (420 KB)" },
    { icon: "forward_to_inbox", color: "text-on-surface-variant", title: "Unsuccessful Bidder Standstill Debrief Template", desc: "Formal Statutory Dispatch • PDF (680 KB)" },
  ];
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
      <div className="flex items-center justify-between mb-space-md"><div><h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Contract Documents Dossier</h3><p className="font-body-sm text-body-sm text-on-surface-variant">Statutory annexes generated for signature</p></div><span className="font-label-sm text-label-sm font-mono-data bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">5 Attachments</span></div>
      <div className="space-y-space-sm">
        {items.map((it) => (
          <div key={it.title} className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-space-sm min-w-0"><span className={`material-symbols-outlined text-[24px] ${it.color}`}>{it.icon}</span><div className="min-w-0"><div className="font-label-md text-label-md text-on-surface font-bold truncate">{it.title}</div><div className="font-label-sm text-label-sm text-on-surface-variant">{it.desc}</div></div></div>
            <div className="flex items-center gap-space-xs shrink-0"><button className="p-1 rounded text-primary hover:bg-surface-container-lowest transition-colors" title="Review" type="button"><span className="material-symbols-outlined text-[18px]">visibility</span></button><button className="p-1 rounded text-primary hover:bg-surface-container-lowest transition-colors" title="Download" type="button"><span className="material-symbols-outlined text-[18px]">download</span></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
