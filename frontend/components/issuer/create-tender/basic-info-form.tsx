export function BasicInfoForm() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm">
      <div className="flex items-start justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs mb-space-xs"><span className="material-symbols-outlined text-primary text-[20px]">assignment</span><span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Step 1 of 7: Tender Identification</span></div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Basic Tender Information / የጨረታው መሠረታዊ መረጃ</h1>
        </div>
        <span className="px-space-sm py-space-xs bg-surface-container text-on-surface-variant rounded font-mono-data text-mono-data">FDRE Proc. 649/2009</span>
      </div>
      <div className="p-space-md rounded-xl bg-surface-container-low mb-space-xl flex items-start gap-space-sm">
        <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">policy</span>
        <p className="font-body-sm text-body-sm text-on-surface-variant">All submitted fields are governed by the Federal Democratic Republic of Ethiopia Public Procurement and Property Authority (FPPA) standards. Ensure the official Amharic and English nomenclature accurately matches the Approved Annual Procurement Plan (APP FY 2016 E.C.).</p>
      </div>
      <div className="flex flex-col gap-space-lg">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Official Tender Title / የጨረታው ሙሉ ርዕስ <span className="text-error">*</span></label>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Max 200 characters</span>
          </div>
          <input className="w-full h-11 px-space-md bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-xs transition-all" type="text" defaultValue="Construction of Semera-Afdera Asphalt Concrete Road Rehabilitation Project (Lot 3, 54.2 km)" />
          <span className="font-label-sm text-label-sm text-on-surface-variant">አማርኛ ርዕስ፡ የሰመራ-አፍደራ የአስፋልት ኮንክሪት መንገድ መልሶ ማቋቋም ፕሮጀክት (ሎት 3፣ 54.2 ኪ.ሜ)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Procurement Category / የግዢ ዘርፍ <span className="text-error">*</span></label>
            <div className="relative">
              <select className="w-full h-11 px-space-md pr-10 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md appearance-none focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-xs transition-all cursor-pointer"><option>Civil Works / የኮንስትራክሽን ሥራዎች</option><option>Goods &amp; Supplies / የዕቃዎችና አቅርቦት ግዢ</option><option>Consultancy Services / የማማከር አገልግሎት</option><option>Non-Consultancy Services / ሌሎች አገልግሎቶች</option></select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Procurement Method / የጨረታ ዓይነት <span className="text-error">*</span></label>
            <div className="relative">
              <select className="w-full h-11 px-space-md pr-10 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md appearance-none focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-xs transition-all cursor-pointer"><option>National Competitive Bidding (NCB / ሀገር አቀፍ ግልፅ ጨረታ)</option><option>International Competitive Bidding (ICB / አለም አቀፍ ግልፅ ጨረታ)</option><option>Request for Proposals (RFP / የቴክኒክና ፋይናንስ ፕሮፖዛል)</option><option>Restricted Bidding / ውሱን ጨረታ</option><option>Request for Quotation (RFQ / የዋጋ ማቅረቢያ)</option></select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Executing Directorate / የሚመለከተው ዳይሬክቶሬት <span className="text-error">*</span></label>
            <input className="w-full h-11 px-space-md bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-xs transition-all" type="text" defaultValue="Directorate of Highway Engineering & Contracts (DHEC)" />
          </div>
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Project Region &amp; Woreda / የፕሮጀክት ክልልና ወረዳ <span className="text-error">*</span></label>
            <div className="relative">
              <select className="w-full h-11 px-space-md pr-10 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md appearance-none focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-xs transition-all cursor-pointer"><option>Afar Regional State — Zone 2 (Afdera / Semera Corridor)</option><option>Addis Ababa City Administration (አዲስ አበባ)</option><option>Oromia Regional State (ኦሮሚያ)</option><option>Amhara Regional State (አማራ)</option><option>Somali Regional State (ሶማሌ)</option><option>Tigray Regional State (ትግራይ)</option><option>Sidama Regional State (ሲዳማ)</option><option>South Ethiopia Regional State (ደቡብ ኢትዮጵያ)</option><option>Dire Dawa City Administration (ድሬዳዋ)</option></select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-space-xs">
          <label className="font-label-md text-label-md text-on-surface font-semibold">Procurement Funding Source / የበጀት ምንጭ <span className="text-error">*</span></label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
            <label className="flex items-center gap-space-sm p-space-md rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors"><input className="w-4 h-4 accent-primary" name="funding" type="radio" defaultChecked /><div className="flex flex-col"><span className="font-label-md text-label-md text-on-surface font-semibold">Federal Treasury</span><span className="font-label-sm text-label-sm text-on-surface-variant">የመንግስት ግምጃ ቤት 100%</span></div></label>
            <label className="flex items-center gap-space-sm p-space-md rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors"><input className="w-4 h-4 accent-primary" name="funding" type="radio" /><div className="flex flex-col"><span className="font-label-md text-label-md text-on-surface font-semibold">Multilateral Loan</span><span className="font-label-sm text-label-sm text-on-surface-variant">World Bank / AfDB / IDA</span></div></label>
            <label className="flex items-center gap-space-sm p-space-md rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors"><input className="w-4 h-4 accent-primary" name="funding" type="radio" /><div className="flex flex-col"><span className="font-label-md text-label-md text-on-surface font-semibold">Joint / Counterpart</span><span className="font-label-sm text-label-sm text-on-surface-variant">Co-Financed Facility</span></div></label>
          </div>
        </div>
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Scope of Work &amp; Executive Summary / የሥራው ዝርዝር መግለጫ <span className="text-error">*</span></label>
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm"><span className="material-symbols-outlined text-[16px] text-primary">translate</span><span>Amharic &amp; English Bilingual View</span></div>
          </div>
          <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-xs">
            <div className="bg-surface-container-high/60 px-space-md py-space-xs flex items-center justify-between gap-space-xs flex-wrap">
              <div className="flex items-center gap-space-xs">
                <button className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                <button className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                <button className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                <button className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">format_list_numbered</span></button>
                <div className="h-5 w-px bg-outline-variant mx-1" />
                <button className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">table_chart</span></button>
                <button className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">link</span></button>
              </div>
              <div className="flex items-center gap-space-xs"><span className="px-space-xs py-0.5 rounded bg-surface-container-lowest text-primary font-mono-data text-mono-data text-[11px] font-bold">UTF-8 / Ge&apos;ez Ready</span></div>
            </div>
            <div className="p-space-md"><textarea className="w-full bg-transparent text-on-surface font-body-md text-body-md focus:outline-none resize-y leading-relaxed" rows={6} defaultValue={"The Ethiopian Roads Administration (ERA) invites sealed bids from eligible Grade 1 General or Road Contractors (GC-1 / RC-1) for the rehabilitation of 54.2 kilometers of asphalt concrete road between Semera and Afdera (Lot 3).\n\nKey Works encompass:\n1. Complete scarification and pulverization of existing degraded pavement layers.\n2. Placement of 150mm Crushed Stone Base Course and 50mm Asphalt Concrete Wearing Course.\n3. Hydraulic culvert rehabilitation, drainage realignments, and scour mitigation works.\n4. Supply and installation of thermoplastic road markings, solar-illuminated cat eyes, and guardrails.\n\nExecution period is strictly 730 Calendar Days under FIDIC Red Book condition guidelines."} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
