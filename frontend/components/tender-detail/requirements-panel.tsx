export function RequirementsPanel() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm space-y-space-lg">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Bidder Qualification Criteria &amp; Legal Thresholds</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Public Procurement and Property Authority (PPPA) Compliance Directive No. 2016/2024</p>
      </div>
      <div className="space-y-space-md">
        <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">Mandatory Statutory Credentials / ህጋዊ መስፈርቶች</h3>
        <div className="space-y-space-xs">
          {[
            { title: "TIN & Value Added Tax (VAT) Registration Certificate", desc: "Verified via Ministry of Revenues electronic database connection", badge: "Mandatory" },
            { title: "Renewed Principal Trade License for Ethiopian Fiscal Year 2016/2017 E.C.", desc: "In Civil Engineering Construction / Road Works Category", badge: "Mandatory" },
            { title: "Grade 1 Civil or Road Contractor Certificate (GC-1 or RC-1)", desc: "Issued by FDRE Ministry of Urban and Infrastructure (Valid at submission date)", badge: "Grade 1 Only" },
            { title: "Tax Clearance Certificate for Tender Purposes", desc: "Valid on bid submission date from Ethiopian Ministry of Revenues", badge: "Mandatory" },
            { title: "Public Procurement and Property Authority (PPPA) Supplier Register", desc: "Active supplier status code on the federal electronic register portal", badge: "Mandatory" },
          ].map((c) => (
            <div key={c.title} className="p-space-md bg-surface-container-low rounded-lg flex items-center justify-between gap-space-md">
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                <div>
                  <div className="font-label-lg text-label-lg text-on-surface font-semibold">{c.title}</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">{c.desc}</div>
                </div>
              </div>
              <span className="px-space-sm py-1 bg-surface-container font-mono-data text-label-sm rounded text-primary font-semibold">{c.badge}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-space-md pt-space-xs">
        <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">Financial Capacity Criteria / የፋይናንስ አቅም</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="p-space-lg bg-surface-container-low rounded-xl space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Average Annual Construction Turnover</span>
              <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
            </div>
            <div className="font-mono-data text-headline-sm text-on-surface font-bold">ETB 180,000,000</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Calculated as total certified payments received for contracts in progress or completed within the past 3 fiscal years (2014, 2015, 2016 E.C.).</p>
          </div>
          <div className="p-space-lg bg-surface-container-low rounded-xl space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Liquid Assets &amp; Credit Line</span>
              <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
            </div>
            <div className="font-mono-data text-headline-sm text-on-surface font-bold">ETB 35,000,000</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Demonstrated access to, or availability of, financial resources such as liquid assets, unencumbered real assets, lines of credit from registered commercial banks.</p>
          </div>
        </div>
      </div>
      <div className="space-y-space-sm pt-space-xs">
        <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">Mandatory Plant &amp; Major Equipment</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm text-center">
          <div className="bg-surface-container-low p-space-sm rounded-lg"><div className="font-mono-data text-headline-sm text-primary font-bold">1 Unit</div><div className="font-label-sm text-label-sm text-on-surface">Asphalt Plant (Min 120 TPH)</div></div>
          <div className="bg-surface-container-low p-space-sm rounded-lg"><div className="font-mono-data text-headline-sm text-primary font-bold">2 Units</div><div className="font-label-sm text-label-sm text-on-surface">Cold Milling Machines (2m)</div></div>
          <div className="bg-surface-container-low p-space-sm rounded-lg"><div className="font-mono-data text-headline-sm text-primary font-bold">2 Units</div><div className="font-label-sm text-label-sm text-on-surface">Asphalt Paver Finishers</div></div>
          <div className="bg-surface-container-low p-space-sm rounded-lg"><div className="font-mono-data text-headline-sm text-primary font-bold">6 Units</div><div className="font-label-sm text-label-sm text-on-surface">Heavy Pneumatic/Tandem Rollers</div></div>
        </div>
      </div>
    </div>
  );
}
