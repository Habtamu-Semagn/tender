export function BidDossierDrawer() {
  const milestones = [
    { title: "Bid Sealed & Submitted", date: "Nov 12", desc: "10:45 AM EAT • e-GP Timestamp Verified", done: true },
    { title: "CPO Digital Hold Confirmed", date: "Nov 12", desc: "10:46 AM • CBE Ref: CBE-CPO-99412", done: true },
    { title: "Submission Deadline Closed", date: "Nov 14", desc: "2:00 PM EAT • All tenders locked", done: true },
    { title: "Technical Envelope Decryption", date: "Nov 14", desc: "2:30 PM EAT • Public Opening Session", done: true },
    { title: "Preliminary & Technical Evaluation", date: "CURRENT", desc: "Evaluation Committee scoring methodology GC-1. Threshold: 75 points.", current: true },
    { title: "Financial Envelope Opening", date: "Nov 22", desc: "Qualified bidders invited", upcoming: true },
    { title: "Standstill Notice of Award", date: "7 Days", desc: "Statutory debrief window", upcoming: true },
  ];
  return (
    <div className="xl:col-span-4 bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col space-y-space-md sticky top-20">
      <div className="flex items-start justify-between pb-space-sm border-b border-surface-container">
        <div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary animate-pulse" /><span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Active Evaluation Dossier</span></div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1">Bid Dossier &amp; Timeline</h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant">የጨረታ ሂደት እና የጊዜ ሰሌዳ</span>
        </div>
        <button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors" title="Close Panel" type="button"><span className="material-symbols-outlined text-[18px]">close</span></button>
      </div>
      <div className="p-space-md rounded-xl bg-surface-container-low space-y-2.5">
        <div className="flex items-center justify-between"><span className="font-label-sm text-label-sm text-on-surface-variant">Tender Ref:</span><span className="font-mono-data text-body-sm font-bold text-on-surface">ERA/NCB/58/2024</span></div>
        <div className="flex items-center justify-between"><span className="font-label-sm text-label-sm text-on-surface-variant">Bidder Entity:</span><span className="font-label-md text-label-md text-on-surface">Afro-Tsion Constr. Plc</span></div>
        <div className="flex items-center justify-between"><span className="font-label-sm text-label-sm text-on-surface-variant">Submitted Financial Offer:</span><span className="font-mono-data text-label-lg font-bold text-primary">ETB 142,800,000</span></div>
        <div className="flex items-center justify-between"><span className="font-label-sm text-label-sm text-on-surface-variant">Digital CPO Bond:</span><span className="font-mono-data text-body-sm font-semibold text-on-surface">ETB 500,000 (CBE Confirmed)</span></div>
        <div className="pt-2 border-t border-surface-container flex flex-col gap-1">
          <span className="font-label-sm text-[11px] text-on-surface-variant">SHA-256 Vault Envelope Hash:</span>
          <div className="flex items-center justify-between bg-surface-container-lowest px-2 py-1 rounded"><span className="font-mono-data text-[11px] text-on-surface truncate">8f4b7a192c30084debf692e10a083</span><button className="text-primary hover:underline font-mono-data text-[11px] ml-2" type="button">Copy</button></div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 pt-1">
        <div className="flex items-center justify-between"><span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">Milestone Progress (የሂደት ደረጃዎች)</span><span className="font-label-sm text-[11px] text-primary font-mono-data">5 of 8 Completed</span></div>
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
          {milestones.map((m, i) => (
            <div key={i} className={`relative flex flex-col ${m.upcoming ? "opacity-60" : ""}`}>
              <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-surface-container-lowest ${m.done ? "bg-primary" : m.current ? "bg-secondary animate-pulse" : "bg-surface-container-high"}`}>
                {m.done && <span className="material-symbols-outlined text-on-primary text-[10px] font-bold">check</span>}
                {m.current && <span className="w-1.5 h-1.5 rounded-full bg-on-secondary" />}
                {m.upcoming && <span className="w-1.5 h-1.5 rounded-full bg-outline" />}
              </div>
              <div className="flex items-center justify-between">
                <span className={`font-label-md text-label-md ${m.current ? "text-secondary font-bold" : "text-on-surface"}`}>{m.title}</span>
                {m.current ? <span className="font-label-sm text-[11px] bg-secondary-fixed text-secondary px-1.5 py-0.2 rounded font-bold">CURRENT</span> : <span className={`font-mono-data text-label-sm ${m.done ? "text-primary font-bold" : "text-on-surface-variant"}`}>{m.date}</span>}
              </div>
              <p className={`font-body-sm text-body-sm mt-0.5 ${m.current ? "text-on-surface" : "text-on-surface-variant"}`}>{m.desc}</p>
              {m.current && <div className="mt-2 p-2 rounded-lg bg-surface-container text-on-surface-variant font-mono-data text-[11px] flex items-center justify-between"><span>Estimated Completion:</span><span className="font-bold text-on-surface">Nov 20, 2024</span></div>}
            </div>
          ))}
        </div>
      </div>
      <div className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-primary">chat_bubble</span><span className="font-label-sm text-label-sm text-on-surface">Agency Addenda &amp; Q&amp;A:</span></div>
        <a className="font-label-sm text-label-sm text-primary font-semibold hover:underline" href="#">2 Clarifications Issued</a>
      </div>
      <div className="pt-2 flex flex-col gap-2">
        <button className="w-full h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-all shadow-sm" type="button"><span className="material-symbols-outlined text-[18px]">verified_user</span><span>Download Encrypted Receipt</span></button>
        <div className="grid grid-cols-2 gap-2">
          <button className="h-9 px-3 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-sm text-label-sm flex items-center justify-center gap-1 transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">help_center</span><span>Clarifications</span></button>
          <button className="h-9 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm flex items-center justify-center transition-colors" type="button">Dismiss Drawer</button>
        </div>
      </div>
    </div>
  );
}
