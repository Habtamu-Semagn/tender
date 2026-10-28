export function AcceptanceLetter() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
        <div><h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Official Acceptance Letter Preview</h3><p className="font-body-sm text-body-sm text-on-surface-variant">የጨረታ አሸናፊነት ማሳወቂያ ደብዳቤ ቅጽ</p></div>
        <div className="flex items-center gap-space-xs"><button className="px-space-sm py-1 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold hover:bg-surface-container transition-colors" type="button">Amharic / English Dual</button><button className="px-space-sm py-1 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors" type="button">Edit Draft</button><button className="px-space-sm py-1 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1" type="button"><span className="material-symbols-outlined text-[14px]">print</span> Print</button></div>
      </div>
      <div className="bg-surface p-space-lg rounded-xl shadow-inner font-body-sm text-body-sm text-on-surface">
        <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low p-space-md rounded-lg">
          <div className="flex items-center gap-space-md"><div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-headline-sm">ERA</div><div><div className="font-headline-sm text-headline-sm font-bold text-primary">የኢትዮጵያ መንገዶች አስተዳደር</div><div className="font-label-md text-label-md text-on-surface-variant uppercase">Ethiopian Roads Administration</div></div></div>
          <div className="text-right font-mono-data text-mono-data text-on-surface-variant"><div>Ref: <strong className="text-on-surface">ERA/PD/NCB-58/AW-01/2016</strong></div><div>Date: <strong className="text-on-surface">16 Hidar 2016 E.C. (25 Nov 2024)</strong></div></div>
        </div>
        <div className="mb-space-md font-body-md text-body-md"><strong>To: Afro-Tsion Construction Plc</strong><br />Kirkos Sub-City, Woreda 03, House No. 248, Addis Ababa, Ethiopia<br />Attention: General Manager</div>
        <div className="bg-surface-container px-space-md py-space-xs rounded font-label-lg text-label-lg font-bold text-primary mb-space-md">Subject: Notification of Intention to Award &amp; Letter of Acceptance — Contract ERA/NCB/58/2024 (Semera-Afdera Road Lot 3)</div>
        <div className="space-y-space-sm text-on-surface leading-relaxed">
          <p>This is to formally notify you that the Ethiopian Roads Administration (ERA) Tender Endorsement Committee has approved your bid submitted on 02 Tikimt 2016 E.C. for the execution of the <strong>Semera-Afdera Road Construction Project (Lot 3, 48.5 Km Asphalt Concrete)</strong> for the accepted Contract Amount of <strong>ETB 466,750,000.00 (Four Hundred Sixty-Six Million Seven Hundred Fifty Thousand Ethiopian Birr)</strong>, inclusive of 15% VAT.</p>
          <p>Pursuant to Section 2, Instruction to Bidders (ITB) Clause 44 and FDRE Public Procurement Directives, you are hereby requested to submit an unconditional <strong>Performance Security equivalent to 10% of the accepted contract price</strong>, amounting to <strong>ETB 46,675,000.00</strong>, within <strong>fifteen (15) calendar days</strong> following the conclusion of the statutory standstill period.</p>
          <p>Failure to furnish the performance security or execute the formal contract within the designated time frame shall constitute grounds for forfeiture of your bid security (ETB 500,000.00 CPO) and annulment of the award.</p>
        </div>
        <div className="mt-space-lg pt-space-md flex items-end justify-between">
          <div><div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Authorized Executive Signatory</div><div className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">Eng. Dawit Bekele</div><div className="font-body-sm text-body-sm text-on-surface-variant">Procuring Director, Ethiopian Roads Administration</div></div>
          <div className="flex flex-col items-center"><span className="inline-flex items-center gap-1 text-primary bg-primary-fixed/40 px-space-sm py-1 rounded font-mono-data text-mono-data font-bold"><span className="material-symbols-outlined text-[16px]">verified_user</span> Digital ERA Seal Applied</span><span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Hash: SHA256-ERA-0081736-2024</span></div>
        </div>
      </div>
    </div>
  );
}
