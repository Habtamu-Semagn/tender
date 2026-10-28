export function WizardHeader() {
  const steps = [
    { n: 1, label: "1. Basic Info", am: "መሠረታዊ መረጃ", active: true },
    { n: 2, label: "2. Eligibility", am: "የብቃት መስፈርቶች" },
    { n: 3, label: "3. Financials & CPO", am: "በጀት እና ሲፒኦ" },
    { n: 4, label: "4. Timeline", am: "የጊዜ ሰሌዳ" },
    { n: 5, label: "5. Dossier & BoQ", am: "የሰነድ ማያያዣ" },
    { n: 6, label: "6. Evaluation Matrix", am: "የውጤት አሰጣጥ" },
    { n: 7, label: "7. Publish Gate", am: "ማጠቃለያና ማተም" },
  ];
  return (
    <>
      <div className="flex flex-col gap-space-sm mb-space-lg">
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span className="hover:text-primary transition-colors cursor-pointer">Issuer Dashboard</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-semibold">Create Tender / አዲስ ጨረታ ማውጫ</span>
            </div>
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">Initiate Public Procurement Tender</span>
              <span className="px-space-sm py-space-xs rounded bg-surface-container-high text-on-surface font-mono-data text-mono-data font-semibold">Draft Ref: ERA/NCB/94/2016 E.C.</span>
              <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">Unpublished / ረቂቅ</span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container rounded-xl text-on-surface-variant font-label-sm text-label-sm"><span className="material-symbols-outlined text-primary text-[16px]">cloud_done</span><span>Draft autosaved 2m ago</span></div>
            <button className="h-10 px-space-md rounded-xl bg-surface-container-lowest text-primary font-label-lg text-label-lg flex items-center gap-space-xs hover:bg-surface-container-low transition-colors shadow-sm" type="button"><span className="material-symbols-outlined text-[18px]">save</span><span>Save Draft / ረቂቅ አስቀምጥ</span></button>
            <button className="h-10 px-space-md rounded-xl bg-surface-container-lowest text-on-surface-variant font-label-lg text-label-lg flex items-center gap-space-xs hover:bg-surface-container-high transition-colors shadow-sm" type="button"><span className="material-symbols-outlined text-[18px]">visibility</span><span>Bidder Preview / እይታ</span></button>
            <button className="h-10 px-space-lg rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-space-xs hover:bg-primary-container transition-all shadow-sm" type="button"><span>Continue to Step 2</span><span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
          </div>
        </div>
      </div>
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-md mb-space-xl shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-space-xs">
          {steps.map((s) => (
            <div key={s.n} className={`flex items-center gap-space-xs p-space-sm rounded-lg ${s.active ? "bg-primary-fixed/30 cursor-pointer" : "hover:bg-surface-container-low transition-colors cursor-pointer opacity-75 hover:opacity-100"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-label-md text-label-md shrink-0 ${s.active ? "bg-primary text-on-primary font-bold" : "bg-surface-container-high text-on-surface-variant"}`}>{s.n}</div>
              <div className="flex flex-col min-w-0">
                <span className={`font-label-md text-label-md truncate ${s.active ? "text-primary font-bold" : "text-on-surface"}`}>{s.label}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">{s.am}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
