import Link from "next/link";

export function Alerts() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-[22px]">campaign</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Addenda &amp; Tender Alerts</h2>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-mono-data text-label-sm">2 New</span>
      </div>
      <div className="flex flex-col gap-space-sm">
        <div className="p-space-sm rounded-xl bg-surface-container-low flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0 mt-0.5"><span className="material-symbols-outlined text-[18px]">edit_document</span></div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Addendum No. 2 Published</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">ERA/NCB/58/2024: Revision of BoQ Item 4.02 (Bituminous binder grade revised to 60/70).</p>
            <div className="flex items-center justify-between mt-1"><span className="font-mono-data text-label-sm text-on-surface-variant">10 minutes ago</span><Link className="font-label-sm text-label-sm text-primary font-semibold hover:underline" href="#">Download Addendum</Link></div>
          </div>
        </div>
        <div className="p-space-sm rounded-xl bg-surface-container-low flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0 mt-0.5"><span className="material-symbols-outlined text-[18px]">forum</span></div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Pre-Bid Clarifications Uploaded</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Ethio Telecom published written answers for 5G Metro Core fiber rollout inquiries.</p>
            <div className="flex items-center justify-between mt-1"><span className="font-mono-data text-label-sm text-on-surface-variant">2 hours ago</span><Link className="font-label-sm text-label-sm text-primary font-semibold hover:underline" href="#">View Minutes</Link></div>
          </div>
        </div>
      </div>
    </section>
  );
}
