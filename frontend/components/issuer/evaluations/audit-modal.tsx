"use client";

export function AuditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm z-50 flex items-center justify-center p-space-md">
      <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl p-space-xl shadow-xl flex flex-col max-h-[870px]">
        <div className="flex items-center justify-between pb-space-md">
          <div className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-primary text-[24px]">history_edu</span><div><h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Immutable Audit Trail Ledger</h3><span className="font-label-sm text-label-sm text-on-surface-variant">Tender Ref: ERA/NCB/58/2024 • Cryptographic Chain</span></div></div>
          <button className="p-space-xs rounded-lg hover:bg-surface-container text-on-surface-variant" onClick={onClose} type="button"><span className="material-symbols-outlined text-[20px]">close</span></button>
        </div>
        <div className="overflow-y-auto space-y-space-sm py-space-md flex-1">
          <div className="p-space-sm bg-surface-container-low rounded-xl"><div className="flex items-center justify-between text-label-sm"><span className="font-bold text-primary font-mono-data">TX-HASH: 78d0f1a9...c34</span><span className="text-on-surface-variant">14 Hidar 2016 14:30:00 EAT</span></div><span className="font-body-sm text-body-sm font-semibold text-on-surface block mt-1">Multi-Signature Decryption Keys Synchronized</span><span className="font-body-sm text-body-sm text-on-surface-variant block">5 Committee smart-cards authenticated simultaneously. Envelopes 01-05 financial data decrypted into secure memory.</span></div>
          <div className="p-space-sm bg-surface-container-low rounded-xl"><div className="flex items-center justify-between text-label-sm"><span className="font-bold text-primary font-mono-data">TX-HASH: 44b19e22...9a1</span><span className="text-on-surface-variant">14 Hidar 2016 11:15:22 EAT</span></div><span className="font-body-sm text-body-sm font-semibold text-on-surface block mt-1">Technical Evaluation Scores Locked</span><span className="font-body-sm text-body-sm text-on-surface-variant block">Technical marks validated by Approving Officer Dawit Bekele. Minimum 75 pts bar applied to anonymized files.</span></div>
          <div className="p-space-sm bg-surface-container-low rounded-xl"><div className="flex items-center justify-between text-label-sm"><span className="font-bold text-primary font-mono-data">TX-HASH: 12c88f90...810</span><span className="text-on-surface-variant">12 Hidar 2016 10:00:00 EAT</span></div><span className="font-body-sm text-body-sm font-semibold text-on-surface block mt-1">Tender Submission Gate Closed</span><span className="font-body-sm text-body-sm text-on-surface-variant block">5 Bids received on Chereta e-GP portal before deadline. Bid security deposits confirmed via CBE Telebirr escrow integration.</span></div>
        </div>
        <div className="pt-space-md flex justify-end"><button className="px-space-lg py-2 bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:bg-primary-container" onClick={onClose} type="button">Close Ledger</button></div>
      </div>
    </div>
  );
}
