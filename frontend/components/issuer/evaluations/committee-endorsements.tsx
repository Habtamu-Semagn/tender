export function CommitteeEndorsements() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
      <span className="font-label-md text-label-md text-on-surface font-semibold block mb-space-xs">Evaluation Committee Endorsements</span>
      <div className="space-y-space-xs">
        {[
          { name: "Eng. Dawit Bekele (Lead)", signed: true },
          { name: "W/ro Selamawit G/Mariam (Proc.)", signed: true },
          { name: "Ato Firew Tadesse (Civil Eng.)", signed: true },
          { name: "Ato Melaku Kebede (Financial)", signed: true },
          { name: "Ato Yohannes Haile (Legal/Ethics)", signed: false },
        ].map((m) => (
          <div key={m.name} className="flex items-center justify-between text-body-sm">
            <div className="flex items-center gap-space-xs"><span className={`material-symbols-outlined text-[16px] ${m.signed ? "text-primary" : "text-secondary"}`}>{m.signed ? "check_circle" : "hourglass_top"}</span><span className="font-body-sm text-body-sm text-on-surface">{m.name}</span></div>
            <span className={`font-label-sm text-label-sm font-semibold ${m.signed ? "text-primary" : "text-secondary"}`}>{m.signed ? "Signed" : "Pending Final PIN"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
