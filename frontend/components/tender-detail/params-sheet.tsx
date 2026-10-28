export function ParamsSheet() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
      <div className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-semibold">Tender Parameters / የጨረታው ዝርዝር መረጃዎች</div>
      <div className="space-y-space-sm">
        <div className="flex justify-between items-start py-space-xs bg-surface-container-low p-space-sm rounded-lg">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Estimated Contract Value</span>
          <div className="text-right">
            <div className="font-mono-data text-label-md text-on-surface font-bold">ETB 145,000,000</div>
            <div className="font-mono-data text-[11px] text-on-surface-variant font-medium">(~ $1,200,000 USD equiv.)</div>
          </div>
        </div>
        <div className="flex justify-between items-start py-space-xs bg-surface-container-low p-space-sm rounded-lg">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Document Purchase Fee</span>
          <div className="text-right">
            <div className="font-mono-data text-label-md text-on-surface font-bold">ETB 500.00</div>
            <div className="font-label-sm text-[11px] text-on-surface-variant">Payable via Telebirr/CBE Birr</div>
          </div>
        </div>
        <div className="flex justify-between items-start py-space-xs bg-surface-container-low p-space-sm rounded-lg">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Contractor Grade</span>
          <div className="text-right">
            <div className="font-label-md text-label-md text-primary font-bold">GC-1 or RC-1 Only</div>
            <div className="font-label-sm text-[11px] text-on-surface-variant">Ministry of Urban &amp; Infra</div>
          </div>
        </div>
        <div className="flex justify-between items-start py-space-xs bg-surface-container-low p-space-sm rounded-lg">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Bid Validity Period</span>
          <div className="text-right">
            <div className="font-mono-data text-label-md text-on-surface font-bold">90 Calendar Days</div>
            <div className="font-label-sm text-[11px] text-on-surface-variant">From opening date</div>
          </div>
        </div>
        <div className="flex justify-between items-start py-space-xs bg-surface-container-low p-space-sm rounded-lg">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Bid Bond Validity</span>
          <div className="text-right">
            <div className="font-mono-data text-label-md text-on-surface font-bold">120 Calendar Days</div>
            <div className="font-label-sm text-[11px] text-on-surface-variant">From opening date</div>
          </div>
        </div>
      </div>
      <div className="pt-space-sm space-y-space-xs">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Procuring Bureau Contact</span>
        <div className="p-space-md rounded-xl bg-surface-container space-y-space-xs">
          <div className="font-label-md text-label-md text-on-surface font-semibold">Ato Dawit Bekele</div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">Director of Procurement &amp; Contract Administration</div>
          <div className="font-body-sm text-body-sm text-on-surface flex items-center gap-1.5 pt-1">
            <span className="material-symbols-outlined text-[16px] text-primary">location_city</span>
            <span>Ras Abebe Aregay Street, Addis Ababa</span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">call</span>
            <span className="font-mono-data text-mono-data">+251 11 515 6603</span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
            <span className="font-mono-data text-mono-data">ppa-tenders@era.gov.et</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          Procurement Audit ID
        </span>
        <span className="font-mono-data text-mono-data text-on-surface">PPA-ETH-2024-8842</span>
      </div>
    </div>
  );
}
