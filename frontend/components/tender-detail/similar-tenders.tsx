import Link from "next/link";

export function SimilarTenders() {
  const cards = [
    { ref: "EEP/NCB/22/2024", title: "Substation Heavy Access Road Construction (Hawassa II Substation)", entity: "Ethiopian Electric Power (EEP)", location: "Sidama Region • Hawassa Corridor", value: "ETB 38,000,000", badge: "14 Days Left", badgeClass: "bg-secondary-fixed text-on-secondary-fixed" },
    { ref: "AACRA/W-11/2024", title: "Megenagna-Ayat Corridor Pedestrian Overpass Bridges & Terminal Links", entity: "Addis Ababa City Roads Authority (AACRA)", location: "Addis Ababa Administration", value: "ETB 64,000,000", badge: "9 Days Left", badgeClass: "bg-error-container text-on-error-container" },
    { ref: "ORA/ICB/04/2024", title: "Shashemene-Dodola Secondary Trunk Route Spot Improvement & Culverts", entity: "Oromia Roads Authority (ORA)", location: "West Arsi Zone • Shashemene", value: "ETB 52,000,000", badge: "21 Days Left", badgeClass: "bg-surface-container text-on-surface-variant" },
  ];
  return (
    <section className="w-full bg-surface-container-low py-margin">
      <div className="max-w-[1440px] mx-auto px-gutter space-y-space-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">Similar Tenders in Construction &amp; Civil Works</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">ተዛማጅ የጨረታ ማስታወቂያዎች • Active Federal &amp; Regional Infrastructure Opportunities</p>
          </div>
          <Link className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors group" href="/tenders">
            <span>View All Road Works</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {cards.map((c) => (
            <div key={c.ref} className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-space-md">
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-space-sm py-0.5 rounded bg-surface-container font-mono-data text-label-sm text-on-surface">{c.ref}</span>
                  <span className={`px-space-sm py-0.5 rounded font-label-sm text-label-sm font-semibold flex items-center gap-1 ${c.badgeClass}`}>
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    {c.badge}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold hover:text-primary cursor-pointer transition-colors leading-snug">{c.title}</h3>
                <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">account_balance</span>
                  <span>{c.entity}</span>
                </div>
                <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                  <span>{c.location}</span>
                </div>
              </div>
              <div className="pt-space-md bg-surface-container-lowest flex items-center justify-between">
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Estimated Value</div>
                  <div className="font-mono-data text-label-lg text-on-surface font-bold">{c.value}</div>
                </div>
                <Link className="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary font-label-md text-label-md text-primary font-semibold transition-all flex items-center gap-1" href={`/tenders/${c.ref}`}>
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
