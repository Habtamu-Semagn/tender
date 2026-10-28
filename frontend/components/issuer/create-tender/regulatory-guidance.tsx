export function RegulatoryGuidance() {
  return (
    <div className="bg-surface-container rounded-xl p-space-lg flex items-start gap-space-md shadow-xs">
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0"><span className="material-symbols-outlined text-[24px]">gavel</span></div>
      <div className="flex flex-col gap-space-xs">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">FDRE Statutory Bidding Timeline Requirements</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">In compliance with Directive No. 2016/2024, National Competitive Bidding (NCB) Civil Works of this threshold require a <span className="font-semibold text-on-surface">minimum floating duration of 30 Calendar Days</span> before the public electronic bid opening. Electronic CPO Bid Bond validation requires mandatory automated verification via CBE or Telebirr escrow gateway.</p>
      </div>
    </div>
  );
}
