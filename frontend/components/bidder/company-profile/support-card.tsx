import Link from "next/link";

export function SupportCard() {
  return (
    <div className="bg-surface-container rounded-xl p-space-md flex flex-col gap-space-sm">
      <div className="flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-[20px] text-primary">support_agent</span>
        <span className="font-label-md text-label-md">Need Verification Support?</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">For expedited contractor renewals, call the Federal e-GP Contractor Desk or consult procurement guidelines.</p>
      <div className="flex items-center justify-between pt-1">
        <Link className="font-mono-data text-body-sm text-primary font-bold flex items-center gap-1 hover:underline" href="tel:8989">
          <span className="material-symbols-outlined text-[16px]">call</span>
          <span>Hotline 8989</span>
        </Link>
        <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface flex items-center gap-0.5" href="#">
          <span>PPA Directives</span>
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </Link>
      </div>
    </div>
  );
}
