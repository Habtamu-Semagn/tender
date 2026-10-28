import Link from "next/link";

export function BidTable() {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-low">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">fact_check</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Recent Bid Submissions &amp; Pipeline</h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">የቅርብ ጊዜ የጨረታ ሁኔታዎች እና የዋስትና (CPO) ክትትል</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface text-label-sm font-label-sm hover:bg-surface-container transition-colors flex items-center gap-1 shadow-sm" type="button"><span className="material-symbols-outlined text-[16px]">filter_list</span><span>Filter Status</span></button>
          <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface text-label-sm font-label-sm hover:bg-surface-container transition-colors flex items-center gap-1 shadow-sm" type="button"><span className="material-symbols-outlined text-[16px]">file_download</span><span>Export CSV</span></button>
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left font-body-md text-body-md border-collapse">
          <thead>
            <tr className="bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
              <th className="py-3 px-space-md">Tender Title &amp; Ref ID</th>
              <th className="py-3 px-space-md">Procuring Entity</th>
              <th className="py-3 px-space-md">Bid Bond (CPO)</th>
              <th className="py-3 px-space-md">Stage &amp; Status</th>
              <th className="py-3 px-space-md text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-surface-container-low transition-colors group">
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-0.5"><span className="font-label-lg text-label-lg text-on-surface font-semibold group-hover:text-primary transition-colors">Periodic Maintenance &amp; Overlay of Modjo-Adama Expressway</span><span className="font-mono-data text-body-sm text-on-surface-variant">Ref: ERA/NCB/58/2024</span><span className="font-label-sm text-label-sm text-on-surface-variant">Submitted: Nov 12, 2024</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col"><span className="font-medium text-on-surface text-body-md">Ethiopian Roads Admin</span><span className="font-label-sm text-label-sm text-on-surface-variant">የኢትዮጵያ መንገዶች አስተዳደር</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-1"><span className="font-mono-data text-body-sm font-semibold text-on-surface">ETB 500,000</span><span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary"><span className="material-symbols-outlined text-[13px]">lock</span>CBE API Hold</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-1"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-secondary" />Tech Eval in Progress</span><span className="font-label-sm text-label-sm text-on-surface-variant">Score threshold: 75%</span></div></td>
              <td className="py-3.5 px-space-md align-top text-right"><button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary font-label-sm text-label-sm font-semibold transition-all" type="button">Track Envelope</button></td>
            </tr>
            <tr className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-0.5"><span className="font-label-lg text-label-lg text-on-surface font-semibold group-hover:text-primary transition-colors">Turnkey Deployment of 5G Metro Core Optical Fiber</span><span className="font-mono-data text-body-sm text-on-surface-variant">Ref: ET/ICB/CORE-56/24</span><span className="font-label-sm text-label-sm text-on-surface-variant">Submitted: Oct 28, 2024</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col"><span className="font-medium text-on-surface text-body-md">Ethio Telecom</span><span className="font-label-sm text-label-sm text-on-surface-variant">ኢትዮ ቴሌኮም</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-1"><span className="font-mono-data text-body-sm font-semibold text-on-surface">ETB 2,500,000</span><span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary"><span className="material-symbols-outlined text-[13px]">format_image_left</span>Telebirr Guarantee</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-1"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-primary" />Standstill Notice Issued</span><span className="font-label-sm text-label-sm text-primary font-medium">Ranked #1 Bidder</span></div></td>
              <td className="py-3.5 px-space-md align-top text-right"><button className="px-3 py-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed hover:bg-primary hover:text-on-primary font-label-sm text-label-sm font-semibold transition-all" type="button">View Notice</button></td>
            </tr>
            <tr className="hover:bg-surface-container-low transition-colors group">
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-0.5"><span className="font-label-lg text-label-lg text-on-surface font-semibold group-hover:text-primary transition-colors">Hawassa II Substation Heavy Access Road Construction</span><span className="font-mono-data text-body-sm text-on-surface-variant">Ref: EEP/NCB/22/2024</span><span className="font-label-sm text-label-sm text-on-surface-variant">Submitted: Oct 15, 2024</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col"><span className="font-medium text-on-surface text-body-md">Ethiopian Electric Power</span><span className="font-label-sm text-label-sm text-on-surface-variant">የኢትዮጵያ ኤሌክትሪክ ኃይል</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-1"><span className="font-mono-data text-body-sm font-semibold text-on-surface">ETB 350,000</span><span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant"><span className="material-symbols-outlined text-[13px]">check_circle</span>Released to CBE</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-1"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold"><span className="material-symbols-outlined text-[13px]">handshake</span>Won &amp; Signed</span><span className="font-label-sm text-label-sm text-on-surface-variant">Project in Mobilization</span></div></td>
              <td className="py-3.5 px-space-md align-top text-right"><button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant font-label-sm text-label-sm font-semibold transition-all" type="button">View Contract</button></td>
            </tr>
            <tr className="hover:bg-surface-container-low transition-colors group">
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-0.5"><span className="font-label-lg text-label-lg text-on-surface font-semibold group-hover:text-primary transition-colors">Megenagna-Ayat Corridor Pedestrian Overpass</span><span className="font-mono-data text-body-sm text-on-surface-variant">Ref: AACRA/W-11/2024</span><span className="font-label-sm text-label-sm text-on-surface-variant">Submitted: Nov 02, 2024</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col"><span className="font-medium text-on-surface text-body-md">Addis Ababa City Roads Admin</span><span className="font-label-sm text-label-sm text-on-surface-variant">አዲስ አበባ መንገዶች ባለስልጣን</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-1"><span className="font-mono-data text-body-sm font-semibold text-on-surface">ETB 400,000</span><span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary"><span className="material-symbols-outlined text-[13px]">lock</span>CBE Birr Escrow</span></div></td>
              <td className="py-3.5 px-space-md align-top"><div className="flex flex-col gap-1"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-variant text-on-surface font-label-sm text-label-sm font-semibold"><span className="material-symbols-outlined text-[13px]">payments</span>Financial Comparison</span><span className="font-label-sm text-label-sm text-on-surface-variant">Opening: 10:00 AM Today</span></div></td>
              <td className="py-3.5 px-space-md align-top text-right"><button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant font-label-sm text-label-sm font-semibold transition-all" type="button">View Dossier</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="px-space-lg py-3 bg-surface-container-low flex items-center justify-between">
        <span className="font-body-sm text-body-sm text-on-surface-variant">Showing 4 of 19 records</span>
        <Link className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1" href="#"><span>View all 19 historical bids</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
      </div>
    </section>
  );
}
