export function RecommendedTenders() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">auto_awesome</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Recommended Tenders For Your Category</h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">የተመረጡ አዳዲስ ጨረታዎች • Matched with GC-1 Civil Works &amp; Electromechanical qualifications</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-container" />
          <span className="font-mono-data text-body-sm text-on-surface-variant">Algorithm v2.4 Live Feed</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-space-md">
        {[
          { match: "98% Match", cat: "National Competitive Bid (NCB)", ref: "ARHB/NCB/14/2024", title: "Amhara Regional Health Bureau: Debre Birhan Specialized Hospital Expansion", loc: "Debre Birhan, Amhara", value: "ETB 88,000,000", close: "Closes in 6 days (Nov 20, 2:00 PM)", closeClass: "text-error" },
          { match: "94% Match", cat: "Industrial Development", ref: "OIPDC/NCB/03/2024", title: "Oromia Industrial Parks: Dukem SEZ Stormwater Drainage & Paving Works", loc: "Dukem, Oromia", value: "ETB 54,200,000", close: "Closes in 11 days (Nov 25, 10:00 AM)", closeClass: "text-tertiary" },
          { match: "91% Match", cat: "Hydraulic & Pipeline", ref: "AAWSA/ICB/08/2024", title: "Addis Ababa Water & Sewerage Authority (AAWSA): Akaki Catchment Main Extension", loc: "Addis Ababa", value: "ETB 112,000,000", close: "Closes in 16 days (Nov 30, 2:00 PM)", closeClass: "text-on-surface-variant" },
        ].map((r) => (
          <div key={r.ref} className="bg-surface-container-low rounded-xl p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md hover:bg-surface-container transition-all">
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-mono-data text-label-sm font-bold">{r.match}</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm">{r.cat}</span>
                <span className="text-on-surface-variant font-mono-data text-label-sm">{r.ref}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">{r.title}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-body-sm text-body-sm text-on-surface-variant">
                <span>Location: <strong className="text-on-surface">{r.loc}</strong></span>
                <span>•</span>
                <span>Est. Value: <strong className="text-primary font-mono-data font-semibold">{r.value}</strong></span>
                <span>•</span>
                <span className={`${r.closeClass} font-medium`}>{r.close}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="w-10 h-10 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors" type="button"><span className="material-symbols-outlined text-[20px]">bookmark_border</span></button>
              <button className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-colors shadow-sm" type="button">Review TOR &amp; BoQ</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
