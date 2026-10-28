"use client";

export default function TendersPage() {
  return (
    <>

<header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 w-full max-w-[1440px] mx-auto px-gutter flex items-center justify-between"><div className="flex items-center gap-space-lg"><a className="flex items-center gap-space-sm group" data-path="landing-page" href="#"><div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm"><span className="material-symbols-outlined text-[24px]">gavel</span></div></a><div className="hidden lg:block w-[1px] h-6 bg-surface-dim"></div><div className="hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span><span>FDRE PPA Compliant</span></div></div><nav className="hidden md:flex items-center gap-space-xl font-label-lg text-label-lg" data-active-classes="text-primary font-bold"><a className="text-on-surface-variant hover:text-on-surface transition-colors" data-path="tenders" href="#">Tenders</a><a className="text-on-surface-variant hover:text-on-surface transition-colors" data-path="how-it-works" href="#">How it Works</a><a className="text-on-surface-variant hover:text-on-surface transition-colors" data-path="pricing" href="#">Pricing</a><a className="text-on-surface-variant hover:text-on-surface transition-colors" data-path="contact" href="#">Contact</a></nav><div className="flex items-center gap-space-md"><div className="flex items-center bg-surface-container-low p-space-xs rounded-lg font-label-sm text-label-sm"><button className="px-space-sm py-1 rounded bg-surface-container-lowest text-primary shadow-xs font-semibold" type="button">EN</button><span className="text-outline-variant px-space-xs">|</span><button className="px-space-sm py-1 rounded text-on-surface-variant hover:text-on-surface" type="button">አማ</button></div><a className="hidden sm:inline-flex items-center font-label-md text-label-md text-on-surface-variant hover:text-on-surface px-space-md py-2 transition-colors" data-path="login" href="#">Login</a><a className="inline-flex items-center justify-center font-label-md text-label-md bg-primary-container hover:bg-primary text-on-primary px-space-lg py-2 h-10 rounded-lg transition-colors shadow-sm" data-path="register" href="#">Register</a><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-space-xs"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="w-full pt-16 bg-surface"><div className="flex flex-col w-full">
{/* Interactive Alert Modal */}
<div className="hidden fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-sm p-4" id="alert-modal">
<div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl p-6 relative">
<div className="flex items-center justify-between pb-4">
<div className="flex items-center gap-2">
<div className="w-9 h-9 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
<span className="material-symbols-outlined text-[20px]">notifications_active</span>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Create Tender Alert</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">የጨረታ ማሳወቂያ ፍጠር • Real-Time Notification</p>
</div>
</div>
<button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-dim flex items-center justify-center text-on-surface-variant" id="close-alert-btn">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<div className="space-y-4 pt-2">
<div>
<label className="block font-label-md text-label-md text-on-surface mb-1">Saved Criteria Summary</label>
<div className="bg-surface-container-low p-3 rounded-lg text-body-sm font-body-sm text-on-surface-variant flex flex-wrap gap-1.5">
<span className="bg-surface-container-highest px-2 py-0.5 rounded text-on-surface text-[11px] font-mono-data">Infrastructure</span>
<span className="bg-surface-container-highest px-2 py-0.5 rounded text-on-surface text-[11px] font-mono-data">Addis Ababa &amp; Oromia</span>
<span className="bg-surface-container-highest px-2 py-0.5 rounded text-on-surface text-[11px] font-mono-data">&gt; ETB 10M</span>
</div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface mb-1">Notification Frequency</label>
<div className="grid grid-cols-3 gap-2">
<label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container">
<input  className="text-primary accent-primary" name="freq" type="radio"/>
<span className="font-label-sm text-label-sm">Instant (SMS &amp; Email)</span>
</label>
<label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container">
<input className="text-primary accent-primary" name="freq" type="radio"/>
<span className="font-label-sm text-label-sm">Daily Digest</span>
</label>
<label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container">
<input className="text-primary accent-primary" name="freq" type="radio"/>
<span className="font-label-sm text-label-sm">Weekly Summary</span>
</label>
</div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface mb-1">Contact Details (ስልክ / ኢሜይል)</label>
<input className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-body-md text-on-surface shadow-xs outline-none focus:bg-surface-container-low" placeholder="official.procurement@entity.gov.et" type="email"/>
</div>
<div className="p-3 bg-primary-fixed/20 rounded-lg flex items-center gap-2 text-on-primary-fixed-variant">
<span className="material-symbols-outlined text-[18px]">verified</span>
<span className="font-label-sm text-label-sm">Verified via National ID / Ethio Telecom SMS Gateway</span>
</div>
</div>
<div className="flex items-center justify-end gap-3 mt-6 pt-3">
<button className="px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container" id="cancel-alert-btn">Cancel</button>
<button className="px-5 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors shadow-sm flex items-center gap-1.5" id="confirm-alert-btn">
<span className="material-symbols-outlined text-[18px]">check_circle</span>
<span>Activate Alert</span>
</button>
</div>
</div>
</div>
{/* Top Hero & Search Control Region */}
<div className="w-full bg-surface-container-lowest shadow-sm">
<div className="max-w-[1440px] mx-auto px-gutter py-space-lg">
{/* Breadcrumb */}
<nav aria-label="Breadcrumb" className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant mb-space-sm">
<a className="hover:text-primary transition-colors" href="#">Home</a>
<span className="text-outline-variant">/</span>
<span className="text-primary font-semibold">Browse Tenders (ጨረታዎች)</span>
<span className="bg-surface-container px-2 py-0.5 rounded text-on-surface-variant text-[11px] font-mono-data ml-2">PPA Directive 2016/2024</span>
</nav>
{/* Main Search Bar */}
<div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-space-sm">
<div className="relative flex-1">
<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[22px]">search</span>
</div>
<input className="w-full h-12 pl-11 pr-10 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all" id="main-tender-search" placeholder="Search tenders by keyword, reference number (e.g. ERA/NCB/2024), or procuring entity..." type="text" value="Expressway Road Overlay OR Optical Fiber"/>
<button className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface" id="clear-search-btn">
<span className="material-symbols-outlined text-[20px]">cancel</span>
</button>
</div>
{/* Quick Action Alert Trigger */}
<button className="h-12 px-5 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed flex items-center justify-center gap-2 font-label-md text-label-md transition-all shadow-xs shrink-0" id="open-alert-btn" type="button">
<span className="material-symbols-outlined text-[20px]" style={{"fontVariationSettings": "'FILL' 1"}}>add_alert</span>
<span>Create Alert for This Search</span>
<span className="hidden sm:inline opacity-80">/ ማሳወቂያ ፍጠር</span>
</button>
</div>
{/* Live Filter Chips Strip & Counter */}
<div className="mt-space-md pt-space-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
<div className="flex flex-wrap items-center gap-2">
<span className="font-label-sm text-label-sm text-on-surface-variant font-medium mr-1">Active:</span>
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
<span>Construction &amp; Infrastructure</span>
<button className="hover:text-error text-outline-variant flex items-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
</span>
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
<span>Addis Ababa &amp; Oromia</span>
<button className="hover:text-error text-outline-variant flex items-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
</span>
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
<span>Above ETB 10,000,000</span>
<button className="hover:text-error text-outline-variant flex items-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
</span>
<button className="text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold underline underline-offset-2 ml-1">
            Clear all filters (ሁሉንም አጽዳ)
          </button>
</div>
{/* Metric Counter pill */}
<div className="flex items-center gap-2 text-on-surface-variant shrink-0">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<p className="font-label-sm text-label-sm">
            Showing <strong className="text-on-surface font-mono-data text-mono-data font-bold">1,482</strong> Active Tenders across Ethiopia
          </p>
</div>
</div>
</div>
</div>
{/* Workspace: Sidebar & Results Grid */}
<div className="w-full max-w-[1440px] mx-auto px-gutter py-space-lg">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
{/* LEFT FILTER SIDEBAR */}
<aside className="lg:col-span-4 xl:col-span-3 space-y-space-md lg:sticky lg:top-20">
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-lg">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">tune</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Filter Tenders</h2>
</div>
<button className="text-primary hover:text-primary-container font-label-sm text-label-sm">Reset</button>
</div>
{/* Section: Category */}
<div className="space-y-space-sm">
<div className="flex items-center justify-between cursor-pointer">
<span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Sector / ዘርፍ</span>
<span className="material-symbols-outlined text-[18px] text-outline">expand_less</span>
</div>
<div className="space-y-1.5 pt-1">
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input  className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Construction &amp; Civil Works</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">412</span>
</label>
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input  className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>ICT, Telecom &amp; Hardware</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">284</span>
</label>
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Medical &amp; Pharmaceuticals</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">195</span>
</label>
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Energy &amp; Electrification</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">148</span>
</label>
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Consultancy &amp; Auditing</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">162</span>
</label>
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Agriculture &amp; Agro-Tech</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">110</span>
</label>
</div>
</div>
{/* Section: Region / Jurisdiction */}
<div className="space-y-space-sm pt-2">
<div className="flex items-center justify-between cursor-pointer">
<span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Region / ክልል</span>
<span className="material-symbols-outlined text-[18px] text-outline">expand_less</span>
</div>
<div className="space-y-1.5 pt-1">
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input  className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Addis Ababa (አዲስ አበባ)</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">620</span>
</label>
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input  className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Oromia (ኦሮሚያ)</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">340</span>
</label>
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Amhara (አማራ)</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">210</span>
</label>
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Sidama (ሲዳማ)</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">85</span>
</label>
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Tigray (ትግራይ)</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">75</span>
</label>
</div>
</div>
{/* Section: Organization Type */}
<div className="space-y-space-sm pt-2">
<div className="flex items-center justify-between cursor-pointer">
<span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Entity Type / የተቋም ዓይነት</span>
<span className="material-symbols-outlined text-[18px] text-outline">expand_less</span>
</div>
<div className="space-y-1.5 pt-1">
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input  className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Federal Ministries &amp; Agencies</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">520</span>
</label>
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input  className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>State Enterprises (Ethio, EEP, CBE)</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">410</span>
</label>
<label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<div className="flex items-center gap-2">
<input className="w-4 h-4 accent-primary rounded" type="checkbox"/>
<span>Universities &amp; Specialized Hospitals</span>
</div>
<span className="font-mono-data text-mono-data text-[12px] text-outline font-semibold">280</span>
</label>
</div>
</div>
{/* Section: Budget Range (ETB) */}
<div className="space-y-space-sm pt-2">
<span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Estimated Budget (ETB)</span>
<div className="grid grid-cols-2 gap-2 pt-1">
<div className="bg-surface-container-low p-2 rounded-lg">
<span className="block text-[10px] uppercase font-mono-data text-outline">Min (ብር)</span>
<span className="font-mono-data text-mono-data font-semibold text-on-surface text-[12px]">10,000,000</span>
</div>
<div className="bg-surface-container-low p-2 rounded-lg">
<span className="block text-[10px] uppercase font-mono-data text-outline">Max (ብር)</span>
<span className="font-mono-data text-mono-data font-semibold text-on-surface text-[12px]">500,000,000+</span>
</div>
</div>
{/* Quick budget pills */}
<div className="flex flex-wrap gap-1.5 pt-1">
<button className="px-2 py-1 bg-surface-container hover:bg-surface-dim rounded text-[11px] font-mono-data text-on-surface">1M-10M</button>
<button className="px-2 py-1 bg-primary-container text-on-primary rounded text-[11px] font-mono-data font-semibold">10M-50M</button>
<button className="px-2 py-1 bg-surface-container hover:bg-surface-dim rounded text-[11px] font-mono-data text-on-surface">50M-100M</button>
<button className="px-2 py-1 bg-surface-container hover:bg-surface-dim rounded text-[11px] font-mono-data text-on-surface">100M+</button>
</div>
</div>
{/* Section: Submission Deadline */}
<div className="space-y-space-sm pt-2">
<span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Submission Window</span>
<div className="space-y-1.5 pt-1">
<label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<input className="accent-primary" name="deadline" type="radio"/>
<span className="flex items-center gap-1.5 text-error font-medium">
<span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                  Closing in &lt; 48 Hours (አስቸኳይ)
                </span>
</label>
<label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<input  className="accent-primary" name="deadline" type="radio"/>
<span>Next 7 to 14 Days</span>
</label>
<label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low p-1.5 rounded cursor-pointer">
<input className="accent-primary" name="deadline" type="radio"/>
<span>Next 30 Days (Standard)</span>
</label>
</div>
</div>
{/* Section: Method & Verification */}
<div className="space-y-space-sm pt-2">
<span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Procurement Method</span>
<div className="flex flex-wrap gap-1.5 pt-1">
<span className="px-2.5 py-1 bg-surface-container-low text-primary text-[11px] font-label-sm font-semibold rounded cursor-pointer hover:bg-surface-container">National (NCB)</span>
<span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant text-[11px] font-label-sm rounded cursor-pointer hover:bg-surface-container">International (ICB)</span>
<span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant text-[11px] font-label-sm rounded cursor-pointer hover:bg-surface-container">EOI / Pre-qualification</span>
</div>
</div>
<div className="pt-2">
<button className="w-full h-10 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-label-md text-label-md transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[18px]">restart_alt</span>
<span>Reset All Filters / ሁሉንም አጽዳ</span>
</button>
</div>
</div>
{/* Compliance Helper Box */}
<div className="bg-surface-container-low p-space-md rounded-xl space-y-2">
<div className="flex items-center gap-2 text-primary font-label-md text-label-md">
<span className="material-symbols-outlined text-[18px]">gavel</span>
<span>Electronic Bid Bond (CPO)</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            All tender deposits are secured through verified API integration with Commercial Bank of Ethiopia (CBE) &amp; Telebirr SuperApp. No paper vouchers required.
          </p>
</div>
</aside>
{/* RIGHT RESULTS COLUMN */}
<section className="lg:col-span-8 xl:col-span-9 space-y-space-md">
{/* Controls & Sorters Bar */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-md">
<div className="flex items-center gap-space-sm">
<span className="font-label-sm text-label-sm text-on-surface-variant">View Mode:</span>
<div className="flex bg-surface-container-low p-1 rounded-lg">
<button className="p-1.5 rounded bg-surface-container-lowest text-primary shadow-xs" title="Compact List View">
<span className="material-symbols-outlined text-[18px] block">view_list</span>
</button>
<button className="p-1.5 rounded text-on-surface-variant hover:text-on-surface" title="Expanded Card View">
<span className="material-symbols-outlined text-[18px] block">grid_view</span>
</button>
</div>
<span className="h-4 w-[1px] bg-surface-dim mx-1 hidden sm:block"></span>
<span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">FDRE Public Register</span>
</div>
<div className="flex items-center gap-space-sm">
<label className="font-label-sm text-label-sm text-on-surface-variant shrink-0" htmlFor="sort-select">Sort By:</label>
<div className="relative flex-1 sm:flex-initial">
<select className="h-9 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm appearance-none outline-none cursor-pointer" id="sort-select">
<option>Closing Soonest (የሚጠናቀቁበት ጊዜ)</option>
<option>Newest Published (አዲስ የወጡ)</option>
<option>Highest Budget (ከፍተኛ በጀት)</option>
<option>Tender Bond / CPO Ascending</option>
</select>
<div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[16px]">expand_more</span>
</div>
</div>
</div>
</div>
{/* TENDER LIST CARDS */}
<div className="space-y-space-md">
{/* CARD 1: Ethiopian Roads Administration (ERA) */}
<article className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
{/* Urgent Left Indicator strip */}
<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error"></div>
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md pl-2">
<div className="space-y-2 flex-1">
{/* Entity Row */}
<div className="flex flex-wrap items-center gap-2">
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-surface-container-high text-on-surface font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                    Ethiopian Roads Administration (ERA) • የኢትዮጵያ መንገዶች አስተዳደር
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-mono-data bg-surface-container text-on-surface-variant">
                    Ref: ERA/NCB/58/2024
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-primary-fixed/30 text-on-primary-fixed-variant font-medium">
                    National Competitive Bidding (NCB)
                  </span>
</div>
{/* Tender Title */}
<h3 className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors cursor-pointer leading-snug">
                  Periodic Maintenance and Asphalt Concrete Overlay of Modjo-Adama Expressway Link (Package II)
                </h3>
{/* Key Specifications */}
<div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-body-sm font-body-sm text-on-surface-variant pt-1">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
<span>Oromia Region &amp; East Shewa Zone</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">construction</span>
<span>Grade 1 Civil Road Contractors Only</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">cloud_done</span>
<span>100% Digital Submission Via Chereta e-Portal</span>
</div>
</div>
</div>
{/* Action & Countdown Right Column */}
<div className="flex flex-row sm:flex-col items-end justify-between sm:justify-start gap-3 shrink-0 pl-2 sm:pl-4">
<button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-dim flex items-center justify-center text-outline hover:text-primary transition-colors" title="Bookmark Tender">
<span className="material-symbols-outlined text-[20px]">bookmark_border</span>
</button>
<div className="text-right">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-error-container text-on-error-container font-mono-data text-mono-data font-bold">
<span className="material-symbols-outlined text-[16px] animate-pulse">timer</span>
                    Closing in: 18h 24m
                  </span>
<span className="block text-[11px] font-body-sm text-on-surface-variant mt-1">Tomorrow, 2:00 PM EAT</span>
</div>
</div>
</div>
{/* Financial Data Footer Strip */}
<div className="mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
<div className="grid grid-cols-2 sm:grid-cols-3 gap-space-lg">
<div>
<span className="block text-[11px] font-label-sm uppercase text-outline">Estimated Project Value</span>
<span className="font-mono-data text-mono-data text-[15px] font-bold text-on-surface">ETB 145,000,000</span>
</div>
<div>
<span className="block text-[11px] font-label-sm uppercase text-outline">Bid Bond / CPO (ዋስትና)</span>
<span className="font-mono-data text-mono-data text-[14px] font-semibold text-primary">ETB 500,000</span>
</div>
<div className="hidden sm:block">
<span className="block text-[11px] font-label-sm uppercase text-outline">Electronic CPO Hold</span>
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold">
<span className="material-symbols-outlined text-[14px]">bolt</span>
                    CBE / Telebirr Instant
                  </span>
</div>
</div>
<div className="flex items-center gap-2 justify-end">
<button className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-label-sm text-label-sm transition-colors">
                  Download TOR (PDF)
                </button>
<button className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-sm text-label-sm transition-colors shadow-xs flex items-center gap-1">
<span>View Details / ዝርዝር ይመልከቱ</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</article>
{/* CARD 2: Ethio Telecom (ኢትዮ ቴሌኮም) */}
<article className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
<div className="space-y-2 flex-1">
<div className="flex flex-wrap items-center gap-2">
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-surface-container-high text-on-surface font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                    Ethio Telecom • ኢትዮ ቴሌኮም (State Enterprise)
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-mono-data bg-surface-container text-on-surface-variant">
                    Ref: ET/ICB/CORE-56/24
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-secondary-fixed text-on-secondary-fixed font-medium">
                    International Competitive Bidding (ICB)
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-surface-container-highest text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">sync_alt</span> 3 Addenda Issued
                  </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors cursor-pointer leading-snug">
                  Turnkey Deployment of 5G Metro Core Optical Fiber &amp; Modular Edge Data Centers (Nationwide Multi-Region)
                </h3>
<div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-body-sm font-body-sm text-on-surface-variant pt-1">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">domain</span>
<span>Headquarters, Churchill Road, Addis Ababa (Nationwide Delivery)</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">language</span>
<span>Open to Global Technology Consortiums &amp; Local Partners</span>
</div>
</div>
</div>
<div className="flex flex-row sm:flex-col items-end justify-between sm:justify-start gap-3 shrink-0 pl-2 sm:pl-4">
<button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-dim flex items-center justify-center text-outline hover:text-primary transition-colors" title="Bookmark Tender">
<span className="material-symbols-outlined text-[20px]">bookmark_border</span>
</button>
<div className="text-right">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary-fixed text-on-primary-fixed font-mono-data text-mono-data font-bold">
<span className="material-symbols-outlined text-[16px]">schedule</span>
                    Closes in: 14 Days
                  </span>
<span className="block text-[11px] font-body-sm text-on-surface-variant mt-1">Nov 24, 2024 • 10:00 AM</span>
</div>
</div>
</div>
<div className="mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
<div className="grid grid-cols-2 sm:grid-cols-3 gap-space-lg">
<div>
<span className="block text-[11px] font-label-sm uppercase text-outline">Contract Scope (Multi-Year)</span>
<span className="font-mono-data text-mono-data text-[15px] font-bold text-on-surface">ETB 320,000,000 <span className="text-[11px] font-normal text-outline">/ USD Equiv.</span></span>
</div>
<div>
<span className="block text-[11px] font-label-sm uppercase text-outline">Electronic Bid Bond</span>
<span className="font-mono-data text-mono-data text-[14px] font-semibold text-primary">USD 25,000 / ETB Equiv.</span>
</div>
<div className="hidden sm:block">
<span className="block text-[11px] font-label-sm uppercase text-outline">Document Fee</span>
<span className="font-label-sm text-label-sm text-primary font-bold">Free Electronic Download</span>
</div>
</div>
<div className="flex items-center gap-2 justify-end">
<button className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-label-sm text-label-sm transition-colors">
                  Clarifications (3)
                </button>
<button className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-sm text-label-sm transition-colors shadow-xs flex items-center gap-1">
<span>View Details / ዝርዝር ይመልከቱ</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</article>
{/* CARD 3: Tikur Anbessa Specialized Hospital (Black Lion) */}
<article className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
<div className="space-y-2 flex-1">
<div className="flex flex-wrap items-center gap-2">
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-surface-container-high text-on-surface font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                    Tikur Anbessa Specialized Hospital (TASH) • ጥቁር አንበሳ ሆስፒታል
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-mono-data bg-surface-container text-on-surface-variant">
                    Ref: TASH/MED/981/24
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-primary-fixed/30 text-on-primary-fixed-variant font-medium">
                    National NCB
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-error-container/40 text-on-error-container font-medium">
                    EFDA Pre-Qualified Only
                  </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors cursor-pointer leading-snug">
                  Supply, Installation &amp; 3-Year Maintenance of Hemodialysis Units, Reverse Osmosis Plants, and Cardiac Monitoring Arrays
                </h3>
<div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-body-sm font-body-sm text-on-surface-variant pt-1">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">local_hospital</span>
<span>Lideta Sub-City, Addis Ababa, Ethiopia</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">biotech</span>
<span>Physical Sample Demonstration Required Before Financial Opening</span>
</div>
</div>
</div>
<div className="flex flex-row sm:flex-col items-end justify-between sm:justify-start gap-3 shrink-0 pl-2 sm:pl-4">
<button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-dim flex items-center justify-center text-outline hover:text-primary transition-colors" title="Bookmark Tender">
<span className="material-symbols-outlined text-[20px]">bookmark_border</span>
</button>
<div className="text-right">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-mono-data text-mono-data font-bold">
<span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    Closes in: 8 Days
                  </span>
<span className="block text-[11px] font-body-sm text-on-surface-variant mt-1">Nov 18, 2024 • 2:30 PM</span>
</div>
</div>
</div>
<div className="mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
<div className="grid grid-cols-2 sm:grid-cols-3 gap-space-lg">
<div>
<span className="block text-[11px] font-label-sm uppercase text-outline">Budget Allocation</span>
<span className="font-mono-data text-mono-data text-[15px] font-bold text-on-surface">ETB 28,400,000</span>
</div>
<div>
<span className="block text-[11px] font-label-sm uppercase text-outline">Bid Security (CPO)</span>
<span className="font-mono-data text-mono-data text-[14px] font-semibold text-primary">ETB 150,000</span>
</div>
<div className="hidden sm:block">
<span className="block text-[11px] font-label-sm uppercase text-outline">Compliance Rule</span>
<span className="font-label-sm text-label-sm text-on-surface">FDA Import Permit Validated</span>
</div>
</div>
<div className="flex items-center gap-2 justify-end">
<button className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-label-sm text-label-sm transition-colors">
                  Tech Specs
                </button>
<button className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-sm text-label-sm transition-colors shadow-xs flex items-center gap-1">
<span>View Details / ዝርዝር ይመልከቱ</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</article>
{/* CARD 4: Ethiopian Electric Power (EEP) */}
<article className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
<div className="space-y-2 flex-1">
<div className="flex flex-wrap items-center gap-2">
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-surface-container-high text-on-surface font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                    Ethiopian Electric Power (EEP) • የኢትዮጵያ ኤሌክትሪክ ኃይል
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-mono-data bg-surface-container text-on-surface-variant">
                    Ref: EEP/TRANS/HW-04
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-primary-fixed/30 text-on-primary-fixed-variant font-medium">
                    National Competitive Bidding (NCB)
                  </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors cursor-pointer leading-snug">
                  Supply and Delivery of 132kV Substation Transmission Line Insulators, High-Voltage Capacitors &amp; Switchgear Replacement
                </h3>
<div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-body-sm font-body-sm text-on-surface-variant pt-1">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">electric_bolt</span>
<span>Hawassa Regional Substation &amp; Sidama Interconnected Grid</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">shield</span>
<span>ISO 9001 Certified Electrical Manufacturers</span>
</div>
</div>
</div>
<div className="flex flex-row sm:flex-col items-end justify-between sm:justify-start gap-3 shrink-0 pl-2 sm:pl-4">
<button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-dim flex items-center justify-center text-outline hover:text-primary transition-colors" title="Bookmark Tender">
<span className="material-symbols-outlined text-[20px]">bookmark_border</span>
</button>
<div className="text-right">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary-fixed text-on-primary-fixed font-mono-data text-mono-data font-bold">
<span className="material-symbols-outlined text-[16px]">schedule</span>
                    Closes in: 21 Days
                  </span>
<span className="block text-[11px] font-body-sm text-on-surface-variant mt-1">Dec 01, 2024 • 11:30 AM</span>
</div>
</div>
</div>
<div className="mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
<div className="grid grid-cols-2 sm:grid-cols-3 gap-space-lg">
<div>
<span className="block text-[11px] font-label-sm uppercase text-outline">Project Budget</span>
<span className="font-mono-data text-mono-data text-[15px] font-bold text-on-surface">ETB 45,000,000</span>
</div>
<div>
<span className="block text-[11px] font-label-sm uppercase text-outline">Automated CPO Hold</span>
<span className="font-mono-data text-mono-data text-[14px] font-semibold text-primary">ETB 300,000</span>
</div>
<div className="hidden sm:block">
<span className="block text-[11px] font-label-sm uppercase text-outline">Currency Option</span>
<span className="font-label-sm text-label-sm text-on-surface">ETB / LC Transfer</span>
</div>
</div>
<div className="flex items-center gap-2 justify-end">
<button className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-label-sm text-label-sm transition-colors">
                  BOQ Matrix
                </button>
<button className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-sm text-label-sm transition-colors shadow-xs flex items-center gap-1">
<span>View Details / ዝርዝር ይመልከቱ</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</article>
{/* CARD 5: Bahir Dar University */}
<article className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
<div className="space-y-2 flex-1">
<div className="flex flex-wrap items-center gap-2">
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-surface-container-high text-on-surface font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                    Bahir Dar University • ባሕር ዳር ዩኒቨርሲቲ (Public University)
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-mono-data bg-surface-container text-on-surface-variant">
                    Ref: BDU/ENG/2024/112
                  </span>
<span className="px-2 py-0.5 rounded text-[11px] font-label-sm bg-primary-fixed/30 text-on-primary-fixed-variant font-medium">
                    NCB Grade 1 Contractors
                  </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors cursor-pointer leading-snug">
                  Construction of 4-Storey Post-Graduate STEM Research Laboratory Complex &amp; Lecture Amphitheater at Peda Campus
                </h3>
<div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-body-sm font-body-sm text-on-surface-variant pt-1">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">school</span>
<span>Peda Main Campus, Bahir Dar City, Amhara Region</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
<span>720 Calendar Days Contract Duration</span>
</div>
</div>
</div>
<div className="flex flex-row sm:flex-col items-end justify-between sm:justify-start gap-3 shrink-0 pl-2 sm:pl-4">
<button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-dim flex items-center justify-center text-outline hover:text-primary transition-colors" title="Bookmark Tender">
<span className="material-symbols-outlined text-[20px]">bookmark_border</span>
</button>
<div className="text-right">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-mono-data text-mono-data font-bold">
<span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    Closes in: 11 Days
                  </span>
<span className="block text-[11px] font-body-sm text-on-surface-variant mt-1">Nov 21, 2024 • 4:00 PM</span>
</div>
</div>
</div>
<div className="mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
<div className="grid grid-cols-2 sm:grid-cols-3 gap-space-lg">
<div>
<span className="block text-[11px] font-label-sm uppercase text-outline">Construction Estimate</span>
<span className="font-mono-data text-mono-data text-[15px] font-bold text-on-surface">ETB 92,000,000</span>
</div>
<div>
<span className="block text-[11px] font-label-sm uppercase text-outline">Bid Security (CPO)</span>
<span className="font-mono-data text-mono-data text-[14px] font-semibold text-primary">ETB 400,000</span>
</div>
<div className="hidden sm:block">
<span className="block text-[11px] font-label-sm uppercase text-outline">Site Visit</span>
<span className="font-label-sm text-label-sm text-on-surface">Mandatory Pre-Bid Conference</span>
</div>
</div>
<div className="flex items-center gap-2 justify-end">
<button className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-label-sm text-label-sm transition-colors">
                  Architectural Drawings
                </button>
<button className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-sm text-label-sm transition-colors shadow-xs flex items-center gap-1">
<span>View Details / ዝርዝር ይመልከቱ</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</article>
</div>
{/* COLLAPSIBLE FRIENDLY EMPTY-STATE REFERENCE / PREVIEW BOX */}
<div className="bg-surface-container-low rounded-xl p-space-lg border-dashed">
<div className="flex items-start gap-4">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-outline shrink-0">
<span className="material-symbols-outlined text-[28px]">search_off</span>
</div>
<div className="space-y-1.5 flex-1">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-outline">Empty State Sample</span>
<span className="text-outline text-[12px]">• Simulated query: &quot;XYZ123&quot; in Tigray</span>
</div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">No matching tenders found for specific criteria</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
                Try loosening your filters (e.g. broadening your budget range, setting all regions, or using broader category terms). Federal procurement notices are updated daily at 08:30 AM and 02:00 PM EAT.
              </p>
<div className="flex flex-wrap items-center gap-3 pt-2">
<button className="px-3 py-1.5 bg-surface-container-lowest text-primary hover:bg-surface-container rounded-lg font-label-sm text-label-sm shadow-xs">
                  Reset specific filters
                </button>
<button className="px-3 py-1.5 bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim rounded-lg font-label-sm text-label-sm flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">notification_add</span>
<span>Alert me when published</span>
</button>
</div>
</div>
</div>
</div>
{/* PAGINATION & RESULTS FOOTER */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-space-md">
<div className="font-body-sm text-body-sm text-on-surface-variant">
            Showing <span className="font-mono-data text-mono-data font-semibold text-on-surface">1 - 5</span> of <span className="font-mono-data text-mono-data font-semibold text-on-surface">1,482</span> tenders
          </div>
{/* Page numbers */}
<div className="flex items-center gap-1 font-mono-data text-mono-data text-[13px]">
<button className="h-9 px-2.5 rounded-lg bg-surface-container-low text-outline cursor-not-allowed opacity-50 flex items-center justify-center" >
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="h-9 w-9 rounded-lg bg-primary-container text-on-primary font-bold shadow-xs">1</button>
<button className="h-9 w-9 rounded-lg hover:bg-surface-container text-on-surface">2</button>
<button className="h-9 w-9 rounded-lg hover:bg-surface-container text-on-surface">3</button>
<span className="px-1 text-outline">...</span>
<button className="h-9 w-9 rounded-lg hover:bg-surface-container text-on-surface">148</button>
<button className="h-9 px-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
{/* Items per page selector */}
<div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
<span>Per page:</span>
<select className="h-8 px-2 rounded bg-surface-container-low text-on-surface text-[12px] outline-none">
<option >5 tenders</option>
<option>15 tenders</option>
<option>25 tenders</option>
<option>50 tenders</option>
</select>
</div>
</div>
</section>
</div>
</div>
{/* PERSISTENT BOTTOM FLOATING SNACKBAR */}
<div className="sticky bottom-4 mx-auto z-40 max-w-[900px] w-[95%]">
<div className="bg-inverse-surface text-inverse-on-surface p-space-md rounded-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-space-md">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-on-secondary shrink-0">
<span className="material-symbols-outlined text-[18px]">bookmark</span>
</div>
<div>
<p className="font-label-md text-label-md">Save this filtered procurement view</p>
<p className="font-label-sm text-label-sm text-inverse-on-surface/70">ፍለጋውን አስቀምጥ • Receive daily matched tenders via Telegram or Email</p>
</div>
</div>
<div className="flex items-center gap-2 shrink-0">
<button className="px-3 py-1.5 rounded-lg bg-surface-container-highest/20 hover:bg-surface-container-highest/30 text-inverse-on-surface font-label-sm text-label-sm">
          Copy Share Link
        </button>
<button className="px-4 py-1.5 rounded-lg bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5" id="floating-alert-btn">
<span className="material-symbols-outlined text-[16px]">notifications</span>
<span>Save Search</span>
</button>
</div>
</div>
</div>
</div>
</main><footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-margin"><div className="w-full max-w-[1440px] mx-auto px-gutter pt-margin pb-space-xl"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter pb-margin"><div className="lg:col-span-2 space-y-space-md pr-0 lg:pr-margin"><div className="flex items-center gap-space-sm"><div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary"><span className="material-symbols-outlined text-[20px]">gavel</span></div><div className="font-headline-sm text-headline-sm text-primary tracking-tight">Chereta <span className="text-on-surface font-normal text-body-md">| ጨረታ</span></div></div><p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">The national open digital procurement portal of the Federal Democratic Republic of Ethiopia. Empowering institutional transparency, standardized bidding, and verified supplier certification.</p><div className="flex items-center gap-space-sm text-on-surface-variant"><span className="material-symbols-outlined text-[20px] text-secondary">verified_user</span><span className="font-label-sm text-label-sm">Federal Public Procurement Directive No. 2016/2024 Verified</span></div></div><div><div className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">Procurement</div><ul className="space-y-space-sm font-body-md text-body-md text-on-surface-variant"><li className="hover:text-primary transition-colors"><a data-path="tenders" href="#">Active Tenders</a></li><li className="hover:text-primary transition-colors"><a data-path="post-tender" href="#">Post Tender Notice</a></li><li className="hover:text-primary transition-colors"><a data-path="directive-reference" href="#">Directive 2016/2024</a></li><li className="hover:text-primary transition-colors"><a data-path="cpo-verification" href="#">CPO Verification Hub</a></li><li className="hover:text-primary transition-colors"><a data-path="categories" href="#">Regional Procurement</a></li></ul></div><div><div className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">Financial Systems</div><ul className="space-y-space-sm font-body-md text-body-md text-on-surface-variant"><li className="flex items-center gap-space-xs hover:text-primary transition-colors"><span className="material-symbols-outlined text-[16px] text-primary">account_balance</span><a data-path="financial-gateways" href="#">Telebirr Gateway</a></li><li className="flex items-center gap-space-xs hover:text-primary transition-colors"><span className="material-symbols-outlined text-[16px] text-primary">account_balance</span><a data-path="financial-gateways" href="#">Commercial Bank of Ethiopia</a></li><li className="hover:text-primary transition-colors"><a data-path="financial-gateways" href="#">Electronic Bid Bond (CPO)</a></li><li className="hover:text-primary transition-colors"><a data-path="pricing" href="#">Fee Schedule</a></li><li className="hover:text-primary transition-colors"><a data-path="terms-of-service" href="#">Audit Compliance</a></li></ul></div><div><div className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">Contact &amp; Support</div><div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant"><div className="flex items-start gap-space-xs"><span className="material-symbols-outlined text-[18px] text-primary mt-0.5">location_on</span><span>Arada Sub-city, Woreda 01, Commercial Nomads Tower, Addis Ababa, Ethiopia</span></div><div className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-[18px] text-primary">call</span><span>National Hotline: <strong className="font-mono-data text-mono-data text-on-surface font-semibold">8989</strong></span></div><div className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-[18px] text-primary">mail</span><span>desk@chereta.gov.et</span></div><div className="pt-space-xs flex items-center gap-space-sm text-on-surface-variant"><a className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all" data-path="contact" href="#"><span className="material-symbols-outlined text-[18px]">public</span></a><a className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all" data-path="contact" href="#"><span className="material-symbols-outlined text-[18px]">forum</span></a><a className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all" data-path="contact" href="#"><span className="material-symbols-outlined text-[18px]">share</span></a></div></div></div></div><div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md font-label-sm text-label-sm text-on-surface-variant"><div className="flex items-center gap-space-xs"><span>© 2025 Chereta (ጨረታ) e-Procurement Authority. All rights reserved.</span></div><div className="flex items-center gap-space-lg"><a className="hover:text-on-surface transition-colors" data-path="terms-of-service" href="#">Terms of Service</a><a className="hover:text-on-surface transition-colors" data-path="privacy-policy" href="#">Data Privacy &amp; Protection</a><a className="hover:text-on-surface transition-colors" data-path="directive-reference" href="#">Public Procurement Directives</a></div></div></div></footer>

    </>
  );
}
