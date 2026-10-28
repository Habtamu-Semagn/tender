export function AwardHeader() {
  return (
    <section className="flex flex-col gap-space-md mb-space-lg">
      <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
        <a className="hover:text-primary transition-colors" href="#">Issuer Dashboard</a>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <a className="hover:text-primary transition-colors" href="#">Evaluations</a>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Semera-Afdera Road (ERA/NCB/58/2024)</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary font-bold">Award &amp; Contract / ሽልማት እና ውል</span>
      </nav>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
        <div className="flex flex-col gap-space-xs">
          <div className="flex flex-wrap items-center gap-space-sm">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Notice of Intention to Award &amp; Contract Formulation</h1>
            <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-lg bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm font-semibold"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" /></span>Standstill Period Active (ሕጋዊ የቅሬታ ማቅረቢያ ጊዜ)</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">የጨረታ አሸናፊ ማሳወቂያ እና የውል ዝግጅት ሰነድ • Ethiopian Roads Administration (ERA) Directorate of Construction Procurement</p>
          <div className="flex flex-wrap items-center gap-space-xs mt-space-xs font-mono-data text-mono-data">
            <span className="bg-surface-container px-space-sm py-1 rounded text-on-surface-variant">Ref: <strong className="text-on-surface">ERA/NCB/58/2024</strong></span>
            <span className="bg-surface-container px-space-sm py-1 rounded text-on-surface-variant">Method: <strong className="text-on-surface">NCB Civil Works (መደበኛ ሃገራዊ ጨረታ)</strong></span>
            <span className="bg-surface-container px-space-sm py-1 rounded text-on-surface-variant">Budget Ceiling: <strong className="text-on-surface">ETB 485,200,000.00</strong></span>
            <span className="bg-surface-container px-space-sm py-1 rounded text-on-surface-variant">Evaluation Endorsed: <strong className="text-on-surface">14 Hidar 2016 E.C.</strong></span>
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm">
          <button className="inline-flex items-center justify-center gap-space-xs px-space-lg h-10 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all" type="button"><span className="material-symbols-outlined text-[18px]">verified</span><span>Issue Official Award Letter / የአሸናፊነት ደብዳቤ ላክ</span></button>
          <button className="inline-flex items-center justify-center gap-space-xs px-space-md h-10 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container-low font-label-lg text-label-lg shadow-sm transition-all" type="button"><span className="material-symbols-outlined text-[18px]">mail</span><span>Notify Unsuccessful Bidders</span></button>
          <button className="inline-flex items-center justify-center gap-space-xs p-space-sm h-10 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all" title="Export Award Dossier (PDF)" type="button"><span className="material-symbols-outlined text-[20px]">picture_as_pdf</span></button>
        </div>
      </div>
    </section>
  );
}
