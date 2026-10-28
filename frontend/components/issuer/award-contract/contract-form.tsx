"use client";

export function ContractForm() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
      <div className="flex items-center justify-between mb-space-md"><div><h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Contract Formulation &amp; Draft Terms</h3><p className="font-body-sm text-body-sm text-on-surface-variant">የውል ረቂቅ ዝርዝር ማስተካከያ</p></div><span className="material-symbols-outlined text-primary text-[24px]">history_edu</span></div>
      <form className="space-y-space-md" onSubmit={(e) => e.preventDefault()}>
        <div><label className="block font-label-md text-label-md text-on-surface mb-1">Standard Contract Title / የውል መጠሪያ</label><input className="w-full h-10 px-space-md rounded-xl bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest" type="text" defaultValue="Standard FIDIC Red Book / ERA Conditions of Contract (NCB Semera-Afdera Lot 3)" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
          <div><label className="block font-label-md text-label-md text-on-surface mb-1">Contract Value (ETB)</label><input className="w-full h-10 px-space-md rounded-xl bg-surface text-on-surface font-mono-data text-mono-data focus:outline-none focus:bg-surface-container-lowest" readOnly type="text" defaultValue="466,750,000.00" /></div>
          <div><label className="block font-label-md text-label-md text-on-surface mb-1">Execution Duration</label><input className="w-full h-10 px-space-md rounded-xl bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest" type="text" defaultValue="730 Calendar Days (24 Mo)" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
          <div><label className="block font-label-md text-label-md text-on-surface mb-1">Performance Guarantee (10%)</label><input className="w-full h-10 px-space-md rounded-xl bg-surface text-on-surface font-mono-data text-mono-data focus:outline-none focus:bg-surface-container-lowest" type="text" defaultValue="ETB 46,675,000.00" /></div>
          <div><label className="block font-label-md text-label-md text-on-surface mb-1">Advance Payment (20%)</label><input className="w-full h-10 px-space-md rounded-xl bg-surface text-on-surface font-mono-data text-mono-data focus:outline-none focus:bg-surface-container-lowest" type="text" defaultValue="ETB 93,350,000.00" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
          <div><label className="block font-label-md text-label-md text-on-surface mb-1">Retention Deduction</label><input className="w-full h-10 px-space-md rounded-xl bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest" type="text" defaultValue="5% of IPC Valuations" /></div>
          <div><label className="block font-label-md text-label-md text-on-surface mb-1">Liquidated Damages</label><input className="w-full h-10 px-space-md rounded-xl bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest" type="text" defaultValue="0.1%/Day (Max 10% Cap)" /></div>
        </div>
        <div><label className="block font-label-md text-label-md text-on-surface mb-1">Supervising Consultant / Resident Engineer</label><input className="w-full h-10 px-space-md rounded-xl bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest" type="text" defaultValue="Transport Construction Design Share Company (TCDSC)" /></div>
        <div><label className="block font-label-md text-label-md text-on-surface mb-1">Dispute Resolution Forum</label><input className="w-full h-10 px-space-md rounded-xl bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest" type="text" defaultValue="Ethiopian Federal High Court / Arbitration in Addis Ababa" /></div>
        <div className="flex items-center gap-space-sm pt-space-xs">
          <button className="flex-1 h-10 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all" type="button">Save Contract Terms</button>
          <button className="flex-1 h-10 rounded-xl bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-all" type="button">Generate Draft Agreement</button>
        </div>
      </form>
    </div>
  );
}
