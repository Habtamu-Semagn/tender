export function DocumentsPanel() {
  const docs = [
    { type: "PDF", title: "Standard Bidding Document (SBD-NCB-Works-2024.pdf)", desc: "Conditions of Contract, Bid Data Sheet & Evaluation Formula", size: "8.4 MB", badge: "bg-error-container text-on-error-container" },
    { type: "PDF", title: "Technical Specifications & Material Standards (Tech-Specs-Vol-II.pdf)", desc: "ERA Standard Technical Specifications 2013 + Special Provisions", size: "14.2 MB", badge: "bg-error-container text-on-error-container" },
    { type: "XLSX", title: "Bill of Quantities (BoQ) Template (ERA-BoQ-Modjo-Adama.xlsx)", desc: "Pre-formatted Pricing Schedule (Addendum No. 1 Updated Formula)", size: "3.1 MB", badge: "bg-primary-fixed text-on-primary-fixed" },
    { type: "DWG", title: "Engineering Drawings & Plan Profile Sheets (Alignment-Drawings.zip)", desc: "Full layout drawings, cross-sections, pavement repair schedules", size: "16.5 MB", badge: "bg-surface-container-highest text-on-surface" },
    { type: "PDF", title: "Sample Electronic Bid Security / CPO Format (CPO-Guarantee-Template.pdf)", desc: "CBE, Awash, Dashen, & Telebirr verifiable guarantee verbiage", size: "620 KB", badge: "bg-error-container text-on-error-container" },
  ];
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm space-y-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Tender Dossier &amp; Bidding Documents</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">All documents digitally signed with ERA e-Procurement Public Key</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary-container hover:bg-primary text-on-primary px-space-md py-2 rounded-lg font-label-md text-label-md transition-colors shadow-xs">
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Download Entire Bundle (ZIP • 42.8 MB)</span>
        </button>
      </div>
      <div className="space-y-space-xs">
        {docs.map((d) => (
          <div key={d.title} className="p-space-md bg-surface-container-low rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
            <div className="flex items-start gap-space-md">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-label-sm ${d.badge}`}>{d.type}</div>
              <div>
                <div className="font-label-lg text-label-lg text-on-surface font-semibold">{d.title}</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-sm mt-0.5">
                  <span>{d.desc}</span>
                  <span>•</span>
                  <span className="font-mono-data">{d.size}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <button className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1 shadow-xs">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Preview</span>
              </button>
              <button className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary transition-all flex items-center gap-1 shadow-xs">
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-space-md bg-surface-container rounded-lg flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
        <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
        <span>Document Purchase Verification: Please note that purchasing the official BoQ via Telebirr (ETB 500) automatically links your tax number to the encrypted submission box.</span>
      </div>
    </div>
  );
}
