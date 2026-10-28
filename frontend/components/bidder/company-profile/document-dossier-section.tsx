export function DocumentDossierSection() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Statutory Document Dossier</h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">ህጋዊ የሰነድ ማረጋገጫዎች እና ፈቃዶች</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-surface-container font-mono-data text-body-sm text-on-surface flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">shield</span><span>Directive No. 2016/2024 Compliant</span></span>
        </div>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">All uploaded files are cryptographically timestamped and verified against the Federal Public Procurement Directive No. 2016/2024. Documents expire according to Ethiopian Fiscal Year cycles.</p>
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-[24px]">description</span></div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label-lg text-label-lg text-on-surface">Commercial Trade License</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">የንግድ ፈቃድ</span>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] font-bold inline-flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check</span> VERIFIED</span>
              </div>
              <div className="font-mono-data text-body-sm text-on-surface-variant truncate mt-0.5">AfroTsion_TradeLicense_2016EC.pdf (2.4 MB) • MOTRI/AA/14/008271/2016</div>
              <span className="font-body-sm text-[11px] text-primary">Issued by MOTRI • Valid till Sene 30, 2016 E.C. (July 07, 2024)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-label-md text-label-md transition-colors flex items-center gap-1" type="button"><span className="material-symbols-outlined text-[16px]">visibility</span><span>View</span></button>
            <button className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-label-md text-label-md transition-colors flex items-center gap-1" type="button"><span className="material-symbols-outlined text-[16px]">upgrade</span><span>Replace</span></button>
          </div>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-[24px]">receipt_long</span></div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label-lg text-label-lg text-on-surface">TIN Registration Certificate</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">የግብር ከፋይ መለያ</span>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] font-bold inline-flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check</span> VERIFIED</span>
              </div>
              <div className="font-mono-data text-body-sm text-on-surface-variant truncate mt-0.5">TIN_Certificate_MOR_0049281745.pdf (1.1 MB) • Validated online</div>
              <span className="font-body-sm text-[11px] text-on-surface-variant">Permanent Registration • Federal Ministry of Revenues</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-label-md text-label-md transition-colors flex items-center gap-1" type="button"><span className="material-symbols-outlined text-[16px]">visibility</span><span>View</span></button>
          </div>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-[24px]">badge</span></div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label-lg text-label-lg text-on-surface">VAT Registration Certificate</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">የተጨማሪ እሴት ታክስ ምዝገባ</span>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] font-bold inline-flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check</span> VERIFIED</span>
              </div>
              <div className="font-mono-data text-body-sm text-on-surface-variant truncate mt-0.5">VAT_Reg_Cert_AfroTsion.pdf (850 KB) • VAT-ET-91827401</div>
              <span className="font-body-sm text-[11px] text-on-surface-variant">Status: Active Taxable Supplier</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-label-md text-label-md transition-colors flex items-center gap-1" type="button"><span className="material-symbols-outlined text-[16px]">visibility</span><span>View</span></button>
          </div>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container flex flex-col gap-space-md" id="tax-clearance-section">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/30 flex items-center justify-center text-secondary shrink-0"><span className="material-symbols-outlined text-[24px]">priority_high</span></div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">Annual Tax Clearance Certificate</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">የዓመታዊ ግብር ክሊራንስ</span>
                  <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] font-bold inline-flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">warning</span> ACTION REQUIRED</span>
                </div>
                <p className="font-body-md text-body-md text-secondary font-medium mt-1">Renewed Tax Clearance for FY 2016 E.C. (2023/24) required to participate in bids exceeding ETB 50,000,000.</p>
                <span className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Prior certificate (FY 2015 E.C.) expired on Tikimt 30, 2016 E.C.</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-[32px]">upload_file</span>
              <div>
                <div className="font-label-md text-label-md text-on-surface">Upload Signed Tax Clearance (PDF)</div>
                <div className="font-body-sm text-[12px] text-on-surface-variant">Must bear QR code validation stamp from Ministry of Revenues (Max 10MB)</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Select PDF File</span>
                <input accept=".pdf" className="hidden" type="file" />
              </label>
            </div>
          </div>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-[24px]">workspace_premium</span></div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label-lg text-label-lg text-on-surface">Contractor Competency Certificate (GC-1)</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">የሙያ ብቃት ማረጋገጫ</span>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] font-bold inline-flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check</span> VERIFIED</span>
              </div>
              <div className="font-mono-data text-body-sm text-on-surface-variant truncate mt-0.5">MUI_Competency_GC1_License.pdf (3.8 MB) • Ministry of Urban &amp; Infrastructure</div>
              <span className="font-body-sm text-[11px] text-on-surface-variant">Full Category 1 General Construction Authorization</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-label-md text-label-md transition-colors flex items-center gap-1" type="button"><span className="material-symbols-outlined text-[16px]">visibility</span><span>View</span></button>
            <button className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-label-md text-label-md transition-colors flex items-center gap-1" type="button"><span className="material-symbols-outlined text-[16px]">autorenew</span><span>Renew</span></button>
          </div>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-[24px]">history_edu</span></div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-label-lg text-label-lg text-on-surface">Audited Past Works &amp; Client Certificates</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">የሥራ ልምድ ማረጋገጫዎች</span>
                </div>
                <span className="font-body-sm text-[12px] text-on-surface-variant">4 Certificates Approved by PPA Reviewers • 1 Under Verification</span>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-label-md text-label-md transition-colors flex items-center gap-1 shrink-0 self-start sm:self-center" type="button"><span className="material-symbols-outlined text-[16px]">add</span><span>Add Certificate</span></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-1">
            {[
              { title: "Bole-Meskel Square Road Rehabilitation", badge: "VERIFIED", badgeClass: "bg-primary-fixed text-on-primary-fixed", entity: "Addis Ababa City Roads Authority (AACRA)", value: "ETB 120,000,000", valueClass: "text-primary font-bold", foot: "Completed 2022" },
              { title: "Modjo Dry Port Warehousing Complex", badge: "VERIFIED", badgeClass: "bg-primary-fixed text-on-primary-fixed", entity: "Ethiopian Shipping & Logistics Services (ESLSE)", value: "ETB 210,000,000", valueClass: "text-primary font-bold", foot: "Completed 2023" },
              { title: "Hawassa Industrial Park Internal Access Road", badge: "VERIFIED", badgeClass: "bg-primary-fixed text-on-primary-fixed", entity: "Industrial Parks Development Corp (IPDC)", value: "ETB 85,000,000", valueClass: "text-primary font-bold", foot: "Completed 2021" },
              { title: "Dire Dawa Bypass Drainage & Culverts", badge: "PENDING", badgeClass: "bg-secondary-fixed text-on-secondary-fixed", entity: "Ethiopian Roads Administration (ERA)", value: "ETB 45,000,000", valueClass: "text-on-surface font-semibold", foot: "Under Agency Review", footClass: "text-secondary font-semibold" },
            ].map((p) => (
              <div key={p.title} className="p-space-sm rounded-xl bg-surface-container-lowest flex flex-col justify-between gap-2 shadow-sm">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-label-md text-label-md text-on-surface line-clamp-1">{p.title}</span>
                    <span className={`px-1.5 py-0.5 rounded font-mono-data text-[10px] font-bold shrink-0 ${p.badgeClass}`}>{p.badge}</span>
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">{p.entity}</p>
                </div>
                <div className="flex items-center justify-between font-mono-data text-body-sm pt-1">
                  <span className={p.valueClass}>{p.value}</span>
                  <span className={`text-on-surface-variant text-[11px] ${p.footClass ?? ""}`}>{p.foot}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
