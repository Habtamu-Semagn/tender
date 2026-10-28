import Image from "next/image";

export function OverviewPanel() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm space-y-space-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Project Scope &amp; Engineering Outline</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Package II Corridor: Chainage Km 12+400 to Km 60+900 (Dual Carriageway)</p>
        </div>
        <span className="px-space-sm py-1 bg-surface-container text-on-surface-variant rounded font-mono-data text-label-sm">48.50 KM TOTAL</span>
      </div>
      <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-inner">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqP9tpGhQOcaxwXzZ11c14h99j01AILGjkJ1gyIPwIFG-m5VKg8aGfBSbKrzqvKgEfWCOsxEOT50poWM0vQS5b8Dge4t3fdXcsJrlt7EXxZMYDCpg3G2J2Wy6SWulsqDHlGLWlMAlC1QxtS7l5u_GTivNmnytAAf21uStx0hsJLuym1ncz_E-6-CjkrVBuZNvINWLzeg3cn3qxlaHDKD3Da9JRY7TgJsh4yVDxA1VAIr_5QfPOXMkC5g"
          alt="Modjo to Adama Toll Expressway, Ethiopia"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 70vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-space-md text-on-primary p-space-lg h-full flex-col justify-end">
          <div className="flex flex-wrap items-center justify-between gap-space-md w-full">
            <div>
              <div className="font-label-lg text-label-lg font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary-fixed">alt_route</span>
                Modjo – Adama Expressway Link (Oromia National Regional State)
              </div>
              <div className="font-body-sm text-body-sm text-surface-container">Section covers high-density heavy transport connecting Djibouti Port trade artery</div>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-lowest/20 backdrop-blur-md px-space-md py-1.5 rounded-lg text-on-primary font-mono-data text-mono-data">
              <span className="w-2 h-2 rounded-full bg-primary-fixed" />
              GIS Coordinates: 8.5422° N, 39.2705° E
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-space-sm">
        <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">1. Project Summary / የማጠቃለያ መግለጫ</h3>
        <p className="font-body-md text-body-md text-on-surface leading-relaxed">
          The Ethiopian Roads Administration (ERA) intends to execute the periodic asphalt pavement renewal along the arterial connector joining the Addis-Adama Expressway with the southern and eastern trunk routes. Built under heavy axle loadings, the road section requires standardized 50mm Asphalt Concrete (AC) overlay following systematic Cold Planing / Milling of distressed surface courses, targeted crack-sealing, base layer stabilization, and application of modified bitumen tack coats.
        </p>
      </div>
      <div className="space-y-space-sm pt-space-xs">
        <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">2. Core Technical Components / ዋና የስራ ዝርዝሮች</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-xs">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">build</span></div>
            <div className="font-label-lg text-label-lg text-on-surface font-semibold">Pavement Milling &amp; Base</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Cold milling of 48.5km distressed wearing course (avg depth 40-60mm) and localized base repair using CRMB/PMB modified binders.</p>
          </div>
          <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-xs">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">layers</span></div>
            <div className="font-label-lg text-label-lg text-on-surface font-semibold">Superpave Asphalt Overlay</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Supply, hauling, and compacting 142,000 MT of hot-mix asphalt concrete wearing course to strict density &amp; smoothness tolerances.</p>
          </div>
          <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-xs">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">traffic</span></div>
            <div className="font-label-lg text-label-lg text-on-surface font-semibold">Road Furniture &amp; Safety</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Thermoplastic reflective markings (340 km equivalent), W-beam steel guardrail renewal (14,200 lm), and median drain desilting.</p>
          </div>
        </div>
      </div>
      <div className="bg-surface-container p-space-lg rounded-xl flex items-start gap-space-md">
        <span className="material-symbols-outlined text-primary text-[28px] mt-0.5">eco</span>
        <div className="space-y-1">
          <div className="font-label-lg text-label-lg text-on-surface font-semibold">Environmental &amp; Occupational Safeguards (ERA Master Spec 2013 Rev. 2)</div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Contractors are bound by Ethiopian Environmental Protection Authority (EPA) guidelines. Reclaimed Asphalt Pavement (RAP) must be 100% stockpiled in designated holding yards for future recycling. Continuous active traffic management plan is mandatory throughout construction without halting toll traffic.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md pt-space-xs">
        <div className="bg-surface-container-low p-space-md rounded-lg"><span className="font-label-sm text-label-sm text-on-surface-variant">Contract Duration</span><div className="font-mono-data text-label-lg text-on-surface font-bold mt-0.5">540 Calendar Days</div></div>
        <div className="bg-surface-container-low p-space-md rounded-lg"><span className="font-label-sm text-label-sm text-on-surface-variant">Defect Liability</span><div className="font-mono-data text-label-lg text-on-surface font-bold mt-0.5">365 Calendar Days</div></div>
        <div className="bg-surface-container-low p-space-md rounded-lg"><span className="font-label-sm text-label-sm text-on-surface-variant">Advance Payment</span><div className="font-mono-data text-label-lg text-on-surface font-bold mt-0.5">Up to 20% (Unconditional)</div></div>
        <div className="bg-surface-container-low p-space-md rounded-lg"><span className="font-label-sm text-label-sm text-on-surface-variant">Retention Guarantee</span><div className="font-mono-data text-label-lg text-on-surface font-bold mt-0.5">5% of Interim IPCs</div></div>
      </div>
    </div>
  );
}
