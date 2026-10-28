export function FormFooter() {
  return (
    <div className="sticky bottom-0 mt-space-xl bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-space-md shadow-md z-30 flex flex-wrap items-center justify-between gap-space-md">
      <div className="flex items-center gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs"><span className="font-label-lg text-label-lg text-on-surface font-bold">Step 1 of 7</span><span className="font-label-sm text-label-sm text-on-surface-variant">• Basic Identification</span></div>
          <span className="font-label-sm text-label-sm text-primary font-semibold">14% Complete</span>
        </div>
        <div className="w-32 h-2 rounded-full bg-surface-container-high overflow-hidden hidden sm:block"><div className="h-full bg-primary rounded-full" style={{ width: "14.28%" }} /></div>
      </div>
      <div className="flex items-center gap-space-sm">
        <button className="h-10 px-space-md rounded-xl text-on-surface-variant font-label-lg text-label-lg hover:bg-surface-container-high transition-colors" type="button">Cancel / ሰርዝ</button>
        <button className="h-10 px-space-md rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors flex items-center gap-space-xs" type="button"><span className="material-symbols-outlined text-[18px]">save</span><span>Save Draft / አስቀምጥ</span></button>
        <button className="h-10 px-space-lg rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-space-xs hover:bg-primary-container transition-all shadow-sm" type="button"><span>Next: Requirements &amp; Eligibility →</span></button>
      </div>
    </div>
  );
}
