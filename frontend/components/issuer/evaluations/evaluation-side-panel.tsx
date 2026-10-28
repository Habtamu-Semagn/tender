"use client";

import { Bidder } from "./bidder-data";

export function EvaluationSidePanel({ bidder }: { bidder: Bidder }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col gap-space-md">
      <div className="flex items-start justify-between pb-space-sm bg-surface-container-low -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl">
        <div>
          <div className="flex items-center gap-space-xs mb-1">
            <span className="font-label-sm text-label-sm bg-primary text-on-primary px-space-xs py-0.5 rounded font-bold">{bidder.rank}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Evaluator Dossier</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">{bidder.name}</h2>
          <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">{bidder.grade}</span>
        </div>
        <span className="material-symbols-outlined text-primary text-[28px]">assignment_turned_in</span>
      </div>
      <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between">
        <div><span className="font-label-sm text-label-sm text-on-surface-variant block">Financial Bid Price</span><span className="font-mono-data text-mono-data text-on-surface font-bold">{bidder.price}</span></div>
        <div className="text-right"><span className="font-label-sm text-label-sm text-on-surface-variant block">Ceiling Variance</span><span className="font-label-sm text-label-sm text-primary font-bold bg-primary-fixed/60 px-1.5 py-0.5 rounded">{bidder.variance}</span></div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-space-xs"><span className="font-label-lg text-label-lg text-on-surface font-bold">1. Technical Criteria Score Breakdown</span><span className="font-mono-data text-mono-data font-bold text-primary">{bidder.totalTech}</span></div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Weighted pass minimum threshold: 75 points. Technical weight factor: 70%.</p>
        <div className="space-y-space-xs">
          {[
            { label: "1. Past Experience (Road Works)", val: bidder.c1, max: 20, pct: (bidder.c1 / 20) * 100, note: "4 major audited asphalt highway contracts executed in similar arid zones." },
            { label: "2. Key Supervisory Personnel", val: bidder.c2, max: 25, pct: (bidder.c2 / 25) * 100, note: "Project Manager & Senior Materials Eng. hold verified ERA licenses." },
            { label: "3. Plants & Equipment Availability", val: bidder.c3, max: 25, pct: (bidder.c3 / 25) * 100, note: "Asphalt Batching Plant situated within 45km radius of Afdera access point." },
            { label: "4. Methodology & Quality Control", val: bidder.c4, max: 20, pct: (bidder.c4 / 20) * 100, note: "Clear HSE hazard protocol for extreme thermal conditions (Afar depression)." },
            { label: "5. Local Engagement & Subcontracting", val: bidder.c5, max: 10, pct: (bidder.c5 / 10) * 100, note: "Allocated 15% aggregate transport to regional Afar hauling enterprises." },
          ].map((c) => (
            <div key={c.label} className="p-space-xs bg-surface-container-low/60 rounded-lg">
              <div className="flex items-center justify-between"><span className="font-label-md text-label-md text-on-surface">{c.label}</span><span className="font-mono-data text-mono-data font-bold text-primary">{c.val}/{c.max}</span></div>
              <div className="w-full bg-surface-container h-1.5 rounded-full mt-1.5 overflow-hidden"><div className="bg-primary h-full rounded-full" style={{ width: `${c.pct}%` }} /></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 block">{c.note}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-space-xs"><span className="font-label-lg text-label-lg text-on-surface font-bold">2. Mandatory Statutory Clearances</span><span className="font-label-sm text-label-sm text-primary font-bold">5/5 Passed</span></div>
        <div className="space-y-1.5 bg-surface-container-low/40 p-space-sm rounded-lg">
          {["Valid MOTRI Commercial Registration (Renewed 2016 E.C.)", "Ministry of Revenues FY 2016 E.C. Tax Clearance Certificate", "Commercial Bank of Ethiopia CPO Escrow (ETB 500,000.00 Verified)", "Priced Bill of Quantities (BoQ) verified: 0 arithmetic discrepancies", "FDRE Anti-Collusion and Ethical Integrity Pact signed & sealed"].map((t) => (
            <label key={t} className="flex items-start gap-space-xs text-on-surface font-body-sm text-body-sm cursor-pointer"><input checked className="mt-0.5 rounded text-primary focus:ring-0 w-4 h-4 accent-primary" disabled type="checkbox" /><span className="leading-tight">{t}</span></label>
          ))}
        </div>
      </div>
      <div>
        <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">Evaluator Notes &amp; Recommendation Rationale / የግምገማ አስተያየት</label>
        <textarea className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg p-space-sm focus:outline-none focus:bg-surface-container-lowest leading-relaxed shadow-xs" rows={3} defaultValue={bidder.notes} />
      </div>
      <div className="p-space-sm bg-primary/10 rounded-lg flex items-center justify-between">
        <div><span className="font-label-sm text-label-sm text-primary font-semibold block">Combined Final Score (ደረጃ ውጤት)</span><span className="font-body-sm text-body-sm text-on-surface">Formula: {bidder.weightedTech} (Tech) + {bidder.weightedFin} (Fin)</span></div>
        <span className="font-headline-sm text-headline-sm text-primary font-bold">{bidder.finalScore}</span>
      </div>
      <div className="flex flex-col gap-space-xs pt-space-xs">
        <button className="w-full h-11 bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-space-xs shadow transition-colors" type="button"><span className="material-symbols-outlined text-[20px]">recommend</span><span>Recommend for Award (ለሽልማት አቅርብ)</span></button>
        <div className="grid grid-cols-2 gap-space-xs">
          <button className="h-9 px-space-sm bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-1 transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">bookmark</span><span>Shortlist / አጭር ዝርዝር</span></button>
          <button className="h-9 px-space-sm bg-error-container/30 hover:bg-error-container text-error font-label-md text-label-md rounded-lg flex items-center justify-center gap-1 transition-colors" type="button"><span className="material-symbols-outlined text-[16px]">block</span><span>Disqualify / ውድቅ አድርግ</span></button>
        </div>
      </div>
    </div>
  );
}
