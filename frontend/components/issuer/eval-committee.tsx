export function EvalCommittee() {
  return (
    <section className="flex flex-col p-space-md bg-surface-container-lowest rounded-xl shadow-sm gap-space-md">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex flex-col"><span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">Live Committee</span><h3 className="font-headline-sm text-headline-sm text-on-surface">Civil Works Board #3</h3></div>
        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary animate-pulse" />Quorum 5/5</span>
      </div>
      <div className="flex flex-col gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
        <div className="flex items-center justify-between"><span>Current Session:</span><strong className="text-on-surface">ERA/NCB/58/2024</strong></div>
        <div className="flex items-center justify-between"><span>Envelopes Decrypted:</span><strong className="font-mono-data text-mono-data text-on-surface">12 of 12</strong></div>
        <div className="flex items-center justify-between"><span>Cryptographic Keys:</span><strong className="text-primary font-mono-data text-mono-data">3/3 Master Shares</strong></div>
      </div>
      <div className="flex items-center justify-between pt-space-xs bg-surface-container-low p-space-sm rounded-lg">
        <div className="flex -space-x-2 overflow-hidden">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary text-[12px] font-bold ring-2 ring-surface-container-lowest">DB</div>
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-on-secondary text-[12px] font-bold ring-2 ring-surface-container-lowest">AM</div>
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-container text-on-primary text-[12px] font-bold ring-2 ring-surface-container-lowest">TT</div>
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-inverse-surface text-inverse-on-surface text-[12px] font-bold ring-2 ring-surface-container-lowest">SH</div>
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-variant text-on-surface text-[12px] font-bold ring-2 ring-surface-container-lowest">WK</div>
        </div>
        <button className="font-label-sm text-label-sm text-primary hover:text-primary-container font-semibold transition-colors">Audit Ledger →</button>
      </div>
    </section>
  );
}
