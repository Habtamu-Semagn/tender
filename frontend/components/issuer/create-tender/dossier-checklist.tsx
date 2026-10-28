export function DossierChecklist() {
  const items = [
    { label: "1. Tender Identification", status: "In Progress", active: true, desc: "Semera-Afdera Rehabilitation (Lot 3)" },
    { label: "2. Eligibility Matrix", status: "Pending", tags: ["MOTRI License", "GC-1 / RC-1", "Tax Clearance 2016"] },
    { label: "3. Financials & Bid Security", status: "Pending", line: "Est. Budget: ETB 650.0M • CPO: 500,000 ETB" },
    { label: "4. Bidding Schedule", status: "Pending", line: "Floating: 35 Days • Opening: 2:30 PM EAT" },
    { label: "5. BoQ & Drawings", status: "Pending", desc: "Standard ERA Technical Specs (2013 Rev.)" },
    { label: "6. Evaluation & Scoring", status: "Pending", line: "Tech 70% / Fin 30% • Min. Pass: 75 pts" },
    { label: "7. Publication Gate", status: "Pending", desc: "SHA-256 Bid Vault Encryption" },
  ];
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
        <div className="flex flex-col"><span className="font-headline-sm text-headline-sm text-on-surface font-bold">Dossier Checklist</span><span className="font-label-sm text-label-sm text-on-surface-variant">የጨረታ ሂደት ማጠቃለያ</span></div>
        <span className="px-space-sm py-space-xs rounded-full bg-primary-fixed text-on-primary-fixed font-mono-data text-mono-data font-bold text-xs">14% Complete</span>
      </div>
      <div className="flex flex-col gap-space-sm">
        {items.map((it) => (
          <div key={it.label} className={`p-space-sm rounded-lg flex flex-col gap-space-xs ${it.active ? "bg-primary-fixed/20" : "bg-surface-container-low"}`}>
            <div className="flex items-center justify-between">
              <span className={`font-label-md text-label-md font-semibold ${it.active ? "text-primary font-bold" : "text-on-surface"}`}>{it.label}</span>
              <span className={`font-label-sm text-label-sm ${it.active ? "px-space-xs py-0.5 rounded bg-primary text-on-primary" : "text-on-surface-variant"}`}>{it.status}</span>
            </div>
            {it.desc && <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{it.desc}</span>}
            {it.tags && <div className="flex flex-wrap gap-1">{it.tags.map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">{t}</span>)}</div>}
            {it.line && <div className="flex items-center justify-between font-mono-data text-mono-data text-xs text-on-surface-variant"><span>{it.line}</span></div>}
          </div>
        ))}
      </div>
      <div className="p-space-sm rounded-xl bg-surface-container-high/40 flex items-center gap-space-sm"><span className="material-symbols-outlined text-primary text-[20px]">lock</span><span className="font-label-sm text-label-sm text-on-surface-variant">Tamper-proof audit logs recorded under Officer ID: #ERA-EMP-4091.</span></div>
    </div>
  );
}
