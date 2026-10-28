export function ComplianceAuditCard() {
  const items = [
    { n: 1, title: "Basic Company Info", desc: "Legal name, domicile & executive reps", tag: "Locked", icon: "check_circle", warn: false },
    { n: 2, title: "TIN & VAT Validation", desc: "Ministry of Revenues live verified", tag: "API Sync", icon: "check_circle", warn: false },
    { n: 3, title: "Trade License & MOTRI", desc: "Commercial register active for 2016 E.C.", tag: "Valid GC-1", icon: "check_circle", warn: false },
    { n: 4, title: "Scope & Specialization", desc: "6 civil categories registered", tag: "Approved", icon: "check_circle", warn: false },
    { n: 5, title: "Tax Clearance", desc: "FY 2016 E.C. renewal pending upload", tag: "Required", icon: "warning", warn: true },
    { n: 6, title: "Track Record & Past Works", desc: "Audited completion certificates on file", tag: "4 Verified", icon: "check_circle", warn: false },
  ];
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Compliance Audit</h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant">የብቃት ማረጋገጫ ዝርዝር</span>
        </div>
        <span className="font-mono-data text-body-sm font-semibold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-lg">85% Complete</span>
      </div>
      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: "85%" }} />
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">5 of 6 statutory criteria verified by Federal Regulators.</p>
      <div className="flex flex-col gap-space-sm pt-space-xs">
        {items.map((it) => (
          <div key={it.n} className={`p-space-sm rounded-xl flex items-start gap-2.5 ${it.warn ? "bg-secondary-fixed/30" : "bg-surface-container-low"}`}>
            <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${it.warn ? "text-secondary" : "text-primary"}`} style={it.warn ? undefined : { fontVariationSettings: "'FILL' 1" }}>{it.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`font-label-md text-label-md text-on-surface ${it.warn ? "font-bold" : ""}`}>{it.n}. {it.title}</span>
                <span className={`font-mono-data text-[10px] uppercase font-bold ${it.warn ? "bg-secondary-container text-on-secondary-fixed px-1.5 py-0.5 rounded" : "text-primary"}`}>{it.tag}</span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight mt-0.5">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
