export function CompanyProfileSection() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">domain</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Company Profile &amp; Registration</h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">የድርጅቱ ህጋዊ መረጃ እና ምዝገባ</span>
        </div>
        <div className="flex items-center gap-space-sm">
          <button className="px-3.5 py-1.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-1" type="button"><span className="material-symbols-outlined text-[16px]">history</span><span>Audit Log</span></button>
          <button className="px-4 py-1.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-1" type="button"><span className="material-symbols-outlined text-[16px]">edit</span><span>Edit Details</span></button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-space-lg gap-y-space-md pt-space-xs">
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between"><span>Legal Registered Name</span><span className="text-on-surface-variant/80">የድርጅቱ ስም</span></label>
          <div className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md flex items-center justify-between"><span className="font-semibold">Afro-Tsion Construction Plc</span><span className="material-symbols-outlined text-primary text-[18px]">verified</span></div>
          <span className="font-body-sm text-[12px] text-on-surface-variant px-1">አፍሮ ጽዮን ኮንስትራክሽን ኃ.የተ.የግ.ማ</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between"><span>Tax Identification Number (TIN)</span><span className="text-on-surface-variant/80">የግብር ከፋይ መለያ ቁጥር</span></label>
          <div className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-mono-data text-body-md flex items-center justify-between"><span className="font-bold">0049281745</span><span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] font-bold">MOR Verified</span></div>
          <span className="font-body-sm text-[11px] text-on-surface-variant px-1">Linked to Federal Ministry of Revenues</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between"><span>Trade License Number</span><span className="text-on-surface-variant/80">የንግድ ፈቃድ ቁጥር</span></label>
          <div className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-mono-data text-body-md flex items-center justify-between"><span>MOTRI/AA/14/008271/2016</span><span className="material-symbols-outlined text-primary text-[18px]">check_circle</span></div>
          <span className="font-body-sm text-[11px] text-primary font-medium px-1">Valid until Sene 30, 2016 E.C. (July 07, 2024)</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between"><span>VAT Registration Number</span><span className="text-on-surface-variant/80">የተጨማሪ እሴት ታክስ ቁጥር</span></label>
          <div className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-mono-data text-body-md flex items-center justify-between"><span>VAT-ET-91827401</span><span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-[10px]">Active Standard VAT</span></div>
          <span className="font-body-sm text-[11px] text-on-surface-variant px-1">Registered March 15, 2004 G.C.</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between"><span>Year Established &amp; Seniority</span><span className="text-on-surface-variant/80">የተመሰረተበት ዓ.ም</span></label>
          <div className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md flex items-center justify-between"><span>1998 G.C. (1990 E.C.)</span><span className="font-mono-data text-body-sm text-on-surface-variant font-semibold">26 Years Active</span></div>
          <span className="font-body-sm text-[11px] text-on-surface-variant px-1">Private Limited Company (Plc / ኃ.የተ.የግ.ማ)</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between"><span>Jurisdiction / Regional Authority</span><span className="text-on-surface-variant/80">የተመዘገበበት ክልል</span></label>
          <div className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md flex items-center justify-between"><span>Addis Ababa City Administration</span><span className="material-symbols-outlined text-on-surface-variant text-[18px]">location_city</span></div>
          <span className="font-body-sm text-[11px] text-on-surface-variant px-1">Authorized for nationwide federal tender delivery</span>
        </div>
        <div className="md:col-span-2 flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between"><span>Principal Office Address</span><span className="text-on-surface-variant/80">ዋና የቢሮ አድራሻ</span></label>
          <div className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md flex items-center justify-between"><span>Bole Sub-City, Woreda 03, House No. 412/A, Mega Building 4th Floor, Addis Ababa, Ethiopia</span><span className="material-symbols-outlined text-on-surface-variant text-[18px]">place</span></div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between"><span>Authorized Tender Representative &amp; Escalation</span><span className="text-on-surface-variant/80">ህጋዊ ተወካይ</span></label>
          <div className="w-full p-3 bg-surface-container-low rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-mono-data text-body-sm">DH</div>
              <div>
                <div className="font-label-md text-label-md text-on-surface">Eng. Dawit Hailemariam</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Managing Director • Certified GC Representative</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono-data text-body-sm text-on-surface">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-on-surface-variant">call</span>+251 911 234 567</span>
              <span className="text-outline-variant">|</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-on-surface-variant">mail</span>tenders@afrotsion.com.et</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
