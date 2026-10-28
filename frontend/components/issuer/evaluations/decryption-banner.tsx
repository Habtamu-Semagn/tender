export function DecryptionBanner({ onAudit }: { onAudit: () => void }) {
  return (
    <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-md mb-space-lg shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
        <div className="flex items-start gap-space-md">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-[24px]">verified_user</span></div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">Official Bid Opening &amp; Decryption Record</span>
              <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-primary-container text-on-primary font-bold">Quorum Verified 5/5</span>
              <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-semibold">FPPA Protocol 2016/2024</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Public Bid Decryption Ceremony Completed on: <strong className="text-on-surface font-semibold">14 Hidar 2016 E.C. (Nov 24, 2024 G.C.) at 14:30 EAT</strong> • Federal Democratic Republic of Ethiopia</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-space-md self-end lg:self-center">
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1.5 rounded-lg"><span className="material-symbols-outlined text-primary text-[18px]">key</span><span className="font-mono-data text-mono-data text-on-surface font-medium truncate max-w-xs">SHA-256: 9f84b1...e45a (5 Keys Synchronized)</span></div>
          <button className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-xs" onClick={onAudit} type="button"><span className="material-symbols-outlined text-[16px] text-primary">history</span><span>Audit Log / ኦዲት መዝገብ</span></button>
        </div>
      </div>
    </div>
  );
}
