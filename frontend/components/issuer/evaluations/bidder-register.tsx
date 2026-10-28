"use client";

import { BIDDERS } from "./bidder-data";

export function BidderRegister({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <div className="p-space-md flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low/50">
        <div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-primary text-[20px]">format_list_numbered</span><span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Bidder Evaluation Register (5 Envelopes)</span></div>
        <div className="flex items-center gap-space-xs"><span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-lowest px-space-sm py-1 rounded-lg">Sorted by: <strong className="text-on-surface">Combined Total Rank</strong></span></div>
      </div>
      <div className="px-space-md py-space-sm bg-surface-container/60 flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant"><span className="material-symbols-outlined text-[16px] text-primary">visibility</span><span>Notice: Technical marks were finalized prior to financial unsealing per FDRE Public Procurement Guideline Art. 43(2).</span></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md"><tr>
            <th className="py-space-sm px-space-md">Rank &amp; Env.</th><th className="py-space-sm px-space-md">Bidder Legal Name</th><th className="py-space-sm px-space-md text-right">Financial Offer (ETB)</th><th className="py-space-sm px-space-md text-center">Tech (70%)</th><th className="py-space-sm px-space-md text-center">Fin (30%)</th><th className="py-space-sm px-space-md text-center">Total (100)</th><th className="py-space-sm px-space-md text-center">Statutory</th><th className="py-space-sm px-space-md text-right">Action</th>
          </tr></thead>
          <tbody className="font-body-sm text-body-sm divide-y-0 text-on-surface">
            {BIDDERS.map((b, i) => {
              const isDisqualified = b.id === "bidder-5";
              const rankNum = i + 1;
              const active = selectedId === b.id;
              return (
                <tr key={b.id} id={`row-${b.id}`} onClick={() => onSelect(b.id)} className={`bidder-row cursor-pointer transition-colors ${active ? "bg-surface-container-high/80" : b.rowClass} hover:bg-surface-container-high/40`}>
                  <td className="py-space-md px-space-md"><div className="flex items-center gap-space-xs"><span className={`w-6 h-6 rounded-full font-label-sm text-label-sm flex items-center justify-center font-bold ${isDisqualified ? "bg-error text-on-error" : "bg-primary text-on-primary"}`}>{isDisqualified ? "X" : rankNum}</span><span className={`font-mono-data text-mono-data font-semibold ${isDisqualified ? "text-error" : "text-primary"}`}>{b.envNo}</span></div></td>
                  <td className="py-space-md px-space-md"><div className={`font-label-lg text-label-lg font-semibold ${isDisqualified ? "text-on-surface" : "text-on-surface"}`}>{b.name}</div><div className={`font-label-sm text-label-sm ${isDisqualified ? "text-error" : "text-on-surface-variant"}`}>{isDisqualified ? "Failed Technical Threshold (65 < 75 pts)" : b.grade.replace(/ \(License.*\)/, "") + " • TIN"}</div></td>
                  <td className="py-space-md px-space-md text-right"><div className={`font-mono-data text-mono-data font-bold ${isDisqualified ? "text-error line-through" : "text-on-surface"}`}>{b.financial}</div><span className={`font-label-sm text-label-sm ${isDisqualified ? "text-error" : "text-primary"}`}>{b.variance}</span></td>
                  <td className="py-space-md px-space-md text-center"><span className={`font-mono-data text-mono-data ${isDisqualified ? "text-error" : ""}`}>{b.techDisplay}</span>{!isDisqualified && <span className="block font-label-sm text-label-sm text-on-surface-variant">{b.totalTech}</span>}</td>
                  <td className="py-space-md px-space-md text-center"><span className="font-mono-data text-mono-data">{b.finDisplay}</span></td>
                  <td className="py-space-md px-space-md text-center"><span className={`inline-flex px-space-xs py-0.5 rounded font-mono-data text-mono-data font-bold ${isDisqualified ? "text-error" : active ? "bg-primary text-on-primary" : "text-on-surface"}`}>{b.totalDisplay}</span></td>
                  <td className="py-space-md px-space-md text-center"><span className={`inline-flex items-center gap-0.5 ${isDisqualified ? "text-error" : "text-primary"}`}><span className="material-symbols-outlined text-[16px]">{isDisqualified ? "cancel" : "check_circle"}</span><span className="font-label-sm text-label-sm font-semibold">{b.statutory}</span></span></td>
                  <td className="py-space-md px-space-md text-right"><span className={`inline-flex px-space-xs py-1 rounded font-label-sm text-label-sm font-bold ${b.actionBadgeClass}`}>{b.actionBadge}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
