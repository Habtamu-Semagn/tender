export function ClosingSoon() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-[22px]">timer</span>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Closing Soon</h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant">የሚዘጉ ጨረታዎች - አስቸኳይ</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-mono-data text-label-sm font-semibold">Urgent</span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="p-space-sm rounded-xl bg-error-container/20 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <span className="font-label-lg text-label-lg text-on-surface font-semibold line-clamp-1">Modjo-Adama Expressway Package II</span>
            <span className="px-2 py-0.5 rounded bg-error text-on-error font-mono-data text-label-sm font-bold shrink-0">18h 24m 05s</span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between"><span>Authority: <strong>ERA</strong></span><span className="font-mono-data text-error font-medium">Tomorrow, 2:00 PM EAT</span></div>
          <button className="w-full mt-1 py-2 px-3 rounded-lg bg-error text-on-error hover:bg-opacity-90 font-label-sm text-label-sm font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all" type="button"><span className="material-symbols-outlined text-[16px]">upload</span><span>Final Submission Window Open</span></button>
        </div>
        <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2"><span className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">Shashemene-Dodola Secondary Route Improvement</span><span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono-data text-label-sm font-bold shrink-0">2d 06h 15m</span></div>
          <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between"><span>Authority: <strong>ORA</strong></span><span className="font-mono-data">Nov 17, 2024</span></div>
          <button className="w-full py-1.5 px-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant font-label-sm text-label-sm font-semibold transition-colors mt-0.5" type="button">Prepare Bid Envelope</button>
        </div>
        <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2"><span className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">Bishoftu Automotive Hub Internal Asphalt Road</span><span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-mono-data text-label-sm font-bold shrink-0">3d 14h 22m</span></div>
          <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between"><span>Authority: <strong>IPDC</strong></span><span className="font-mono-data">Nov 18, 2024</span></div>
          <button className="w-full py-1.5 px-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant font-label-sm text-label-sm font-semibold transition-colors mt-0.5" type="button">Prepare Bid Envelope</button>
        </div>
      </div>
    </section>
  );
}
